"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/app/not-found";
import Analytics from "./Analytics";
import Templates from "./Templates";
import MediaLibrary from "./MediaLibrary";
import Moderation from "./Moderation";
import Deliveries from "./Deliveries";

const TABS = [
  { id: "analytics", label: "Analytics" },
  { id: "templates", label: "Templates" },
  { id: "media", label: "Media" },
  { id: "moderation", label: "Moderation" },
  { id: "deliveries", label: "Deliveries" },
] as const;
type Tab = (typeof TABS)[number]["id"];

// The tab lives in the URL hash so a reload stays on it. Read through
// useSyncExternalStore so the server render (no hash) can't mismatch.
const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  // Result of the server-side admin check, tied to the user it was run for.
  const [check, setCheck] = useState<{ userId: string; email: string | null } | null>(null);
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  const tab: Tab = TABS.find((t) => `#${t.id}` === hash)?.id ?? "analytics";
  const openTab = (next: Tab) => {
    window.history.replaceState(null, "", next === "analytics" ? window.location.pathname : `#${next}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const res = await fetch("/api/gokhan/session", {
        headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
      }).catch(() => null);
      const body = res?.ok ? await res.json() : null;
      if (!cancelled) setCheck({ userId: user.id, email: body?.email ?? null });
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const checked = user && check?.userId === user.id ? check : null;

  // Anyone who is not a signed-in admin sees the normal 404 page.
  if (!loading && (!user || (checked && !checked.email))) return <NotFound />;
  if (!checked?.email) return <div className="min-h-screen bg-[#F7FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <header className="bg-white border-b border-[#E5EAF0]">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-[#0B1F2A]">Cardora Admin</h1>
          <span className="text-sm text-[#5B6B75] truncate">{checked.email}</span>
        </div>
        {/* Scrolls sideways on phones rather than widening the page. */}
        <nav className="max-w-6xl mx-auto px-4 md:px-6 flex gap-6 overflow-x-auto scrollbar-hide" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => openTab(t.id)}
              className={`pb-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? "border-[#2CB1A6] text-[#0B1F2A]"
                  : "border-transparent text-[#5B6B75] hover:text-[#0B1F2A]"
              }`}
              aria-current={tab === t.id ? "page" : undefined}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {tab === "analytics" && <Analytics />}
        {tab === "templates" && <Templates />}
        {tab === "media" && <MediaLibrary />}
        {tab === "moderation" && <Moderation />}
        {tab === "deliveries" && <Deliveries />}
      </main>
    </div>
  );
}
