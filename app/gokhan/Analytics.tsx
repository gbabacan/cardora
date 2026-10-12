"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SeriesPoint {
  date: string;
  signups: number;
  boards: number;
  cards: number;
  messages: number;
}

interface AnalyticsData {
  range: { days: number; bucket: "day" | "week"; start: string };
  totals: {
    users: number;
    boards: number;
    cards: number;
    deleted: number;
    messages: number;
    contributors: number;
    sent: number;
    delivered: number;
    avgMessagesPerSent: number;
    scheduledUpcoming: number;
  };
  period: {
    signups: number;
    prevSignups: number;
    activeUsers: number;
    creators: number;
    boards: number;
    cards: number;
    prevBoards: number;
    prevCards: number;
    messages: number;
    prevMessages: number;
    funnel: { created: number; withMessages: number; sent: number; delivered: number; deleted: number };
  };
  series: SeriesPoint[];
  occasions: { label: string; boards: number; cards: number; total: number }[];
  templates: { id: string; uses: number; title: string; format: string | null; occasion: string | null; shortId: string | null }[];
  recentSignups: {
    email: string;
    provider: string;
    createdAt: string;
    lastSignInAt: string | null;
    confirmed: boolean;
    boards: number;
  }[];
  recentBoards: {
    title: string;
    shortId: string;
    format: "board" | "card";
    occasion: string;
    status: string;
    owner: string;
    messages: number;
    fromTemplate: boolean;
    createdAt: string;
  }[];
}

const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "12 months" },
];

const BOARD_COLOR = "#2CB1A6";
const CARD_COLOR = "#8B5CF6";

// Chart buckets are UTC dates ("2026-10-12"); show that day, not the local
// day that UTC midnight falls on.
const formatDay = (date: string | undefined) =>
  date
    ? new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone: "UTC" })
    : "";

const formatDateTime = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "Never";

function Change({ now, before }: { now: number; before: number }) {
  if (before === 0) return now > 0 ? <span className="text-xs font-semibold text-[#2CB1A6]">new</span> : null;
  const pct = Math.round(((now - before) / before) * 100);
  const color = pct > 0 ? "text-[#2CB1A6]" : pct < 0 ? "text-[#E05A5A]" : "text-[#5B6B75]";
  return (
    <span className={`text-xs font-semibold ${color}`}>
      {pct > 0 ? "+" : ""}
      {pct}%
    </span>
  );
}

function Stat({ label, value, sub, change }: { label: string; value: number | string; sub?: string; change?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#E5EAF0] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#5B6B75]">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#0B1F2A]">{value}</span>
        {change}
      </div>
      {sub && <p className="mt-0.5 text-xs text-[#5B6B75]">{sub}</p>}
    </div>
  );
}

function Panel({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="bg-white rounded-xl border-2 border-[#E5EAF0] p-4 md:p-5 min-w-0">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h3 className="font-semibold text-[#0B1F2A]">{title}</h3>
        {note && <span className="text-xs text-[#5B6B75]">{note}</span>}
      </div>
      {children}
    </section>
  );
}

// Vertical bars, one per bucket; stacked when more than one series is given.
function BarChart({
  points,
  parts,
  bucket,
}: {
  points: SeriesPoint[];
  parts: { key: keyof Omit<SeriesPoint, "date">; color: string; label: string }[];
  bucket: "day" | "week";
}) {
  const totals = points.map((p) => parts.reduce((sum, part) => sum + p[part.key], 0));
  const max = Math.max(1, ...totals);
  const sum = totals.reduce((a, b) => a + b, 0);
  return (
    <div>
      <div className="flex items-end gap-[2px] h-36" role="img" aria-label={`${sum} in total`}>
        {points.map((p, i) => {
          const title =
            `${bucket === "week" ? "Week of " : ""}${formatDay(p.date)}: ` +
            parts.map((part) => `${p[part.key]} ${part.label.toLowerCase()}`).join(", ");
          return (
            <div key={p.date} className="flex-1 h-full flex flex-col justify-end group" title={title}>
              <div
                className="w-full flex flex-col-reverse rounded-t-sm overflow-hidden group-hover:opacity-80"
                style={{ height: `${(totals[i] / max) * 100}%` }}
              >
                {parts.map((part) => (
                  <div
                    key={part.key}
                    style={{ height: totals[i] ? `${(p[part.key] / totals[i]) * 100}%` : 0, backgroundColor: part.color }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-[#5B6B75]">
        <span>{formatDay(points[0]?.date)}</span>
        <span>
          Peak {max === 1 && sum === 0 ? 0 : max} per {bucket}
        </span>
        <span>{formatDay(points[points.length - 1]?.date)}</span>
      </div>
      {parts.length > 1 && (
        <div className="mt-2 flex gap-4 text-xs text-[#5B6B75]">
          {parts.map((part) => (
            <span key={part.key} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: part.color }} />
              {part.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function FunnelRow({ label, value, of }: { label: string; value: number; of: number }) {
  const pct = of ? Math.round((value / of) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[#0B1F2A]">{label}</span>
        <span className="text-[#5B6B75]">
          {value} <span className="text-xs">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-full rounded-full bg-[#2CB1A6]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  CREATED: "bg-[#F1F5F9] text-[#5B6B75]",
  PUBLISHED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-[#E8F5F4] text-[#2CB1A6]",
  DELETED: "bg-red-50 text-red-600",
};

export default function Analytics() {
  const [days, setDays] = useState(30);
  const [result, setResult] = useState<{ days: number; data: AnalyticsData | null; error: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const res = await fetch(`/api/gokhan/analytics?days=${days}`, {
        headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
      }).catch(() => null);
      const body = res?.ok ? ((await res.json()) as AnalyticsData) : null;
      if (!cancelled) setResult({ days, data: body, error: body ? null : "Couldn't load analytics." });
    });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const loading = result?.days !== days;
  const data = result?.data ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-bold text-[#0B1F2A]">Analytics</h2>
        <div className="flex gap-1 bg-white rounded-full border-2 border-[#E5EAF0] p-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                days === r.days ? "bg-[#2CB1A6] text-white" : "text-[#5B6B75] hover:text-[#0B1F2A]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {result?.error && !loading && <p className="text-sm text-[#E05A5A]">{result.error}</p>}

      {data && (
        <div className={`space-y-5 transition-opacity ${loading ? "opacity-50" : ""}`}>
          {/* Selected period, compared with the period before it */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat
              label="New users"
              value={data.period.signups}
              change={<Change now={data.period.signups} before={data.period.prevSignups} />}
              sub={`${data.period.activeUsers} signed in this period`}
            />
            <Stat
              label="Boards created"
              value={data.period.boards}
              change={<Change now={data.period.boards} before={data.period.prevBoards} />}
              sub={`by ${data.period.creators} user${data.period.creators === 1 ? "" : "s"} (boards and cards)`}
            />
            <Stat
              label="Cards created"
              value={data.period.cards}
              change={<Change now={data.period.cards} before={data.period.prevCards} />}
            />
            <Stat
              label="Messages posted"
              value={data.period.messages}
              change={<Change now={data.period.messages} before={data.period.prevMessages} />}
            />
          </div>

          {/* All time */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Stat label="Total users" value={data.totals.users} />
            <Stat label="Total boards" value={data.totals.boards} />
            <Stat label="Total cards" value={data.totals.cards} sub={`${data.totals.deleted} boards and cards deleted`} />
            <Stat label="Sent" value={data.totals.sent} sub={`${data.totals.delivered} delivered`} />
            <Stat label="Messages" value={data.totals.messages} sub={`${data.totals.avgMessagesPerSent} per sent board`} />
            <Stat label="Scheduled" value={data.totals.scheduledUpcoming} sub="upcoming deliveries" />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title="New users">
              <BarChart points={data.series} bucket={data.range.bucket} parts={[{ key: "signups", color: "#0B1F2A", label: "Signups" }]} />
            </Panel>
            <Panel title="Boards and cards created">
              <BarChart
                points={data.series}
                bucket={data.range.bucket}
                parts={[
                  { key: "boards", color: BOARD_COLOR, label: "Boards" },
                  { key: "cards", color: CARD_COLOR, label: "Cards" },
                ]}
              />
            </Panel>
            <Panel title="Messages posted">
              <BarChart points={data.series} bucket={data.range.bucket} parts={[{ key: "messages", color: "#F59E0B", label: "Messages" }]} />
            </Panel>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel title="What happened to them" note="boards and cards created this period">
              <div className="space-y-3">
                <FunnelRow label="Created" value={data.period.funnel.created} of={data.period.funnel.created} />
                <FunnelRow label="Got a message" value={data.period.funnel.withMessages} of={data.period.funnel.created} />
                <FunnelRow label="Sent" value={data.period.funnel.sent} of={data.period.funnel.created} />
                <FunnelRow label="Delivered" value={data.period.funnel.delivered} of={data.period.funnel.created} />
                <FunnelRow label="Deleted" value={data.period.funnel.deleted} of={data.period.funnel.created} />
              </div>
            </Panel>

            <Panel title="Top occasions" note="this period">
              {data.occasions.length === 0 ? (
                <p className="text-sm text-[#5B6B75]">Nothing created yet.</p>
              ) : (
                <ul className="space-y-2">
                  {data.occasions.map((o) => (
                    <li key={o.label} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#0B1F2A] truncate">{o.label}</span>
                      <span className="flex-shrink-0 text-[#5B6B75]">
                        <span style={{ color: BOARD_COLOR }}>{o.boards}</span> /{" "}
                        <span style={{ color: CARD_COLOR }}>{o.cards}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Top templates" note="this period">
              {data.templates.length === 0 ? (
                <p className="text-sm text-[#5B6B75]">
                  No boards from templates yet. Template use is recorded from now on.
                </p>
              ) : (
                <ul className="space-y-2">
                  {data.templates.map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate">
                        {t.shortId ? (
                          <a
                            href={`/${t.format === "card" ? "cards" : "boards"}/${t.shortId}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0B1F2A] hover:text-[#2CB1A6]"
                          >
                            {t.title}
                          </a>
                        ) : (
                          <span className="text-[#5B6B75]">{t.title}</span>
                        )}
                        {t.occasion && <span className="text-xs text-[#5B6B75]"> · {t.occasion}</span>}
                      </span>
                      <span className="flex-shrink-0 font-semibold text-[#0B1F2A]">{t.uses}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>

          <Panel title="Recent signups">
            <div className="overflow-x-auto -mx-4 md:-mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-[#5B6B75]">
                    <th className="px-4 md:px-5 py-2 font-semibold">Email</th>
                    <th className="px-3 py-2 font-semibold">Signed up</th>
                    <th className="px-3 py-2 font-semibold">Last sign-in</th>
                    <th className="px-3 py-2 font-semibold">Method</th>
                    <th className="px-4 md:px-5 py-2 font-semibold text-right">Boards</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentSignups.map((u) => (
                    <tr key={u.email + u.createdAt} className="border-t border-[#E5EAF0]">
                      <td className="px-4 md:px-5 py-2 text-[#0B1F2A] whitespace-nowrap">
                        {u.email}
                        {!u.confirmed && <span className="ml-2 text-xs text-[#E05A5A]">unconfirmed</span>}
                      </td>
                      <td className="px-3 py-2 text-[#5B6B75] whitespace-nowrap">{formatDateTime(u.createdAt)}</td>
                      <td className="px-3 py-2 text-[#5B6B75] whitespace-nowrap">{formatDateTime(u.lastSignInAt)}</td>
                      <td className="px-3 py-2 text-[#5B6B75] capitalize">{u.provider}</td>
                      <td className="px-4 md:px-5 py-2 text-right text-[#0B1F2A]">{u.boards}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Recent boards and cards">
            <div className="overflow-x-auto -mx-4 md:-mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-[#5B6B75]">
                    <th className="px-4 md:px-5 py-2 font-semibold">Title</th>
                    <th className="px-3 py-2 font-semibold">Occasion</th>
                    <th className="px-3 py-2 font-semibold">Owner</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold text-right">Messages</th>
                    <th className="px-4 md:px-5 py-2 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBoards.map((b) => (
                    <tr key={b.shortId} className="border-t border-[#E5EAF0]">
                      <td className="px-4 md:px-5 py-2 max-w-[16rem]">
                        <span className="flex items-center gap-2 min-w-0">
                          <span
                            className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              b.format === "card" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {b.format}
                          </span>
                          <a
                            href={`/${b.format === "card" ? "cards" : "boards"}/${b.shortId}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-[#0B1F2A] hover:text-[#2CB1A6]"
                          >
                            {b.title || "Untitled"}
                          </a>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[#5B6B75] whitespace-nowrap">
                        {b.occasion}
                        {b.fromTemplate && <span className="ml-1 text-xs text-[#2CB1A6]">· template</span>}
                      </td>
                      <td className="px-3 py-2 text-[#5B6B75] whitespace-nowrap">{b.owner || "—"}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] ?? STATUS_STYLES.CREATED}`}>
                          {b.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-[#0B1F2A]">{b.messages}</td>
                      <td className="px-4 md:px-5 py-2 text-[#5B6B75] whitespace-nowrap">{formatDateTime(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <p className="text-xs text-[#5B6B75]">
            Counts exclude templates. Charts use UTC {data.range.bucket === "week" ? "weeks" : "days"}. Visits are in
            Google Analytics and Vercel Analytics.
          </p>
        </div>
      )}

      {!data && loading && <div className="h-64 rounded-xl bg-white border-2 border-[#E5EAF0] animate-pulse" />}
    </div>
  );
}
