import type { SupabaseClient } from "@supabase/supabase-js";
import type { ParserContext } from "./parser";

/** Load the entity lists the parser prompt needs (areas, projects, contacts…). */
export async function loadParserContext(
  db: SupabaseClient,
  userId: string
): Promise<ParserContext> {
  const [areas, projects, contacts, habits, trips] = await Promise.all([
    db.from("areas").select("name").eq("user_id", userId).order("sort_order"),
    db
      .from("projects")
      .select("name, areas(name)")
      .eq("user_id", userId)
      .eq("status", "active"),
    db.from("contacts").select("name").eq("user_id", userId),
    db.from("habits").select("name").eq("user_id", userId),
    db
      .from("trips")
      .select("name")
      .eq("user_id", userId)
      .neq("status", "done"),
  ]);

  return {
    areas: areas.data ?? [],
    projects: (projects.data ?? []).map((p) => ({
      name: p.name as string,
      area: (p.areas as unknown as { name: string } | null)?.name ?? null,
    })),
    contacts: contacts.data ?? [],
    habits: habits.data ?? [],
    trips: trips.data ?? [],
  };
}
