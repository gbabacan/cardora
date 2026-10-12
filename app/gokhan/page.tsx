"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/app/not-found";
import Analytics from "./Analytics";

// Sections still to build, in priority order. See ADMIN_PAGE_PLAN.md.
const SECTIONS = [
  { title: "Templates", detail: "Create, edit, order and switch templates on or off." },
  { title: "Media library", detail: "Lotties, images and backgrounds, and where they are used." },
  { title: "Moderation", detail: "Find any board or card, hide messages, restore boards." },
  { title: "Deliveries", detail: "Scheduled and failed emails, resend and reschedule." },
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  // Result of the server-side admin check, tied to the user it was run for.
  const [check, setCheck] = useState<{ userId: string; email: string | null } | null>(null);

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
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10">
        <Analytics />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section) => (
            <div key={section.title} className="bg-white rounded-xl border-2 border-[#E5EAF0] p-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="font-semibold text-[#0B1F2A]">{section.title}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E8F5F4] text-[#2CB1A6]">
                  Coming soon
                </span>
              </div>
              <p className="text-sm text-[#5B6B75]">{section.detail}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
