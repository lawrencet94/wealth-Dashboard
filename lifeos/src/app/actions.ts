"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { nextOccurrence } from "@/lib/rrule";
import { addDaysISO, todayISO } from "@/lib/dates";
import { parseCapture } from "@/lib/capture/parser";
import { loadParserContext } from "@/lib/capture/context";
import { routeCapture, recomputeStreak } from "@/lib/capture/router";
import type { ParsedCapture } from "@/lib/types";

async function userClient() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, userId: user.id };
}

function refreshAll() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export async function createTask(input: {
  title: string;
  areaId?: string | null;
  projectId?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: number;
  notes?: string | null;
  recurrenceRule?: string | null;
}) {
  const { supabase } = await userClient();
  const { error } = await supabase.from("tasks").insert({
    title: input.title,
    area_id: input.areaId ?? null,
    project_id: input.projectId ?? null,
    due_date: input.dueDate || null,
    due_time: input.dueTime || null,
    priority: input.priority ?? 0,
    notes: input.notes ?? null,
    recurrence_rule: input.recurrenceRule || null,
    created_via: "web",
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

/** Complete a task; recurring tasks regenerate their next occurrence. */
export async function completeTask(taskId: string) {
  const { supabase } = await userClient();
  const { data: task, error } = await supabase
    .from("tasks")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("id", taskId)
    .select("*")
    .single();
  if (error || !task) throw new Error(error?.message ?? "task not found");

  if (task.recurrence_rule) {
    const base = task.due_date ?? todayISO();
    const next = nextOccurrence(task.recurrence_rule, base);
    if (next) {
      await supabase.from("tasks").insert({
        title: task.title,
        notes: task.notes,
        project_id: task.project_id,
        area_id: task.area_id,
        due_date: next,
        due_time: task.due_time,
        priority: task.priority,
        recurrence_rule: task.recurrence_rule,
        reminder_offsets: task.reminder_offsets,
        created_via: "system",
      });
    }
  }
  refreshAll();
}

export async function reopenTask(taskId: string) {
  const { supabase } = await userClient();
  await supabase
    .from("tasks")
    .update({ status: "open", completed_at: null })
    .eq("id", taskId);
  refreshAll();
}

/** Snooze: +1d, +1w, or an explicit date. */
export async function snoozeTask(taskId: string, to: "+1d" | "+1w" | string) {
  const { supabase } = await userClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("due_date")
    .eq("id", taskId)
    .single();
  const base = task?.due_date ?? todayISO();
  const newDate =
    to === "+1d" ? addDaysISO(base < todayISO() ? todayISO() : base, 1)
    : to === "+1w" ? addDaysISO(base < todayISO() ? todayISO() : base, 7)
    : to;
  await supabase.from("tasks").update({ due_date: newDate }).eq("id", taskId);
  refreshAll();
}

export async function setTaskPriority(taskId: string, priority: number) {
  const { supabase } = await userClient();
  await supabase
    .from("tasks")
    .update({ priority: Math.max(0, Math.min(3, priority)) })
    .eq("id", taskId);
  refreshAll();
}

export async function setTaskWaiting(taskId: string, waitingOn: string | null) {
  const { supabase } = await userClient();
  await supabase
    .from("tasks")
    .update(
      waitingOn
        ? { status: "waiting", waiting_on: waitingOn }
        : { status: "open", waiting_on: null }
    )
    .eq("id", taskId);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Captures / Inbox
// ---------------------------------------------------------------------------

/** Web quick-add (⌘K): same pipeline as voice capture, session-authenticated. */
export async function quickCapture(text: string) {
  const { supabase, userId } = await userClient();
  const trimmed = text.trim();
  if (!trimmed) return { routed: false, summary: "Empty capture" };

  const { data: capture, error } = await supabase
    .from("captures")
    .insert({ raw_text: trimmed, source: "web", status: "inbox" })
    .select("id")
    .single();
  if (error || !capture) throw new Error(error?.message ?? "capture failed");

  try {
    const ctx = await loadParserContext(supabase, userId);
    const parsed = await parseCapture(trimmed, ctx);
    const result = await routeCapture(supabase, userId, parsed);
    await supabase
      .from("captures")
      .update({
        parsed_json: parsed,
        confidence: parsed.confidence,
        status: result.routed ? "routed" : "inbox",
        routed_to_table: result.table,
        routed_to_id: result.id,
      })
      .eq("id", capture.id);
    refreshAll();
    return { routed: result.routed, summary: result.summary };
  } catch (err) {
    console.error("[quickCapture] parser failed, kept in inbox:", err);
    refreshAll();
    return { routed: false, summary: "Sent to Inbox (parser unavailable)" };
  }
}

/** Manually route an inbox capture as a task into an area/project. */
export async function routeInboxAsTask(
  captureId: string,
  input: { title: string; areaId: string | null; projectId: string | null; dueDate: string | null }
) {
  const { supabase } = await userClient();
  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      area_id: input.areaId,
      project_id: input.projectId,
      due_date: input.dueDate || null,
      created_via: "voice",
    })
    .select("id")
    .single();
  if (error || !task) throw new Error(error?.message ?? "task insert failed");
  await supabase
    .from("captures")
    .update({ status: "routed", routed_to_table: "tasks", routed_to_id: task.id })
    .eq("id", captureId);
  refreshAll();
}

/** Manually route an inbox capture as a note. */
export async function routeInboxAsNote(captureId: string, body: string, areaId: string | null) {
  const { supabase } = await userClient();
  const { data: note, error } = await supabase
    .from("notes")
    .insert({
      body,
      entity_type: areaId ? "area" : null,
      entity_id: areaId,
    })
    .select("id")
    .single();
  if (error || !note) throw new Error(error?.message ?? "note insert failed");
  await supabase
    .from("captures")
    .update({ status: "routed", routed_to_table: "notes", routed_to_id: note.id })
    .eq("id", captureId);
  refreshAll();
}

export async function dismissCapture(captureId: string) {
  const { supabase } = await userClient();
  await supabase.from("captures").update({ status: "dismissed" }).eq("id", captureId);
  refreshAll();
}

/** Accept the parser's suggestion for an inbox item despite low confidence. */
export async function acceptSuggestion(captureId: string) {
  const { supabase, userId } = await userClient();
  const { data: capture } = await supabase
    .from("captures")
    .select("id, parsed_json")
    .eq("id", captureId)
    .single();
  if (!capture?.parsed_json) throw new Error("No parsed suggestion on this capture");
  const parsed = { ...(capture.parsed_json as ParsedCapture), confidence: 1 };
  const result = await routeCapture(supabase, userId, parsed);
  if (result.routed) {
    await supabase
      .from("captures")
      .update({ status: "routed", routed_to_table: result.table, routed_to_id: result.id })
      .eq("id", captureId);
  }
  refreshAll();
  return result;
}

// ---------------------------------------------------------------------------
// Habits
// ---------------------------------------------------------------------------

export async function logHabit(habitId: string, value?: number | null) {
  const { supabase, userId } = await userClient();
  const { data: habit } = await supabase
    .from("habits")
    .select("id, streak_best")
    .eq("id", habitId)
    .single();
  if (!habit) throw new Error("habit not found");
  const { error } = await supabase.from("habit_logs").upsert(
    { habit_id: habitId, date: todayISO(), done: true, value: value ?? null },
    { onConflict: "habit_id,date" }
  );
  if (error) throw new Error(error.message);
  await recomputeStreak(supabase, userId, habitId, habit.streak_best);
  refreshAll();
}

export async function unlogHabit(habitId: string) {
  const { supabase, userId } = await userClient();
  await supabase
    .from("habit_logs")
    .delete()
    .eq("habit_id", habitId)
    .eq("date", todayISO());
  const { data: habit } = await supabase
    .from("habits")
    .select("streak_best")
    .eq("id", habitId)
    .single();
  await recomputeStreak(supabase, userId, habitId, habit?.streak_best ?? 0);
  refreshAll();
}

export async function createHabit(input: {
  name: string;
  notifyTime?: string | null;
  trackValue?: boolean;
  valueLabel?: string | null;
}) {
  const { supabase } = await userClient();
  const { error } = await supabase.from("habits").insert({
    name: input.name,
    notify_time: input.notifyTime || null,
    track_value: input.trackValue ?? false,
    value_label: input.valueLabel ?? null,
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export async function addMetric(input: { type: string; value: number; unit?: string | null }) {
  const { supabase } = await userClient();
  const { error } = await supabase.from("metrics").insert({
    type: input.type,
    value: input.value,
    unit: input.unit ?? null,
    source: "manual",
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export async function touchContact(contactId: string, nextTouchDue?: string | null) {
  const { supabase } = await userClient();
  await supabase
    .from("contacts")
    .update({ last_touch: todayISO(), next_touch_due: nextTouchDue ?? null })
    .eq("id", contactId);
  refreshAll();
}

export async function createContact(input: {
  name: string;
  relationship?: string | null;
  contextNotes?: string | null;
  nextTouchDue?: string | null;
}) {
  const { supabase } = await userClient();
  const { error } = await supabase.from("contacts").insert({
    name: input.name,
    relationship: input.relationship ?? null,
    context_notes: input.contextNotes ?? null,
    next_touch_due: input.nextTouchDue || null,
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Trips
// ---------------------------------------------------------------------------

const TRIP_BASE_CHECKLIST = [
  "Passports / docs",
  "Travel insurance",
  "Chargers & adapters",
  "Medication",
];

export async function createTrip(input: { name: string; destination?: string | null }) {
  const { supabase } = await userClient();
  const { error } = await supabase.from("trips").insert({
    name: input.name,
    destination: input.destination ?? null,
    checklist_json: TRIP_BASE_CHECKLIST.map((item) => ({ item, done: false })),
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

export async function setTripStatus(tripId: string, status: string) {
  const { supabase } = await userClient();
  await supabase.from("trips").update({ status }).eq("id", tripId);
  refreshAll();
}

export async function toggleTripItem(tripId: string, index: number) {
  const { supabase } = await userClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("checklist_json")
    .eq("id", tripId)
    .single();
  if (!trip) return;
  const list = Array.isArray(trip.checklist_json) ? [...trip.checklist_json] : [];
  if (list[index]) {
    list[index] = { ...list[index], done: !list[index].done };
    await supabase.from("trips").update({ checklist_json: list }).eq("id", tripId);
  }
  refreshAll();
}

export async function addTripItem(tripId: string, item: string) {
  const { supabase } = await userClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("checklist_json")
    .eq("id", tripId)
    .single();
  if (!trip) return;
  const list = Array.isArray(trip.checklist_json) ? [...trip.checklist_json] : [];
  list.push({ item, done: false });
  await supabase.from("trips").update({ checklist_json: list }).eq("id", tripId);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Decisions
// ---------------------------------------------------------------------------

export async function scoreDecision(
  decisionId: string,
  criterionIndex: number,
  option: string,
  score: number
) {
  const { supabase } = await userClient();
  const { data: decision } = await supabase
    .from("decisions")
    .select("criteria_json")
    .eq("id", decisionId)
    .single();
  if (!decision) return;
  const criteria = Array.isArray(decision.criteria_json) ? [...decision.criteria_json] : [];
  if (criteria[criterionIndex]) {
    criteria[criterionIndex] = {
      ...criteria[criterionIndex],
      scores: { ...(criteria[criterionIndex].scores ?? {}), [option]: score },
    };
    await supabase.from("decisions").update({ criteria_json: criteria }).eq("id", decisionId);
  }
  refreshAll();
}

export async function decideDecision(decisionId: string, outcome: string) {
  const { supabase } = await userClient();
  await supabase
    .from("decisions")
    .update({ status: "decided", outcome })
    .eq("id", decisionId);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Wealth
// ---------------------------------------------------------------------------

export async function addWealthSnapshot(input: {
  netWorth?: number | null;
  savingsGoalProgress?: number | null;
  monthSpend?: number | null;
}) {
  const { supabase } = await userClient();
  const { error } = await supabase.from("wealth_snapshots").insert({
    net_worth: input.netWorth ?? null,
    savings_goal_progress: input.savingsGoalProgress ?? null,
    month_spend: input.monthSpend ?? null,
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------

export async function addNote(body: string, entityType?: string | null, entityId?: string | null) {
  const { supabase } = await userClient();
  const { error } = await supabase.from("notes").insert({
    body,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
  });
  if (error) throw new Error(error.message);
  refreshAll();
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  refreshAll();
}
