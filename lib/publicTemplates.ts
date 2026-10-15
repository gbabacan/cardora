import { supabase } from "@/lib/supabase";
import type { Board } from "@/lib/boards";

// Visible templates in display order, as the templates page and its server
// render both need them. Uses the anon client, so it works on the server
// and in the browser alike.
export async function fetchPublicTemplates(): Promise<Board[] | null> {
  const { data, error } = await supabase
    .from("boards")
    .select(
      `*, card_background_data:card_background_id(id, type, lottie_animation:lottie_animation_id(id, name, file_path), image:image_id(id, name, file_path, source_type, remote_url))`
    )
    .eq("is_template", true)
    .eq("template_hidden", false)
    .order("occasion_type")
    .order("template_order", { ascending: true, nullsFirst: false });

  if (error || !data) return null;
  return data as Board[];
}
