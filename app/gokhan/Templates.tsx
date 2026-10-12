"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "./adminFetch";
import TemplateThumb from "./TemplateThumb";
import TemplateEditor from "./TemplateEditor";
import { viewPath, type AdminTemplate, type Format, type TemplatesData } from "./templateTypes";

type FormatFilter = "all" | Format;

const button =
  "px-2.5 py-1 rounded-md text-xs font-semibold border border-[#E5EAF0] text-[#5B6B75] hover:border-[#2CB1A6] hover:text-[#2CB1A6] disabled:opacity-40 disabled:hover:border-[#E5EAF0] disabled:hover:text-[#5B6B75] transition-colors";

export default function Templates() {
  const [data, setData] = useState<TemplatesData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [occasion, setOccasion] = useState("all");
  const [format, setFormat] = useState<FormatFilter>("all");
  // null: closed; "new": creating; otherwise the template being edited.
  const [editing, setEditing] = useState<AdminTemplate | "new" | null>(null);

  const load = useCallback(() => {
    return adminFetch<TemplatesData>("/api/gokhan/templates")
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // One group per occasion label and format, in display order.
  const groups = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    const map = new Map<string, { label: string; format: Format; items: AdminTemplate[] }>();
    for (const t of data.templates) {
      if (occasion !== "all" && t.occasionLabel !== occasion) continue;
      if (format !== "all" && t.format !== format) continue;
      if (q && !t.title.toLowerCase().includes(q)) continue;
      const key = `${t.occasionLabel}|${t.format}`;
      if (!map.has(key)) map.set(key, { label: t.occasionLabel, format: t.format, items: [] });
      map.get(key)!.items.push(t);
    }
    return [...map.values()].sort(
      (a, b) => a.label.localeCompare(b.label) || a.format.localeCompare(b.format)
    );
  }, [data, search, occasion, format]);

  const occasionLabels = useMemo(
    () => [...new Set((data?.templates ?? []).map((t) => t.occasionLabel))].sort(),
    [data]
  );

  const run = async (key: string, action: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await action();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const move = (items: AdminTemplate[], index: number, delta: number) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    run(`move-${item.id}`, () =>
      adminFetch("/api/gokhan/templates/reorder", {
        method: "POST",
        body: JSON.stringify({ ids: next.map((t) => t.id) }),
      })
    );
  };

  const toggleHidden = (t: AdminTemplate) =>
    run(`hide-${t.id}`, () =>
      adminFetch(`/api/gokhan/templates/${t.id}`, { method: "PATCH", body: JSON.stringify({ hidden: !t.hidden }) })
    );

  const remove = (t: AdminTemplate) => {
    const warning =
      t.uses > 0
        ? `\n\n${t.uses} board${t.uses === 1 ? " was" : "s were"} made from it; they keep working.`
        : "";
    if (!window.confirm(`Delete the ${t.format} template "${t.title}" permanently?${warning}`)) return;
    run(`delete-${t.id}`, () => adminFetch(`/api/gokhan/templates/${t.id}`, { method: "DELETE" }));
  };

  const total = data?.templates.length ?? 0;
  const hiddenCount = data?.templates.filter((t) => t.hidden).length ?? 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#0B1F2A]">Templates</h2>
          {data && (
            <p className="text-sm text-[#5B6B75]">
              {total} templates{hiddenCount ? `, ${hiddenCount} hidden` : ""}
            </p>
          )}
        </div>
        <button
          onClick={() => setEditing("new")}
          disabled={!data}
          className="px-4 py-2 rounded-full bg-[#2CB1A6] text-white text-sm font-semibold hover:bg-[#249a90] disabled:opacity-50 transition-colors"
        >
          New template
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search titles"
          className="flex-1 min-w-[10rem] px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none"
        />
        <select
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          className="px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none"
        >
          <option value="all">All occasions</option>
          {occasionLabels.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex gap-1 bg-white rounded-lg border-2 border-[#E5EAF0] p-1">
          {(["all", "board", "card"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1 rounded-md text-sm font-semibold ${
                format === f ? "bg-[#2CB1A6] text-white" : "text-[#5B6B75] hover:text-[#0B1F2A]"
              }`}
            >
              {f === "all" ? "All" : f === "board" ? "Boards" : "Cards"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}{" "}
          <button className="underline" onClick={() => setError(null)}>
            Dismiss
          </button>
        </p>
      )}

      {!data && !error && <div className="h-64 rounded-xl bg-white border-2 border-[#E5EAF0] animate-pulse" />}
      {data && groups.length === 0 && <p className="text-sm text-[#5B6B75]">No templates match.</p>}

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={`${group.label}|${group.format}`} className="bg-white rounded-xl border-2 border-[#E5EAF0]">
            <h3 className="px-4 py-3 border-b border-[#E5EAF0] text-sm font-semibold text-[#0B1F2A]">
              {group.label}{" "}
              <span className="font-normal text-[#5B6B75]">
                · {group.format === "card" ? "Cards" : "Boards"} ({group.items.length})
              </span>
            </h3>
            <ul>
              {group.items.map((t, i) => (
                <li
                  key={t.id}
                  className={`flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 py-2.5 border-b border-[#E5EAF0] last:border-b-0 ${
                    t.hidden ? "bg-[#F7FAFC]" : ""
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <button
                      className={button}
                      disabled={i === 0 || !!busy || search !== ""}
                      onClick={() => move(group.items, i, -1)}
                      aria-label={`Move ${t.title} up`}
                    >
                      ↑
                    </button>
                    <button
                      className={button}
                      disabled={i === group.items.length - 1 || !!busy || search !== ""}
                      onClick={() => move(group.items, i, 1)}
                      aria-label={`Move ${t.title} down`}
                    >
                      ↓
                    </button>
                  </div>
                  <div className={t.hidden ? "opacity-40" : ""}>
                    <TemplateThumb
                      lottiePath={t.media?.kind === "lottie" ? t.media.filePath : null}
                      image={t.media?.kind === "image" ? t.media.image : null}
                    />
                  </div>
                  <div className="min-w-0 flex-1 basis-40">
                    <p className={`font-semibold truncate ${t.hidden ? "text-[#5B6B75]" : "text-[#0B1F2A]"}`}>
                      {t.title}
                      {t.hidden && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-[#F1F5F9] text-[#5B6B75]">
                          Hidden
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#5B6B75] truncate">
                      {t.media ? t.media.name || (t.media.kind === "lottie" ? "Animation" : "Image") : "No background"}
                      {" · "}
                      {t.messageCount} message{t.messageCount === 1 ? "" : "s"}
                      {" · "}
                      used {t.uses}×{t.recipient ? ` · to ${t.recipient}` : ""}
                    </p>
                  </div>
                  {/* Below sm the actions take their own line so the title keeps its width. */}
                  <div className="flex flex-wrap justify-end gap-1.5 w-full sm:w-auto">
                    <button className={button} disabled={!!busy} onClick={() => setEditing(t)}>
                      Edit
                    </button>
                    <button className={button} disabled={!!busy} onClick={() => toggleHidden(t)}>
                      {busy === `hide-${t.id}` ? "…" : t.hidden ? "Show" : "Hide"}
                    </button>
                    <a className={button} href={viewPath(t)} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                    <button
                      className={`${button} hover:!border-red-400 hover:!text-red-600`}
                      disabled={!!busy}
                      onClick={() => remove(t)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {data && editing && (
        <TemplateEditor
          data={data}
          template={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
}
