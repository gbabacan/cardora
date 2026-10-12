import { supabase } from "@/lib/supabase";

// fetch() for the admin API: adds the signed-in user's token, which the
// server checks against ADMIN_EMAILS. Throws with the server's message on
// failure.
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
  return body as T;
}
