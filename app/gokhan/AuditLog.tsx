"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "./adminFetch";
import { viewPath } from "./templateTypes";

export interface AuditEntry {
  id: string;
  admin: string;
  action: string;
  targetType: string;
  targetId: string | null;
  board: { title: string; shortId: string; format: "board" | "card"; isTemplate: boolean } | null;
  boardId: string | null;
  summary: string;
  details: Record<string, unknown> | null;
  at: string;
}

interface AuditPage {
  tableReady: boolean;
  entries: AuditEntry[];
  nextCursor: string | null;
}

const AREAS = [
  { value: "", label: "Everything" },
  { value: "template", label: "Templates" },
  { value: "media", label: "Media" },
  { value: "board", label: "Boards" },
  { value: "message", label: "Messages" },
  { value: "delivery", label: "Deliveries" },
  { value: "email", label: "Test emails" },
];

const AREA_STYLES: Record<string, string> = {
  template: "bg-blue-100 text-blue-700",
  media: "bg-purple-100 text-purple-700",
  board: "bg-amber-100 text-amber-800",
  message: "bg-red-50 text-red-700",
  delivery: "bg-[#E8F5F4] text-[#1f7f77]",
  email: "bg-[#F1F5F9] text-[#5B6B75]",
};

const field =
  "px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none";

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const show = (value: unknown) =>
  value === null || value === undefined ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value);

// Details as "field: from → to" lines where the value is a change, and
// "field: value" otherwise.
function Details({ details }: { details: Record<string, unknown> }) {
  return (
    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 rounded-lg bg-[#F7FAFC] p-3 text-xs">
      {Object.entries(details).map(([key, value]) => {
        const change = value && typeof value === "object" && "from" in value && "to" in value ? (value as { from: unknown; to: unknown }) : null;
        return (
          <div key={key} className="contents">
            <dt className="text-[#5B6B75]">{key}</dt>
            <dd className="text-[#0B1F2A] break-words min-w-0">
              {change ? (
                <>
                  <span className="text-[#5B6B75] line-through">{show(change.from)}</span> → {show(change.to)}
                </>
              ) : key === "excerpt" ? (
                <span className="whitespace-pre-wrap">“{show(value)}”</span>
              ) : (
                show(value)
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function AuditEntryRow({ entry }: { entry: AuditEntry }) {
  const [open, setOpen] = useState(false);
  const area = entry.action.split(".")[0];
  const hasDetails = entry.details && Object.keys(entry.details).length > 0;
  return (
    <li className="px-4 py-3 border-b border-[#E5EAF0] last:border-b-0">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${AREA_STYLES[area] ?? AREA_STYLES.email}`}>
          {entry.action.replace(".", " ")}
        </span>
        <p className="min-w-0 flex-1 basis-64 text-sm text-[#0B1F2A] break-words">{entry.summary}</p>
        <span className="text-xs text-[#5B6B75] whitespace-nowrap">{when(entry.at)}</span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5B6B75]">
        <span>by {entry.admin}</span>
        {entry.board && (
          <a href={viewPath(entry.board)} target="_blank" rel="noopener noreferrer" className="text-[#2CB1A6] hover:underline">
            View {entry.board.isTemplate ? "template" : entry.board.format} ↗
          </a>
        )}
        {entry.boardId && !entry.board && <span>(since deleted)</span>}
        {hasDetails && (
          <button onClick={() => setOpen((o) => !o)} className="font-semibold text-[#2CB1A6] hover:underline">
            {open ? "Hide details" : "Details"}
          </button>
        )}
      </div>
      {open && entry.details && <Details details={entry.details} />}
    </li>
  );
}

export default function AuditLog() {
  const [area, setArea] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState<AuditPage | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    (before?: string) => {
      const params = new URLSearchParams({ ...(area && { area }), ...(query.trim() && { q: query.trim() }), ...(before && { before }) });
      return adminFetch<AuditPage>(`/api/gokhan/audit?${params}`);
    },
    [area, query]
  );

  // Reload from the top whenever the filters change, after a short pause.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      fetchPage()
        .then((p) => {
          if (cancelled) return;
          setPage(p);
          setError(null);
        })
        .catch((e: Error) => {
          if (!cancelled) setError(e.message);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fetchPage]);

  const loadMore = async () => {
    if (!page?.nextCursor) return;
    setLoadingMore(true);
    try {
      const next = await fetchPage(page.nextCursor);
      setPage({ ...next, entries: [...page.entries, ...next.entries] });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#0B1F2A]">Audit log</h2>
        <p className="text-sm text-[#5B6B75]">Every change made from this admin page, who made it and when.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search, e.g. a title or email"
          className={`${field} flex-1 min-w-[12rem]`}
          aria-label="Search the audit log"
        />
        <select value={area} onChange={(e) => setArea(e.target.value)} className={field} aria-label="Area">
          {AREAS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      {page && !page.tableReady && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Admin actions aren&apos;t being recorded yet. Run <code>supabase/migrations/add_admin_audit_log.sql</code> in Supabase.
        </p>
      )}
      {!page && !error && <div className="h-64 rounded-xl bg-white border-2 border-[#E5EAF0] animate-pulse" />}

      {page && page.tableReady && (
        <section className="bg-white rounded-xl border-2 border-[#E5EAF0]">
          {page.entries.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#5B6B75]">Nothing recorded{query || area ? " that matches" : " yet"}.</p>
          ) : (
            <ul>
              {page.entries.map((entry) => (
                <AuditEntryRow key={entry.id} entry={entry} />
              ))}
            </ul>
          )}
          {page.nextCursor && (
            <div className="px-4 py-3 border-t border-[#E5EAF0] text-center">
              <button onClick={loadMore} disabled={loadingMore} className="text-sm font-semibold text-[#2CB1A6] hover:underline disabled:opacity-50">
                {loadingMore ? "Loading…" : "Load older"}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
