import type { SupabaseClient } from "@supabase/supabase-js";
import type { ParsedCapture } from "../types";
import { todayISO } from "../dates";

export interface RouteResult {
  routed: boolean;
  table: string | null;
  id: string | null;
  summary: string; // human confirmation, e.g. "Task added to Property: chase surveyor, due Thu"
}

const CONFIDENCE_THRESHOLD = 0.8;

/**
 * Route a parsed capture into the right table. Anything ambiguous falls back
 * to `routed: false` and stays in the Inbox — nothing is ever guessed into
 * the wrong place.
 *
 * `db` must be scoped to the user: either a session client (RLS) or the admin
 * client with `userId` passed for explicit user_id columns.
 */
export async function routeCapture(
  db: SupabaseClient,
  userId: string,
  parsed: ParsedCapture
): Promise<RouteResult> {
  if (parsed.confidence < CONFIDENCE_THRESHOLD || parsed.type === "unknown") {
    return { routed: false, table: null, id: null, summary: "Sent to Inbox" };
  }

  const areaByName = async (name: string | null) => {
    if (!name) return null;
    const { data } = await db
      .from("areas")
      .select("id, name")
      .eq("user_id", userId)
      .ilike("name", `%${name}%`)
      .limit(1)
      .maybeSingle();
    return data;
  };
  const projectByName = async (name: string | null) => {
    if (!name) return null;
    const { data } = await db
      .from("projects")
      .select("id, name, area_id")
      .eq("user_id", userId)
      .ilike("name", `%${name}%`)
      .limit(1)
      .maybeSingle();
    return data;
  };

  switch (parsed.type) {
    case "task": {
      const project = await projectByName(parsed.project_name);
      const area = (await areaByName(parsed.area_name)) ?? null;
      const { data, error } = await db
        .from("tasks")
        .insert({
          user_id: userId,
          title: parsed.title,
          notes: parsed.notes,
          project_id: project?.id ?? null,
          area_id: area?.id ?? project?.area_id ?? null,
          due_date: parsed.due_date,
          due_time: parsed.due_time,
          priority: parsed.priority ?? 0,
          created_via: "voice",
        })
        .select("id")
        .single();
      if (error || !data) return inboxFallback(error?.message);
      const where = project?.name ?? area?.name ?? "Tasks";
      const when = parsed.due_date ? `, due ${parsed.due_date}` : "";
      return { routed: true, table: "tasks", id: data.id, summary: `Task added to ${where}: ${parsed.title}${when}` };
    }

    case "note": {
      const area = await areaByName(parsed.area_name);
      const project = await projectByName(parsed.project_name);
      const entity = project
        ? { entity_type: "project", entity_id: project.id }
        : area
          ? { entity_type: "area", entity_id: area.id }
          : { entity_type: null, entity_id: null };
      const { data, error } = await db
        .from("notes")
        .insert({ user_id: userId, body: parsed.title, ...entity })
        .select("id")
        .single();
      if (error || !data) return inboxFallback(error?.message);
      const where = project?.name ?? area?.name ?? "Notes";
      return { routed: true, table: "notes", id: data.id, summary: `Note filed under ${where}` };
    }

    case "habit_log": {
      if (!parsed.habit_name) return inboxFallback("no habit name");
      const { data: habit } = await db
        .from("habits")
        .select("id, name, streak_current, streak_best")
        .eq("user_id", userId)
        .ilike("name", `%${parsed.habit_name}%`)
        .limit(1)
        .maybeSingle();
      if (!habit) return inboxFallback("habit not found");
      const date = parsed.due_date ?? todayISO();
      const { data, error } = await db
        .from("habit_logs")
        .upsert(
          { user_id: userId, habit_id: habit.id, date, done: true, value: parsed.value },
          { onConflict: "habit_id,date" }
        )
        .select("id")
        .single();
      if (error || !data) return inboxFallback(error?.message);
      const streak = await recomputeStreak(db, userId, habit.id, habit.streak_best);
      const valueTxt = parsed.value != null ? ` (${parsed.value})` : "";
      return {
        routed: true,
        table: "habit_logs",
        id: data.id,
        summary: `${habit.name} logged${valueTxt} — streak ${streak}`,
      };
    }

    case "metric": {
      if (!parsed.metric_type || parsed.value == null) return inboxFallback("missing metric fields");
      const { data, error } = await db
        .from("metrics")
        .insert({
          user_id: userId,
          type: parsed.metric_type,
          value: parsed.value,
          unit: parsed.unit,
          source: "shortcut",
        })
        .select("id")
        .single();
      if (error || !data) return inboxFallback(error?.message);
      return {
        routed: true,
        table: "metrics",
        id: data.id,
        summary: `Logged ${parsed.metric_type.replace("_", " ")}: ${parsed.value}${parsed.unit ? " " + parsed.unit : ""}`,
      };
    }

    case "contact_touch": {
      if (!parsed.contact_name) return inboxFallback("no contact name");
      const { data: contact } = await db
        .from("contacts")
        .select("id, name")
        .eq("user_id", userId)
        .ilike("name", `%${parsed.contact_name}%`)
        .limit(1)
        .maybeSingle();
      if (!contact) return inboxFallback("contact not found");
      const { error } = await db
        .from("contacts")
        .update({
          last_touch: todayISO(),
          next_touch_due: parsed.due_date,
        })
        .eq("id", contact.id);
      if (error) return inboxFallback(error.message);
      await db.from("notes").insert({
        user_id: userId,
        entity_type: "contact",
        entity_id: contact.id,
        body: parsed.title,
      });
      return {
        routed: true,
        table: "contacts",
        id: contact.id,
        summary: `${contact.name}: touch logged${parsed.due_date ? `, next due ${parsed.due_date}` : ""}`,
      };
    }

    case "trip_item": {
      if (!parsed.trip_name) return inboxFallback("no trip name");
      const { data: trip } = await db
        .from("trips")
        .select("id, name, checklist_json")
        .eq("user_id", userId)
        .ilike("name", `%${parsed.trip_name}%`)
        .limit(1)
        .maybeSingle();
      if (!trip) return inboxFallback("trip not found");
      const checklist = Array.isArray(trip.checklist_json) ? trip.checklist_json : [];
      checklist.push({ item: parsed.title, done: false });
      const { error } = await db
        .from("trips")
        .update({ checklist_json: checklist })
        .eq("id", trip.id);
      if (error) return inboxFallback(error.message);
      return {
        routed: true,
        table: "trips",
        id: trip.id,
        summary: `Added to ${trip.name} checklist: ${parsed.title}`,
      };
    }

    default:
      return inboxFallback("unhandled type");
  }
}

function inboxFallback(reason?: string): RouteResult {
  if (reason) console.warn("[capture] falling back to inbox:", reason);
  return { routed: false, table: null, id: null, summary: "Sent to Inbox" };
}

/**
 * Recompute the current streak by walking back from today, and persist it.
 * Returns the new current streak.
 */
export async function recomputeStreak(
  db: SupabaseClient,
  userId: string,
  habitId: string,
  previousBest: number
): Promise<number> {
  const { data: logs } = await db
    .from("habit_logs")
    .select("date, done")
    .eq("user_id", userId)
    .eq("habit_id", habitId)
    .eq("done", true)
    .order("date", { ascending: false })
    .limit(400);

  const dates = new Set((logs ?? []).map((l) => l.date as string));
  let streak = 0;
  let cursor = todayISO();
  // A missing log for today doesn't break the streak yet — start from
  // yesterday if today isn't logged.
  if (!dates.has(cursor)) {
    cursor = shiftDay(cursor, -1);
  }
  while (dates.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }

  await db
    .from("habits")
    .update({ streak_current: streak, streak_best: Math.max(previousBest, streak) })
    .eq("id", habitId);
  return streak;
}

function shiftDay(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
