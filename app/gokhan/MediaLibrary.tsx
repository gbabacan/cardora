"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatOccasionLabel } from "@/lib/occasionLabels";
import { adminFetch } from "./adminFetch";
import TemplateThumb from "./TemplateThumb";
import MediaEditor from "./MediaEditor";
import UploadDialog from "./UploadDialog";
import TemplateEditor from "./TemplateEditor";
import { fingerprint } from "./mediaFingerprint";
import { fileTypeOf, type MediaData, type MediaItem, type MediaKind } from "./mediaTypes";
import type { TemplatesData } from "./templateTypes";

type StatusFilter = "all" | "active" | "inactive";
type TemplateFilter = "any" | "none" | "no-board" | "no-card";

const select =
  "px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none";

const hasFormat = (item: MediaItem, format: "board" | "card") => item.templates.some((t) => t.format === format);

function Thumb({ item, className }: { item: MediaItem; className?: string }) {
  return (
    <TemplateThumb
      className={className}
      lottiePath={item.kind === "lottie" ? item.url : null}
      image={item.kind === "image" ? { source_type: "remote", file_path: item.url, remote_url: item.url, name: item.name } : null}
    />
  );
}

export default function MediaLibrary() {
  const [data, setData] = useState<MediaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<MediaKind>("lottie");
  const [search, setSearch] = useState("");
  const [occasion, setOccasion] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [templateFilter, setTemplateFilter] = useState<TemplateFilter>("any");
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [templateDraft, setTemplateDraft] = useState<{ data: TemplatesData; item: MediaItem } | null>(null);
  const [dupes, setDupes] = useState<{ checked: number; total: number; groups: MediaItem[][]; failed: number } | null>(null);

  const load = useCallback(() => {
    return adminFetch<MediaData>("/api/gokhan/media")
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const ofKind = useMemo(() => (data?.media ?? []).filter((m) => m.kind === kind), [data, kind]);
  const occasionLabels = useMemo(() => [...new Set(ofKind.map((m) => m.occasionLabel))].sort(), [ofKind]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ofKind
      .filter((m) => occasion === "all" || m.occasionLabel === occasion)
      .filter((m) => status === "all" || (status === "active") === m.active)
      .filter((m) =>
        templateFilter === "any"
          ? true
          : templateFilter === "none"
            ? m.templates.length === 0
            : !hasFormat(m, templateFilter === "no-board" ? "board" : "card")
      )
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q))
      .sort((a, b) => a.occasionLabel.localeCompare(b.occasionLabel) || a.url.localeCompare(b.url, undefined, { numeric: true }));
  }, [ofKind, search, occasion, status, templateFilter]);

  const findDuplicates = async () => {
    const items = ofKind;
    const byPrint = new Map<string, MediaItem[]>();
    let failed = 0;
    setDupes({ checked: 0, total: items.length, groups: [], failed: 0 });
    // A few at a time: the files are cached afterwards, but there are many.
    for (let i = 0; i < items.length; i += 6) {
      await Promise.all(
        items.slice(i, i + 6).map(async (item) => {
          try {
            const key = await fingerprint(item.kind, item.url);
            byPrint.set(key, [...(byPrint.get(key) ?? []), item]);
          } catch {
            failed++;
          }
        })
      );
      setDupes({ checked: Math.min(i + 6, items.length), total: items.length, groups: [], failed });
    }
    setDupes({
      checked: items.length,
      total: items.length,
      failed,
      groups: [...byPrint.values()].filter((g) => g.length > 1),
    });
  };

  const makeTemplate = async (item: MediaItem) => {
    try {
      const templatesData = await adminFetch<TemplatesData>("/api/gokhan/templates");
      setEditing(null);
      setTemplateDraft({ data: templatesData, item });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const counts = {
    lottie: data?.media.filter((m) => m.kind === "lottie").length ?? 0,
    image: data?.media.filter((m) => m.kind === "image").length ?? 0,
  };
  const withoutTemplate = ofKind.filter((m) => m.active && m.templates.length === 0).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#0B1F2A]">Media library</h2>
          {data && (
            <p className="text-sm text-[#5B6B75]">
              {counts.lottie} animations, {counts.image} images
              {withoutTemplate > 0 && ` · ${withoutTemplate} active ${kind === "lottie" ? "animations" : "images"} have no template`}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={findDuplicates}
            disabled={!data || (dupes !== null && dupes.checked < dupes.total)}
            className="px-4 py-2 rounded-full border-2 border-[#E5EAF0] text-sm font-semibold text-[#5B6B75] hover:border-[#2CB1A6] hover:text-[#2CB1A6] disabled:opacity-50"
          >
            Find duplicates
          </button>
          <button
            onClick={() => setUploading(true)}
            disabled={!data}
            className="px-4 py-2 rounded-full bg-[#2CB1A6] text-white text-sm font-semibold hover:bg-[#249a90] disabled:opacity-50"
          >
            Upload
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex gap-1 bg-white rounded-lg border-2 border-[#E5EAF0] p-1">
          {(["lottie", "image"] as const).map((k) => (
            <button
              key={k}
              onClick={() => {
                setKind(k);
                setOccasion("all");
                setDupes(null);
              }}
              className={`px-3 py-1 rounded-md text-sm font-semibold ${
                kind === k ? "bg-[#2CB1A6] text-white" : "text-[#5B6B75] hover:text-[#0B1F2A]"
              }`}
            >
              {k === "lottie" ? `Animations (${counts.lottie})` : `Images (${counts.image})`}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search names and files"
          className={`${select} flex-1 min-w-[10rem]`}
        />
        <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={select} aria-label="Occasion">
          <option value="all">All occasions</option>
          {occasionLabels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className={select} aria-label="Status">
          <option value="all">Active and inactive</option>
          <option value="active">Active only</option>
          <option value="inactive">Inactive only</option>
        </select>
        <select
          value={templateFilter}
          onChange={(e) => setTemplateFilter(e.target.value as TemplateFilter)}
          className={select}
          aria-label="Templates"
        >
          <option value="any">Any templates</option>
          <option value="none">No template yet</option>
          <option value="no-board">No board template</option>
          <option value="no-card">No card template</option>
        </select>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}{" "}
          <button className="underline" onClick={() => setError(null)}>
            Dismiss
          </button>
        </p>
      )}

      {dupes && (
        <div className="mb-5 rounded-xl border-2 border-[#E5EAF0] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#0B1F2A]">
              {dupes.checked < dupes.total
                ? `Checking ${dupes.checked} of ${dupes.total}…`
                : dupes.groups.length
                  ? `${dupes.groups.length} possible duplicate group${dupes.groups.length === 1 ? "" : "s"}`
                  : "No duplicates found"}
            </h3>
            <button onClick={() => setDupes(null)} className="text-sm text-[#5B6B75] hover:text-[#0B1F2A]">
              Close
            </button>
          </div>
          {dupes.failed > 0 && <p className="mt-1 text-xs text-[#5B6B75]">{dupes.failed} files couldn&apos;t be read.</p>}
          {kind === "lottie" && dupes.groups.length > 0 && (
            <p className="mt-1 text-xs text-[#5B6B75]">
              Animations match on size, length and layer names, so check them side by side before deactivating one.
            </p>
          )}
          <div className="mt-3 space-y-3">
            {dupes.groups.map((group) => (
              <div key={group.map((g) => g.id).join()} className="flex flex-wrap gap-3">
                {group.map((item) => (
                  <button key={item.id} onClick={() => setEditing(item)} className="flex items-center gap-2 rounded-lg border-2 border-[#E5EAF0] p-2 hover:border-[#2CB1A6] text-left">
                    <Thumb item={item} className="w-10" />
                    <span className="text-xs">
                      <span className="block font-semibold text-[#0B1F2A]">{item.name}</span>
                      <span className="text-[#5B6B75]">
                        {item.url.split("/").pop()} · {item.templates.length} template{item.templates.length === 1 ? "" : "s"}
                        {item.active ? "" : " · inactive"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {!data && !error && <div className="h-64 rounded-xl bg-white border-2 border-[#E5EAF0] animate-pulse" />}
      {data && visible.length === 0 && <p className="text-sm text-[#5B6B75]">Nothing matches.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {visible.map((item) => (
          <button
            key={item.id}
            onClick={() => setEditing(item)}
            className={`text-left bg-white rounded-xl border-2 border-[#E5EAF0] hover:border-[#2CB1A6] p-2 transition-colors ${
              item.active ? "" : "opacity-50"
            }`}
          >
            <Thumb item={item} className="w-full" />
            <p className="mt-2 text-sm font-semibold text-[#0B1F2A] truncate" title={item.name}>
              {item.name || "Untitled"}
            </p>
            <p className="text-xs text-[#5B6B75] truncate">
              {formatOccasionLabel(item.occasion)} · .{fileTypeOf(item.url)}
              {item.uploaded ? " · uploaded" : ""}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {(["board", "card"] as const).map((f) => (
                <span
                  key={f}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    hasFormat(item, f)
                      ? f === "card"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                      : "bg-[#F1F5F9] text-[#A0AEB8] line-through"
                  }`}
                >
                  {f}
                </span>
              ))}
              {item.userBoards > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E8F5F4] text-[#2CB1A6]">
                  {item.userBoards} in use
                </span>
              )}
              {!item.active && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#F1F5F9] text-[#5B6B75]">
                  Inactive
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {data && editing && (
        <MediaEditor
          key={editing.id}
          item={editing}
          occasions={data.occasions}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
          onMakeTemplate={makeTemplate}
        />
      )}

      {data && uploading && (
        <UploadDialog
          occasions={data.occasions}
          defaultOccasion={data.occasions.find((o) => o.label === occasion)?.value ?? ""}
          onClose={() => setUploading(false)}
          onUploaded={() => {
            setUploading(false);
            load();
          }}
        />
      )}

      {templateDraft && (
        <TemplateEditor
          data={templateDraft.data}
          template={null}
          preset={{
            media: { kind: templateDraft.item.kind, id: templateDraft.item.id },
            // Use the spelling templates already use for this occasion.
            occasion:
              templateDraft.data.occasions.find((o) => o.label === templateDraft.item.occasionLabel)?.value ??
              templateDraft.item.occasion,
            title: templateDraft.item.name,
          }}
          onClose={() => setTemplateDraft(null)}
          onSaved={() => {
            setTemplateDraft(null);
            load();
          }}
        />
      )}
    </div>
  );
}
