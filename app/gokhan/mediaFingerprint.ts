// Fingerprints for the duplicate finder, computed in the browser so the
// server never has to download every file.
//
// Images: a hash of the file bytes, so only exact copies match.
// Animations: a hash of the animation's structure (size, frame range and
// layer names/types), so the same animation saved as .json and as .lottie
// still matches.

async function sha1(data: BufferSource): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-1", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function inflate(bytes: Uint8Array, method: number): Promise<Uint8Array> {
  if (method === 0) return bytes;
  if (method !== 8) throw new Error(`Unsupported zip compression ${method}`);
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// The first animation inside a .lottie (zip) file: animations/*.json in
// dotLottie 1.0, a/*.json in 2.0. Read through the zip's central directory
// so data-descriptor zips work too.
async function animationFromDotLottie(buffer: ArrayBuffer): Promise<unknown> {
  const view = new DataView(buffer);
  let eocd = -1;
  for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("Not a zip file");
  const entries = view.getUint16(eocd + 10, true);
  let at = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();
  for (let n = 0; n < entries; n++) {
    if (view.getUint32(at, true) !== 0x02014b50) break;
    const method = view.getUint16(at + 10, true);
    const compressedSize = view.getUint32(at + 20, true);
    const nameLength = view.getUint16(at + 28, true);
    const extraLength = view.getUint16(at + 30, true);
    const commentLength = view.getUint16(at + 32, true);
    const localOffset = view.getUint32(at + 42, true);
    const name = decoder.decode(new Uint8Array(buffer, at + 46, nameLength));
    at += 46 + nameLength + extraLength + commentLength;
    if (!/^(animations|a)\/.+\.json$/.test(name)) continue;
    const dataStart = localOffset + 30 + view.getUint16(localOffset + 26, true) + view.getUint16(localOffset + 28, true);
    const data = await inflate(new Uint8Array(buffer, dataStart, compressedSize), method);
    return JSON.parse(decoder.decode(data));
  }
  throw new Error("No animation inside .lottie file");
}

interface LottieJson {
  w?: number;
  h?: number;
  fr?: number;
  ip?: number;
  op?: number;
  layers?: { nm?: string; ty?: number; ip?: number; op?: number }[];
}

export async function fingerprint(kind: "lottie" | "image", url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  if (kind === "image") return sha1(buffer);

  const isZip = new Uint8Array(buffer, 0, 2)[0] === 0x50 && new Uint8Array(buffer, 0, 2)[1] === 0x4b;
  const json = (isZip ? await animationFromDotLottie(buffer) : JSON.parse(new TextDecoder().decode(buffer))) as LottieJson;
  const shape = {
    w: json.w,
    h: json.h,
    fr: json.fr,
    ip: json.ip,
    op: json.op,
    layers: (json.layers ?? []).map((l) => [l.nm ?? "", l.ty ?? -1, l.ip ?? 0, l.op ?? 0]),
  };
  return sha1(new TextEncoder().encode(JSON.stringify(shape)));
}
