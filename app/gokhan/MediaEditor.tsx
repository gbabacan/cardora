"use client";

import { useState } from "react";
import { adminFetch } from "./adminFetch";
import TemplateThumb from "./TemplateThumb";
import { viewPath } from "./templateTypes";
import { fileTypeOf, type MediaData, type MediaItem } from "./mediaTypes";

const input =
  "w-full px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none";
const label = "block text-xs font-semibold uppercase tracking-wide text-[#5B6B75] mb-1.5";

export default function MediaEditor({
  item,
  occasions,
  onClose,
  onSaved,
  onMakeTemplate,
}: {
  item: MediaItem;
  occasions: MediaData["occasions"];
  onClose: () => void;
  onSaved: () => void;
  onMakeTemplate: (item: MediaItem) => void;
}) {
  const [name, setName] = useState(item.name);
  const [occasion, setOccasion] = useState(item.occasion);
  const [helperColor, setHelperColor] = useState(item.helperColor ?? "#2CB1A6");
  const [active, setActive] = useState(item.active);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const used = item.templates.length > 0 || item.userBoards > 0;
  const path = `/api/gokhan/media/${item.kind}/${item.id}`;
  // Keep the current occasion selectable even if it's a spelling the list
  // folded into another label.
  const occasionOptions = occasions.some((o) => o.value === item.occasion)
    ? occasions
    : [{ value: item.occasion, label: `${item.occasionLabel} (${item.occasion})` }, ...occasions];

  const save = async () => {
    const changed: Record<string, unknown> = {};
    if (name.trim() !== item.name) changed.name = name.trim();
    if (occasion !== item.occasion) changed.occasion_type = occasion;
    if (helperColor !== (item.helperColor ?? "#2CB1A6")) changed.helper_color = helperColor;
    if (active !== item.active) changed.is_active = active;
    if (Object.keys(changed).length === 0) return onClose();
    setBusy(true);
    setError(null);
    try {
      await adminFetch(path, { method: "PATCH", body: JSON.stringify(changed) });
      onSaved();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${item.name}"?${item.uploaded ? " The uploaded file is deleted too." : ""}`)) return;
    setBusy(true);
    setError(null);
    try {
      await adminFetch(path, { method: "DELETE" });
      onSaved();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 md:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl" role="dialog" aria-modal="true" aria-label={`Edit ${item.name}`}>
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E5EAF0]">
          <h2 className="text-lg font-bold text-[#0B1F2A] truncate">{item.name || "Untitled"}</h2>
          <button onClick={onClose} disabled={busy} className="text-2xl leading-none text-[#5B6B75] hover:text-[#0B1F2A]" aria-label="Close">
            ×
          </button>
        </div>

        <div className="px-5 py-5 grid gap-5 sm:grid-cols-[10rem_1fr]">
          <div>
            <TemplateThumb
              className="w-40 max-w-full"
              lottiePath={item.kind === "lottie" ? item.url : null}
              image={item.kind === "image" ? { source_type: "remote", file_path: item.url, remote_url: item.url, name: item.name } : null}
            />
            <p className="mt-2 text-xs text-[#5B6B75] break-all">
              .{fileTypeOf(item.url)} · {item.uploaded ? "uploaded" : "in /public"}
            </p>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#2CB1A6] hover:underline">
              Open file
            </a>
          </div>

          <div className="space-y-4 min-w-0">
            <div>
              <label className={label} htmlFor="media-name">Name</label>
              <input id="media-name" value={name} onChange={(e) => setName(e.target.value)} className={input} maxLength={100} />
            </div>
            <div>
              <label className={label} htmlFor="media-occasion">Occasion</label>
              <select id="media-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} className={input}>
                {occasionOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <span className={label}>Helper colour</span>
                <input
                  type="color"
                  value={helperColor}
                  onChange={(e) => setHelperColor(e.target.value)}
                  className="w-10 h-10 p-0.5 rounded-lg border-2 border-[#E5EAF0] bg-white cursor-pointer"
                  aria-label="Helper colour"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#0B1F2A]">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-[#2CB1A6]" />
                Active (shown in pickers)
              </label>
            </div>

            <div>
              <span className={label}>Used by</span>
              {used ? (
                <ul className="space-y-1 text-sm">
                  {item.templates.map((t) => (
                    <li key={t.id}>
                      <a href={viewPath(t)} target="_blank" rel="noopener noreferrer" className="text-[#0B1F2A] hover:text-[#2CB1A6]">
                        {t.title}
                      </a>
                      <span className="text-xs text-[#5B6B75]">
                        {" "}· {t.format} template{t.hidden ? " · hidden" : ""}
                      </span>
                    </li>
                  ))}
                  {item.userBoards > 0 && (
                    <li className="text-[#5B6B75]">
                      {item.userBoards} user board{item.userBoards === 1 ? "" : "s"} and cards
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-[#5B6B75]">Nothing yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 px-5 py-4 border-t border-[#E5EAF0]">
          {error && <p className="w-full text-sm text-red-600">{error}</p>}
          <button
            onClick={remove}
            disabled={busy || used}
            title={used ? "In use. Deactivate it instead." : undefined}
            className="mr-auto px-3 py-2 rounded-full text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Delete
          </button>
          <button
            onClick={() => onMakeTemplate(item)}
            disabled={busy}
            className="px-4 py-2 rounded-full text-sm font-semibold border-2 border-[#2CB1A6] text-[#2CB1A6] hover:bg-[#E8F5F4]"
          >
            Make template
          </button>
          <button
            onClick={save}
            disabled={busy || !name.trim()}
            className="px-5 py-2 rounded-full bg-[#2CB1A6] text-white text-sm font-semibold hover:bg-[#249a90] disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
