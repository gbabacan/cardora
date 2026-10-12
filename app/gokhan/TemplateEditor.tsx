"use client";

import { useEffect, useMemo, useState } from "react";
import { FONTS } from "@/lib/fonts";
import { formatOccasionLabel } from "@/lib/occasionLabels";
import { adminFetch } from "./adminFetch";
import TemplateThumb from "./TemplateThumb";
import type { AdminTemplate, Format, TemplatesData } from "./templateTypes";

interface MessageDraft {
  key: string;
  id?: string;
  author: string;
  text: string;
  rich?: boolean;
  originalText?: string;
}

type MediaChoice = { kind: "lottie" | "image"; id: string } | null;

const input =
  "w-full px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none";
const label = "block text-xs font-semibold uppercase tracking-wide text-[#5B6B75] mb-1.5";

let draftKey = 0;
const newKey = () => `m${++draftKey}`;

function ColorField({ value, onChange, name }: { value: string; onChange: (v: string) => void; name: string }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-0.5 rounded-lg border-2 border-[#E5EAF0] bg-white cursor-pointer"
        aria-label={name}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${input} font-mono w-28`}
        aria-label={`${name} hex`}
      />
    </div>
  );
}

export default function TemplateEditor({
  data,
  template,
  onClose,
  onSaved,
}: {
  data: TemplatesData;
  template: AdminTemplate | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = template === null;
  const [formats, setFormats] = useState<Format[]>(template ? [template.format] : ["board", "card"]);
  const [title, setTitle] = useState(template?.title ?? "");
  const [occasion, setOccasion] = useState(template?.occasion ?? data.occasions[0]?.value ?? "");
  const [media, setMedia] = useState<MediaChoice>(template?.media ? { kind: template.media.kind, id: template.media.id } : null);
  const [titleFont, setTitleFont] = useState(template?.titleFont ?? "Inter");
  const [titleColor, setTitleColor] = useState(template?.titleColor ?? "#0B1F2A");
  const [envelopeColor, setEnvelopeColor] = useState(template?.envelopeColor ?? "#9d2c3e");
  const [pageColor, setPageColor] = useState<string | null>(template ? template.pageColor : "#FCE7F3");
  const [effectId, setEffectId] = useState(template?.effectId ?? "");
  const [recipient, setRecipient] = useState(template?.recipient ?? "Sarah Bennett");
  const [messages, setMessages] = useState<MessageDraft[] | null>(isNew ? [] : null);
  const [initialMessages, setInitialMessages] = useState<MessageDraft[]>([]);
  const [mediaTab, setMediaTab] = useState<"lottie" | "image">(template?.media?.kind ?? "lottie");
  const [allMedia, setAllMedia] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasBoard = formats.includes("board");
  const hasCard = formats.includes("card");

  useEffect(() => {
    if (!template) return;
    let cancelled = false;
    adminFetch<{ messages: { id: string; author: string; text: string; rich: boolean }[] }>(
      `/api/gokhan/templates/${template.id}`
    )
      .then(({ messages: loaded }) => {
        if (cancelled) return;
        const drafts = loaded.map((m) => ({ ...m, key: m.id, originalText: m.text }));
        setMessages(drafts);
        setInitialMessages(drafts);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [template]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const occasionLabel = formatOccasionLabel(occasion);
  const mediaOptions = useMemo(() => {
    const matches = (o: string | null) => allMedia || formatOccasionLabel(o ?? "") === occasionLabel;
    return mediaTab === "lottie"
      ? data.lotties.filter((l) => matches(l.occasion_type)).map((l) => ({ id: l.id, name: l.name, lottie: l.file_path }))
      : data.images.filter((i) => matches(i.occasion_type)).map((i) => ({ id: i.id, name: i.name ?? "", image: i }));
  }, [data, mediaTab, allMedia, occasionLabel]);

  const selectedLottie = media?.kind === "lottie" ? data.lotties.find((l) => l.id === media.id) : undefined;
  const selectedImage = media?.kind === "image" ? data.images.find((i) => i.id === media.id) : undefined;

  const updateMessage = (key: string, patch: Partial<MessageDraft>) =>
    setMessages((list) => list && list.map((m) => (m.key === key ? { ...m, ...patch } : m)));

  const save = async () => {
    setError(null);
    if (!title.trim()) return setError("Add a title.");
    if (!media) return setError("Pick an animation or image.");
    if (formats.length === 0) return setError("Choose board, card or both.");
    if (!messages) return;
    const cleanMessages = messages
      .filter((m) => m.text.trim() || m.id)
      .map((m) => ({ ...(m.id ? { id: m.id } : {}), author: m.author.trim(), text: m.text.trim() }));
    if (cleanMessages.some((m) => !m.author || !m.text)) return setError("Every message needs an author and text.");

    const fields: Record<string, unknown> = {
      title,
      occasion_type: occasion,
      media,
      title_font: titleFont,
      title_font_color: titleColor,
      recipient,
      ...(hasCard ? { envelope_color: envelopeColor, page_color: pageColor } : {}),
      ...(hasBoard ? { effect_id: effectId || null } : {}),
    };

    setSaving(true);
    try {
      if (isNew) {
        await adminFetch("/api/gokhan/templates", {
          method: "POST",
          body: JSON.stringify({ ...fields, formats, messages: cleanMessages }),
        });
      } else {
        // Send only what changed, so untouched values (and untouched rich
        // messages) are left exactly as they are.
        const before: Record<string, unknown> = {
          title: template.title,
          occasion_type: template.occasion,
          media: template.media ? { kind: template.media.kind, id: template.media.id } : null,
          title_font: template.titleFont,
          title_font_color: template.titleColor,
          recipient: template.recipient,
          envelope_color: template.envelopeColor,
          page_color: template.pageColor,
          effect_id: template.effectId,
        };
        const changed = Object.fromEntries(
          Object.entries(fields).filter(([k, v]) => JSON.stringify(v ?? null) !== JSON.stringify(before[k] ?? null))
        );
        const initial = initialMessages.map((m) => ({ id: m.id, author: m.author, text: m.text }));
        if (JSON.stringify(cleanMessages) !== JSON.stringify(initial)) changed.messages = cleanMessages;
        if (Object.keys(changed).length === 0) return onClose();
        await adminFetch(`/api/gokhan/templates/${template.id}`, { method: "PATCH", body: JSON.stringify(changed) });
      }
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 md:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl" role="dialog" aria-modal="true" aria-label="Edit template">
        <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-[#E5EAF0]">
          <h2 className="text-lg font-bold text-[#0B1F2A]">
            {isNew ? "New template" : `Edit ${template.format}: ${template.title}`}
          </h2>
          <button onClick={onClose} disabled={saving} className="text-2xl leading-none text-[#5B6B75] hover:text-[#0B1F2A]" aria-label="Close">
            ×
          </button>
        </div>

        <div className="px-5 md:px-6 py-5 space-y-6">
          {isNew && (
            <div>
              <span className={label}>Create as</span>
              <div className="flex gap-4">
                {(["board", "card"] as const).map((f) => (
                  <label key={f} className="flex items-center gap-2 text-sm text-[#0B1F2A]">
                    <input
                      type="checkbox"
                      checked={formats.includes(f)}
                      onChange={(e) => setFormats((list) => (e.target.checked ? [...list, f] : list.filter((x) => x !== f)))}
                      className="accent-[#2CB1A6]"
                    />
                    {f === "board" ? "Board" : "Card"}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={label} htmlFor="tpl-title">Title</label>
              <input id="tpl-title" value={title} onChange={(e) => setTitle(e.target.value)} className={input} maxLength={200} />
            </div>
            <div>
              <label className={label} htmlFor="tpl-occasion">Occasion</label>
              <select id="tpl-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} className={input}>
                {data.occasions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className={`${label} mb-0`}>Background</span>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 rounded-lg border-2 border-[#E5EAF0] p-0.5">
                  {(["lottie", "image"] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => setMediaTab(k)}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        mediaTab === k ? "bg-[#2CB1A6] text-white" : "text-[#5B6B75]"
                      }`}
                    >
                      {k === "lottie" ? "Animations" : "Images"}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-1.5 text-xs text-[#5B6B75]">
                  <input type="checkbox" checked={allMedia} onChange={(e) => setAllMedia(e.target.checked)} className="accent-[#2CB1A6]" />
                  All occasions
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 flex-shrink-0">
                <TemplateThumb lottiePath={selectedLottie?.file_path} image={selectedImage} className="w-24" />
                <p className="mt-1 text-xs text-[#5B6B75] break-words">
                  {selectedLottie?.name ?? selectedImage?.name ?? "Nothing picked"}
                </p>
              </div>
              <div className="flex-1 min-w-0 h-56 overflow-y-auto rounded-lg border-2 border-[#E5EAF0] p-2">
                {mediaOptions.length === 0 ? (
                  <p className="p-2 text-sm text-[#5B6B75]">
                    No {mediaTab === "lottie" ? "animations" : "images"} for {occasionLabel}. Tick “All occasions”.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {mediaOptions.map((o) => {
                      const selected = media?.kind === mediaTab && media.id === o.id;
                      return (
                        <button
                          key={o.id}
                          onClick={() => setMedia({ kind: mediaTab, id: o.id })}
                          title={o.name}
                          className={`rounded-md p-0.5 border-2 ${selected ? "border-[#2CB1A6]" : "border-transparent hover:border-[#E5EAF0]"}`}
                        >
                          <TemplateThumb lottiePath={"lottie" in o ? o.lottie : null} image={"image" in o ? o.image : null} className="w-full" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={label} htmlFor="tpl-font">Title font</label>
              <select id="tpl-font" value={titleFont} onChange={(e) => setTitleFont(e.target.value)} className={input}>
                {(["Professional", "Playful", "Handwriting"] as const).map((category) => (
                  <optgroup key={category} label={category}>
                    {FONTS.filter((f) => f.category === category).map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <span className={label}>Title colour</span>
              <ColorField value={titleColor} onChange={setTitleColor} name="Title colour" />
            </div>
            {hasBoard && (
              <div>
                <label className={label} htmlFor="tpl-effect">Effect {hasCard && "(board only)"}</label>
                <select id="tpl-effect" value={effectId} onChange={(e) => setEffectId(e.target.value)} className={input}>
                  <option value="">None</option>
                  {data.effects.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {hasCard && (
              <>
                <div>
                  <span className={label}>Envelope colour {hasBoard && "(card only)"}</span>
                  <ColorField value={envelopeColor} onChange={setEnvelopeColor} name="Envelope colour" />
                </div>
                <div>
                  <span className={label}>Page colour {hasBoard && "(card only)"}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-sm text-[#0B1F2A]">
                      <input
                        type="checkbox"
                        checked={pageColor !== null}
                        onChange={(e) => setPageColor(e.target.checked ? "#FCE7F3" : null)}
                        className="accent-[#2CB1A6]"
                      />
                      Use
                    </label>
                    {pageColor !== null && <ColorField value={pageColor} onChange={setPageColor} name="Page colour" />}
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <label className={label} htmlFor="tpl-recipient">Recipient</label>
            <input id="tpl-recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} className={input} maxLength={100} />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <span className={`${label} mb-0`}>Messages</span>
              {hasCard && <span className="text-xs text-[#5B6B75]">Cards show only the first message.</span>}
            </div>
            {messages === null ? (
              <div className="h-24 rounded-lg bg-[#F7FAFC] animate-pulse" />
            ) : (
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div key={m.key} className="rounded-lg border-2 border-[#E5EAF0] p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#5B6B75]">{i + 1}.</span>
                      <input
                        value={m.author}
                        onChange={(e) => updateMessage(m.key, { author: e.target.value })}
                        placeholder="From"
                        className={`${input} py-1.5`}
                        maxLength={100}
                      />
                      <button
                        onClick={() => setMessages((list) => list && list.filter((x) => x.key !== m.key))}
                        className="px-2 text-sm text-[#5B6B75] hover:text-red-600"
                        aria-label={`Remove message ${i + 1}`}
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={m.text}
                      onChange={(e) => updateMessage(m.key, { text: e.target.value })}
                      rows={3}
                      className={`${input} resize-y`}
                      maxLength={5000}
                    />
                    {m.rich && m.text !== m.originalText && (
                      <p className="mt-1 text-xs text-amber-700">
                        This message has formatting (colours, bold…). Saving your edit keeps the text but drops the formatting.
                      </p>
                    )}
                  </div>
                ))}
                <button
                  onClick={() =>
                    setMessages((list) => [...(list ?? []), { key: newKey(), author: "", text: "" }])
                  }
                  className="text-sm font-semibold text-[#2CB1A6] hover:underline"
                >
                  + Add message
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 px-5 md:px-6 py-4 border-t border-[#E5EAF0]">
          {error && <p className="mr-auto text-sm text-red-600">{error}</p>}
          <button onClick={onClose} disabled={saving} className="px-4 py-2 rounded-full text-sm font-semibold text-[#5B6B75] hover:text-[#0B1F2A]">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || messages === null}
            className="px-5 py-2 rounded-full bg-[#2CB1A6] text-white text-sm font-semibold hover:bg-[#249a90] disabled:opacity-50"
          >
            {saving ? "Saving…" : isNew ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
