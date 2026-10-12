"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "./adminFetch";
import { viewPath } from "./templateTypes";

interface Scheduled {
  id: string;
  title: string;
  shortId: string;
  format: "board" | "card";
  occasion: string;
  owner: string;
  at: string;
  overdue: boolean;
  recipients: string[];
  recipientEmails: number;
  messages: number;
  notifyContributors: boolean;
}

interface LogEntry {
  id: string;
  boardId: string | null;
  board: { title: string; shortId: string; format: "board" | "card" } | null;
  kind: string;
  trigger: string;
  to: string;
  subject: string | null;
  status: "sent" | "failed";
  error: string | null;
  at: string;
}

interface CronRun {
  started_at: string;
  finished_at: string | null;
  due: number | null;
  delivered: number | null;
  failed: number | null;
  error: string | null;
}

interface DeliveriesData {
  tablesReady: boolean;
  scheduled: Scheduled[];
  log: LogEntry[];
  week: { sent: number; failed: number };
  runs: CronRun[];
}

const KIND_LABELS: Record<string, string> = {
  delivery: "Delivery",
  delivered_notice: "Delivered notice",
  invite: "Invite",
  test: "Test",
};

// cron-job.org calls hourly; allow some slack before warning.
const CRON_STALE_MS = 2 * 60 * 60 * 1000;

const field =
  "px-3 py-2 rounded-lg border-2 border-[#E5EAF0] bg-white text-sm focus:border-[#2CB1A6] outline-none";
const smallButton =
  "px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap border border-[#E5EAF0] text-[#5B6B75] hover:border-[#2CB1A6] hover:text-[#2CB1A6] disabled:opacity-40";

const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

function ago(iso: string, now: number) {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

// "2026-10-20T09:00" in local time for <input type="datetime-local">.
function localInputValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function Stat({ label, value, sub, tone = "normal" }: { label: string; value: string | number; sub?: string; tone?: "normal" | "bad" | "good" }) {
  const color = tone === "bad" ? "text-red-600" : tone === "good" ? "text-[#2CB1A6]" : "text-[#0B1F2A]";
  return (
    <div className={`bg-white rounded-xl border-2 p-4 ${tone === "bad" ? "border-red-200" : "border-[#E5EAF0]"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5B6B75]">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#5B6B75]">{sub}</p>}
    </div>
  );
}

export default function Deliveries() {
  const [data, setData] = useState<DeliveriesData | null>(null);
  const [loadedAt, setLoadedAt] = useState(0);
  const [failedOnly, setFailedOnly] = useState(false);
  const [kind, setKind] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  const [rescheduling, setRescheduling] = useState<{ id: string; value: string } | null>(null);

  const load = useCallback(() => {
    const params = new URLSearchParams({ ...(failedOnly && { failed: "1" }), ...(kind && { kind }) });
    return adminFetch<DeliveriesData>(`/api/gokhan/deliveries?${params}`)
      .then((d) => {
        setData(d);
        setLoadedAt(Date.now());
      })
      .catch((e: Error) => setNotice({ text: e.message, tone: "error" }));
  }, [failedOnly, kind]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (key: string, action: () => Promise<string>) => {
    setBusy(key);
    setNotice(null);
    try {
      setNotice({ text: await action(), tone: "ok" });
      await load();
    } catch (e) {
      setNotice({ text: (e as Error).message, tone: "error" });
    } finally {
      setBusy(null);
    }
  };

  const boardAction = (b: Scheduled, body: Record<string, unknown>) =>
    adminFetch<{ recipientEmailsSent?: number; contributorEmailsSent?: number }>(`/api/gokhan/deliveries/${b.id}`, {
      method: "POST",
      body: JSON.stringify(body),
    });

  const sendTest = (boardId?: string) =>
    act(`test-${boardId ?? "sample"}`, async () => {
      const r = await adminFetch<{ to: string }>("/api/gokhan/deliveries/test", {
        method: "POST",
        body: JSON.stringify(boardId ? { boardId } : {}),
      });
      return `Test email sent to ${r.to}.`;
    });

  const lastRun = data?.runs[0];
  const cronStale = !lastRun || loadedAt - new Date(lastRun.started_at).getTime() > CRON_STALE_MS;
  const overdue = data?.scheduled.filter((s) => s.overdue).length ?? 0;
  const upcoming = (data?.scheduled.length ?? 0) - overdue;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#0B1F2A]">Deliveries</h2>
          <p className="text-sm text-[#5B6B75]">Scheduled deliveries, sent and failed emails, and the hourly delivery job.</p>
        </div>
        <button
          onClick={() => sendTest()}
          disabled={!!busy}
          className="px-4 py-2 rounded-full border-2 border-[#2CB1A6] text-sm font-semibold text-[#2CB1A6] hover:bg-[#E8F5F4] disabled:opacity-50"
        >
          {busy === "test-sample" ? "Sending…" : "Send me a test email"}
        </button>
      </div>

      {notice && (
        <p className={`mb-4 rounded-lg px-4 py-2 text-sm ${notice.tone === "ok" ? "bg-[#E8F5F4] text-[#1f7f77]" : "bg-red-50 text-red-700"}`}>
          {notice.text}{" "}
          <button className="underline" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </p>
      )}

      {data && !data.tablesReady && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Email history isn&apos;t being recorded yet. Run <code>supabase/migrations/add_email_log.sql</code> in Supabase.
        </p>
      )}

      {!data && <div className="h-64 rounded-xl bg-white border-2 border-[#E5EAF0] animate-pulse" />}

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat
              label="Delivery job"
              value={lastRun ? ago(lastRun.started_at, loadedAt) : "Never"}
              sub={
                lastRun?.error
                  ? `Failed: ${lastRun.error}`
                  : cronStale
                    ? "Expected hourly. Check cron-job.org."
                    : `Last run delivered ${lastRun?.delivered ?? 0} of ${lastRun?.due ?? 0} due`
              }
              tone={cronStale || lastRun?.error ? "bad" : "good"}
            />
            <Stat label="Overdue" value={overdue} sub="past their time, not yet delivered" tone={overdue ? "bad" : "normal"} />
            <Stat label="Upcoming" value={upcoming} sub="scheduled for later" />
            <Stat
              label="Failed emails, 7 days"
              value={data.week.failed}
              sub={`${data.week.sent} sent`}
              tone={data.week.failed ? "bad" : "normal"}
            />
          </div>

          <section className="bg-white rounded-xl border-2 border-[#E5EAF0]">
            <h3 className="px-4 py-3 border-b border-[#E5EAF0] font-semibold text-[#0B1F2A]">
              Scheduled ({data.scheduled.length})
            </h3>
            {data.scheduled.length === 0 && <p className="px-4 py-6 text-sm text-[#5B6B75]">Nothing scheduled.</p>}
            <ul>
              {data.scheduled.map((s) => (
                <li key={s.id} className={`px-4 py-3 border-b border-[#E5EAF0] last:border-b-0 ${s.overdue ? "bg-red-50/50" : ""}`}>
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1 basis-60">
                      <p className="flex items-center gap-2 min-w-0">
                        <span
                          className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            s.format === "card" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {s.format}
                        </span>
                        <a
                          href={viewPath(s)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[#0B1F2A] hover:text-[#2CB1A6] truncate"
                        >
                          {s.title || "Untitled"}
                        </a>
                        {s.overdue && (
                          <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-red-100 text-red-700">
                            Overdue
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-[#5B6B75]">
                        {when(s.at)} · {s.owner || "no owner"} · for {s.recipients.join(", ") || "nobody"} ·{" "}
                        {s.recipientEmails === 0 ? (
                          <span className="font-semibold text-red-600">no recipient email</span>
                        ) : (
                          `${s.recipientEmails} email${s.recipientEmails === 1 ? "" : "s"}`
                        )}{" "}
                        · {s.messages} message{s.messages === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {rescheduling?.id === s.id ? (
                        <>
                          <input
                            type="datetime-local"
                            value={rescheduling.value}
                            onChange={(e) => setRescheduling({ id: s.id, value: e.target.value })}
                            className={`${field} py-1`}
                            aria-label="New delivery time"
                          />
                          <button
                            className={smallButton}
                            disabled={!!busy || !rescheduling.value}
                            onClick={() =>
                              act(`reschedule-${s.id}`, async () => {
                                await boardAction(s, { action: "reschedule", at: new Date(rescheduling.value).toISOString() });
                                setRescheduling(null);
                                return `"${s.title}" rescheduled.`;
                              })
                            }
                          >
                            Save
                          </button>
                          <button className={smallButton} onClick={() => setRescheduling(null)}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={smallButton}
                            disabled={!!busy}
                            onClick={() => {
                              if (!window.confirm(`Deliver "${s.title}" now? Recipients${s.notifyContributors ? " and contributors" : ""} get their emails immediately.`)) return;
                              act(`send-${s.id}`, async () => {
                                const r = await boardAction(s, { action: "send" });
                                return `Delivered "${s.title}": ${r.recipientEmailsSent ?? 0} recipient and ${r.contributorEmailsSent ?? 0} contributor emails.`;
                              });
                            }}
                          >
                            {busy === `send-${s.id}` ? "Sending…" : "Send now"}
                          </button>
                          <button
                            className={smallButton}
                            disabled={!!busy}
                            onClick={() => setRescheduling({ id: s.id, value: localInputValue(s.at) })}
                          >
                            Reschedule
                          </button>
                          <button className={smallButton} disabled={!!busy} onClick={() => sendTest(s.id)}>
                            {busy === `test-${s.id}` ? "…" : "Test to me"}
                          </button>
                          <button
                            className={`${smallButton} hover:!border-red-400 hover:!text-red-600`}
                            disabled={!!busy}
                            onClick={() => {
                              if (!window.confirm(`Cancel the schedule for "${s.title}"? It won't be sent until the owner delivers it.`)) return;
                              act(`cancel-${s.id}`, async () => {
                                await boardAction(s, { action: "cancel" });
                                return `Schedule for "${s.title}" cancelled.`;
                              });
                            }}
                          >
                            Cancel schedule
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-xl border-2 border-[#E5EAF0]">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#E5EAF0]">
              <h3 className="font-semibold text-[#0B1F2A]">Email log</h3>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-1.5 text-sm text-[#0B1F2A]">
                  <input type="checkbox" checked={failedOnly} onChange={(e) => setFailedOnly(e.target.checked)} className="accent-[#2CB1A6]" />
                  Failed only
                </label>
                <select value={kind} onChange={(e) => setKind(e.target.value)} className={`${field} py-1`} aria-label="Email type">
                  <option value="">All emails</option>
                  {Object.entries(KIND_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {data.log.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[#5B6B75]">{data.tablesReady ? "No emails recorded yet." : "Not recording yet."}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[44rem] text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-[#5B6B75]">
                      <th className="px-4 py-2 font-semibold">When</th>
                      <th className="px-3 py-2 font-semibold">Email</th>
                      <th className="px-3 py-2 font-semibold">To</th>
                      <th className="px-3 py-2 font-semibold">Board</th>
                      <th className="px-4 py-2 font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.log.map((l) => (
                      <tr key={l.id} className="border-t border-[#E5EAF0] align-top">
                        <td className="px-4 py-2 text-[#5B6B75] whitespace-nowrap">{when(l.at)}</td>
                        <td className="px-3 py-2 text-[#0B1F2A] whitespace-nowrap">
                          {KIND_LABELS[l.kind] ?? l.kind}
                          <span className="block text-xs text-[#5B6B75]">by {l.trigger}</span>
                        </td>
                        <td className="px-3 py-2 text-[#0B1F2A] whitespace-nowrap">{l.to}</td>
                        <td className="px-3 py-2 max-w-[14rem]">
                          {l.board ? (
                            <a href={viewPath(l.board)} target="_blank" rel="noopener noreferrer" className="text-[#0B1F2A] hover:text-[#2CB1A6] line-clamp-2">
                              {l.board.title}
                            </a>
                          ) : (
                            <span className="text-[#5B6B75]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              l.status === "sent" ? "bg-[#E8F5F4] text-[#2CB1A6]" : "bg-red-50 text-red-600"
                            }`}
                          >
                            {l.status}
                          </span>
                          {l.error && <span className="mt-1 block text-xs text-red-600 break-words max-w-xs">{l.error}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {data.runs.length > 0 && (
            <section className="bg-white rounded-xl border-2 border-[#E5EAF0]">
              <h3 className="px-4 py-3 border-b border-[#E5EAF0] font-semibold text-[#0B1F2A]">Recent delivery job runs</h3>
              <ul className="text-sm">
                {data.runs.map((r) => (
                  <li key={r.started_at} className="flex flex-wrap justify-between gap-2 px-4 py-2 border-b border-[#E5EAF0] last:border-b-0">
                    <span className="text-[#0B1F2A]">{when(r.started_at)}</span>
                    <span className={r.error || r.failed ? "text-red-600" : "text-[#5B6B75]"}>
                      {r.error
                        ? `Error: ${r.error}`
                        : !r.finished_at
                          ? "Didn't finish"
                          : `${r.delivered ?? 0} of ${r.due ?? 0} delivered${r.failed ? `, ${r.failed} failed` : ""}`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
