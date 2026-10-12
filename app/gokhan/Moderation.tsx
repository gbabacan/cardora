"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "./adminFetch";
import { viewPath } from "./templateTypes";
import { AuditEntryRow, type AuditEntry } from "./AuditLog";

interface BoardResult {
  id: string;
  title: string;
  shortId: string;
  format: "board" | "card";
  status: string;
  occasion: string;
  owner: string;
  messages: number;
  hiddenMessages: number;
  createdAt: string;
}

interface BoardDetail {
  board: {
    id: string;
    title: string;
    shortId: string;
    format: "board" | "card";
    status: string;
    occasion: string;
    deliveryType: string | null;
    scheduledDelivery: string | null;
    createdAt: string;
    updatedAt: string;
    owner: { id: string; email: string } | null;
    recipients: { name: string; email: string | null }[];
    contributorCount: number;
  };
  messages: {
    id: string;
    text: string;
    approved: boolean;
    createdAt: string;
    author: string;
    authorEmail: string;
    anonymous: boolean;
    media: { id: string; url: string; type: string; thumbnail: string | null }[];
  }[];
}

const STATUSES = ["CREATED", "PUBLISHED", "DELIVERED", "DELETED"];

const STATUS_STYLES: Record<string, string> = {
  CREATED: "bg-[#F1F5F9] text-[#5B6B75]",
  PUBLISHED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-[#E8F5F4] text-[#2CB1A6]",
  DELETED: "bg-red-50 text-red-600",
};

const field =
  "px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none";
const smallButton =
  "px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border border-[#E5EAF0] text-[#5B6B75] hover:border-[#2CB1A6] hover:text-[#2CB1A6] disabled:opacity-40";

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.CREATED}`}>
      {status.toLowerCase()}
    </span>
  );
}

export default function Moderation() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [format, setFormat] = useState("");
  const [results, setResults] = useState<{ boards: BoardResult[]; limited: boolean } | null>(null);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<BoardDetail | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [history, setHistory] = useState<AuditEntry[]>([]);

  const search = useCallback(() => {
    const params = new URLSearchParams({ q: query, ...(status && { status }), ...(format && { format }) });
    setSearching(true);
    return adminFetch<{ boards: BoardResult[]; limited: boolean }>(`/api/gokhan/boards?${params}`)
      .then(setResults)
      .catch((e: Error) => setError(e.message))
      .finally(() => setSearching(false));
  }, [query, status, format]);

  // Search as you type, after a short pause.
  useEffect(() => {
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadDetail = useCallback((id: string) => {
    return Promise.all([
      adminFetch<BoardDetail>(`/api/gokhan/boards/${id}`),
      // History is a nice-to-have: an empty list if the log isn't set up.
      adminFetch<{ entries: AuditEntry[] }>(`/api/gokhan/audit?board=${id}`).catch(() => ({ entries: [] })),
    ])
      .then(([d, h]) => {
        setDetail(d);
        setNewStatus(d.board.status);
        setHistory(h.entries);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  const open = (id: string) => {
    setSelected(id);
    setDetail(null);
    setHistory([]);
    setNewOwner("");
    setError(null);
    loadDetail(id);
  };

  const act = async (key: string, action: () => Promise<unknown>) => {
    if (!selected) return;
    setBusy(key);
    setError(null);
    try {
      await action();
      await Promise.all([loadDetail(selected), search()]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const board = detail?.board;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#0B1F2A]">Moderation</h2>
        <p className="text-sm text-[#5B6B75]">
          Find any board or card by title, link code, owner email, recipient or contributor.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title, 8-character code, email or name"
          className={`${field} flex-1 min-w-[12rem]`}
          aria-label="Search boards"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={field} aria-label="Status">
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value)} className={field} aria-label="Format">
          <option value="">Boards and cards</option>
          <option value="board">Boards</option>
          <option value="card">Cards</option>
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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
        {/* Results; on phones they give way to the open board. */}
        <section className={`bg-white rounded-xl border-2 border-[#E5EAF0] ${selected ? "hidden lg:block" : ""}`}>
          <div className="px-4 py-3 border-b border-[#E5EAF0] text-sm text-[#5B6B75]">
            {searching && !results
              ? "Searching…"
              : results
                ? `${results.boards.length}${results.limited ? "+" : ""} ${query ? "matches" : "newest"}`
                : ""}
          </div>
          <ul className={`max-h-[70vh] overflow-y-auto ${searching ? "opacity-60" : ""}`}>
            {results?.boards.map((b) => (
              <li key={b.id}>
                <button
                  onClick={() => open(b.id)}
                  className={`w-full text-left px-4 py-3 border-b border-[#E5EAF0] hover:bg-[#F7FAFC] ${
                    selected === b.id ? "bg-[#E8F5F4]" : ""
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        b.format === "card" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {b.format}
                    </span>
                    <span className="font-semibold text-[#0B1F2A] truncate">{b.title || "Untitled"}</span>
                    <span className="ml-auto flex-shrink-0">
                      <StatusBadge status={b.status} />
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-[#5B6B75] truncate">
                    {b.shortId} · {b.owner || "no owner"} · {b.messages} message{b.messages === 1 ? "" : "s"}
                    {b.hiddenMessages > 0 && <span className="text-amber-700"> · {b.hiddenMessages} hidden</span>}
                    {" · "}
                    {when(b.createdAt)}
                  </span>
                </button>
              </li>
            ))}
            {results && results.boards.length === 0 && <li className="px-4 py-6 text-sm text-[#5B6B75]">Nothing found.</li>}
          </ul>
        </section>

        <section className={`bg-white rounded-xl border-2 border-[#E5EAF0] ${selected ? "" : "hidden lg:block"}`}>
          {!selected && <p className="px-5 py-10 text-sm text-[#5B6B75] text-center">Pick a board or card to review it.</p>}
          {selected && !board && <div className="h-64 animate-pulse bg-[#F7FAFC] rounded-xl" />}
          {board && detail && (
            <>
              <div className="px-5 py-4 border-b border-[#E5EAF0]">
                <button onClick={() => setSelected(null)} className="lg:hidden mb-2 text-sm font-semibold text-[#2CB1A6]">
                  ← Results
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-[#0B1F2A] break-words">{board.title || "Untitled"}</h3>
                  <StatusBadge status={board.status} />
                </div>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-[#5B6B75]">Type</dt>
                  <dd className="text-[#0B1F2A]">
                    {board.format === "card" ? "Card" : "Board"} · {board.occasion} ·{" "}
                    <a href={viewPath(board)} target="_blank" rel="noopener noreferrer" className="text-[#2CB1A6] hover:underline">
                      {board.shortId} ↗
                    </a>
                  </dd>
                  <dt className="text-[#5B6B75]">Owner</dt>
                  <dd className="text-[#0B1F2A] break-all">{board.owner?.email || "—"}</dd>
                  <dt className="text-[#5B6B75]">For</dt>
                  <dd className="text-[#0B1F2A]">
                    {board.recipients.length
                      ? board.recipients.map((r) => (r.email ? `${r.name} <${r.email}>` : r.name)).join(", ")
                      : "—"}
                  </dd>
                  <dt className="text-[#5B6B75]">Created</dt>
                  <dd className="text-[#0B1F2A]">{when(board.createdAt)}</dd>
                  {board.deliveryType === "SCHEDULED" && (
                    <>
                      <dt className="text-[#5B6B75]">Delivery</dt>
                      <dd className="text-[#0B1F2A]">{when(board.scheduledDelivery)}</dd>
                    </>
                  )}
                  <dt className="text-[#5B6B75]">People</dt>
                  <dd className="text-[#0B1F2A]">
                    {board.contributorCount} contributor{board.contributorCount === 1 ? "" : "s"}
                  </dd>
                </dl>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex gap-2">
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className={`${field} flex-1`} aria-label="New status">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s === "DELETED" ? "Deleted (hidden from owner)" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <button
                      className={smallButton}
                      disabled={!!busy || newStatus === board.status}
                      onClick={() => {
                        if (newStatus === "DELETED" && !window.confirm("Delete this for its owner? You can restore it here later.")) return;
                        act("status", () =>
                          adminFetch(`/api/gokhan/boards/${board.id}`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) })
                        );
                      }}
                    >
                      {busy === "status" ? "…" : "Set status"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newOwner}
                      onChange={(e) => setNewOwner(e.target.value)}
                      placeholder="Move to owner email"
                      className={`${field} flex-1 min-w-0`}
                      aria-label="New owner email"
                    />
                    <button
                      className={smallButton}
                      disabled={!!busy || !newOwner.trim()}
                      onClick={() => {
                        if (!window.confirm(`Move "${board.title}" to ${newOwner.trim()}? The current owner loses access.`)) return;
                        act("owner", () =>
                          adminFetch(`/api/gokhan/boards/${board.id}`, {
                            method: "PATCH",
                            body: JSON.stringify({ owner_email: newOwner }),
                          }).then(() => setNewOwner(""))
                        );
                      }}
                    >
                      {busy === "owner" ? "…" : "Move"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4">
                <h4 className="text-sm font-semibold text-[#0B1F2A] mb-3">
                  Messages ({detail.messages.length})
                </h4>
                {detail.messages.length === 0 && <p className="text-sm text-[#5B6B75]">No messages.</p>}
                <ul className="space-y-3">
                  {detail.messages.map((m) => (
                    <li
                      key={m.id}
                      className={`rounded-lg border-2 p-3 ${m.approved ? "border-[#E5EAF0]" : "border-amber-200 bg-amber-50/50"}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-sm min-w-0">
                          <span className="font-semibold text-[#0B1F2A]">{m.author || "Unnamed"}</span>
                          {m.anonymous && <span className="text-xs text-[#5B6B75]"> (shown as anonymous)</span>}
                          {m.authorEmail && <span className="text-xs text-[#5B6B75] break-all"> · {m.authorEmail}</span>}
                          <span className="block text-xs text-[#5B6B75]">{when(m.createdAt)}</span>
                        </p>
                        <span className="flex items-center gap-1.5">
                          {!m.approved && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-100 text-amber-800">
                              Hidden
                            </span>
                          )}
                          <button
                            className={smallButton}
                            disabled={!!busy}
                            onClick={() =>
                              act(`hide-${m.id}`, () =>
                                adminFetch(`/api/gokhan/messages/${m.id}`, {
                                  method: "PATCH",
                                  body: JSON.stringify({ approved: !m.approved }),
                                })
                              )
                            }
                          >
                            {busy === `hide-${m.id}` ? "…" : m.approved ? "Hide" : "Show"}
                          </button>
                          <button
                            className={`${smallButton} hover:!border-red-400 hover:!text-red-600`}
                            disabled={!!busy}
                            onClick={() => {
                              if (!window.confirm("Delete this message and its photos for good?")) return;
                              act(`delete-${m.id}`, () => adminFetch(`/api/gokhan/messages/${m.id}`, { method: "DELETE" }));
                            }}
                          >
                            Delete
                          </button>
                        </span>
                      </div>
                      {m.text && <p className="mt-2 text-sm text-[#0B1F2A] whitespace-pre-wrap break-words">{m.text}</p>}
                      {m.media.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.media.map((md) =>
                            md.type === "video" ? (
                              <a key={md.id} href={md.url} target="_blank" rel="noopener noreferrer" className={smallButton}>
                                Video ↗
                              </a>
                            ) : (
                              <a key={md.id} href={md.url} target="_blank" rel="noopener noreferrer">
                                {/* eslint-disable-next-line @next/next/no-img-element -- user uploads and GIF/Unsplash URLs */}
                                <img
                                  src={md.thumbnail || md.url}
                                  alt=""
                                  loading="lazy"
                                  className="h-20 w-20 rounded-md object-cover border border-[#E5EAF0]"
                                />
                              </a>
                            )
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {history.length > 0 && (
                <div className="border-t border-[#E5EAF0]">
                  <h4 className="px-5 pt-4 text-sm font-semibold text-[#0B1F2A]">Admin history</h4>
                  <ul className="[&>li]:px-5">
                    {history.map((entry) => (
                      <AuditEntryRow key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
