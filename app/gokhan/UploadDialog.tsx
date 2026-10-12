"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { extractDominantColor } from "@/lib/colorExtractor";
import { adminFetch } from "./adminFetch";
import TemplateThumb from "./TemplateThumb";
import type { MediaData } from "./mediaTypes";

const BUCKET = "media-library";
const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPT = ".json,.lottie,.png,.jpg,.jpeg,.webp";

const input =
  "w-full px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none";
const label = "block text-xs font-semibold uppercase tracking-wide text-[#5B6B75] mb-1.5";

const extensionOf = (name: string) => name.toLowerCase().split(".").pop() ?? "";
const kindOf = (name: string) => (["json", "lottie"].includes(extensionOf(name)) ? "lottie" : "image");

// "birthday-balloons_v2.json" -> "Birthday Balloons V2"
const nameFromFile = (file: string) =>
  file
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function UploadDialog({
  occasions,
  defaultOccasion,
  onClose,
  onUploaded,
}: {
  occasions: MediaData["occasions"];
  defaultOccasion: string;
  onClose: () => void;
  onUploaded: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState(defaultOccasion || occasions[0]?.value || "");
  const [helperColor, setHelperColor] = useState("#2CB1A6");
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The preview is a local object URL; release each one once replaced.
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const pick = async (picked: File | undefined) => {
    setError(null);
    if (!picked) return;
    const ext = extensionOf(picked.name);
    if (!ACCEPT.split(",").includes(`.${ext}`)) return setError("Use a .json or .lottie animation, or a .png, .jpg or .webp image.");
    if (picked.size > MAX_BYTES) return setError("Files must be under 20 MB.");
    if (ext === "json") {
      try {
        const json = JSON.parse(await picked.text());
        if (!Array.isArray(json.layers)) throw new Error();
      } catch {
        return setError("That JSON file isn't a Lottie animation.");
      }
    }
    const url = URL.createObjectURL(picked);
    setFile(picked);
    setPreview(url);
    setName(nameFromFile(picked.name));
    if (kindOf(picked.name) === "image") extractDominantColor(url, 0).then(setHelperColor);
  };

  const upload = async () => {
    if (!file) return;
    setError(null);
    try {
      setStep("Preparing…");
      const target = await adminFetch<{ path: string; token: string; contentType: string }>(
        "/api/gokhan/media/upload-url",
        { method: "POST", body: JSON.stringify({ filename: file.name, size: file.size }) }
      );
      setStep("Uploading…");
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .uploadToSignedUrl(target.path, target.token, file, { contentType: target.contentType });
      if (uploadError) throw new Error(uploadError.message);
      setStep("Checking…");
      await adminFetch("/api/gokhan/media", {
        method: "POST",
        body: JSON.stringify({ path: target.path, name, occasion_type: occasion, helper_color: helperColor }),
      });
      onUploaded();
    } catch (e) {
      setError((e as Error).message);
      setStep(null);
    }
  };

  const busy = step !== null;
  const kind = file ? kindOf(file.name) : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 md:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl" role="dialog" aria-modal="true" aria-label="Upload media">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5EAF0]">
          <h2 className="text-lg font-bold text-[#0B1F2A]">Upload</h2>
          <button onClick={onClose} disabled={busy} className="text-2xl leading-none text-[#5B6B75] hover:text-[#0B1F2A]" aria-label="Close">
            ×
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <label className="flex items-center gap-4 rounded-lg border-2 border-dashed border-[#E5EAF0] p-4 cursor-pointer hover:border-[#2CB1A6]">
            <TemplateThumb
              className="w-20"
              lottiePath={kind === "lottie" && file ? previewSrc(file, preview) : null}
              image={kind === "image" && preview ? { source_type: "local", file_path: preview, remote_url: null, name } : null}
            />
            <span className="text-sm text-[#5B6B75]">
              {file ? (
                <>
                  <span className="block font-semibold text-[#0B1F2A] break-all">{file.name}</span>
                  {(file.size / 1024).toFixed(0)} KB · choose another file
                </>
              ) : (
                <>Choose a Lottie (.json, .lottie) or an image (.png, .jpg, .webp), up to 20 MB.</>
              )}
            </span>
            <input type="file" accept={ACCEPT} className="hidden" disabled={busy} onChange={(e) => pick(e.target.files?.[0])} />
          </label>

          <div>
            <label className={label} htmlFor="up-name">Name</label>
            <input id="up-name" value={name} onChange={(e) => setName(e.target.value)} className={input} maxLength={100} />
          </div>
          <div>
            <label className={label} htmlFor="up-occasion">Occasion</label>
            <select id="up-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} className={input}>
              {occasions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={label}>Helper colour</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={helperColor}
                onChange={(e) => setHelperColor(e.target.value)}
                className="w-10 h-10 p-0.5 rounded-lg border-2 border-[#E5EAF0] bg-white cursor-pointer"
                aria-label="Helper colour"
              />
              <span className="text-xs text-[#5B6B75]">
                Used for accents next to this {kind === "image" ? "image (picked from it automatically)" : "animation"}.
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 px-5 py-4 border-t border-[#E5EAF0]">
          {error && <p className="mr-auto text-sm text-red-600">{error}</p>}
          {step && <p className="mr-auto text-sm text-[#5B6B75]">{step}</p>}
          <button onClick={onClose} disabled={busy} className="px-4 py-2 rounded-full text-sm font-semibold text-[#5B6B75] hover:text-[#0B1F2A]">
            Cancel
          </button>
          <button
            onClick={upload}
            disabled={!file || !name.trim() || busy}
            className="px-5 py-2 rounded-full bg-[#2CB1A6] text-white text-sm font-semibold hover:bg-[#249a90] disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

// LazyLottie decides between JSON and dotLottie by the path's extension, and
// blob URLs have none, so tag the object URL with the file's extension.
function previewSrc(file: File, preview: string | null) {
  if (!preview) return null;
  return extensionOf(file.name) === "lottie" ? `${preview}#.lottie` : preview;
}
