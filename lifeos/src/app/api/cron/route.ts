import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, lifeosUserId } from "@/lib/supabase/admin";
import { sendPush } from "@/lib/pushover";
import { todayISO, nowHM, shortDate } from "@/lib/dates";
import { getTodayEvents } from "@/lib/google";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/cron?job=<name> — scheduled jobs, driven by an external scheduler
 * (cron-job.org, Railway cron, GitHub Actions…).
 * Auth: Authorization: Bearer <CRON_SECRET>
 *
 * Jobs and suggested schedules:
 *   reminders        every 5 minutes  — task reminders at configured offsets
 *   daily-summary    07:30 daily      — events, top tasks, habits, inbox count
 *   missed-routines  21:30 daily      — nudge for habits not logged today
 *   weekly-review    18:00 Sundays    — link to the Review screen
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const job = req.nextUrl.searchParams.get("job");
  const db = createAdminClient();
  const userId = lifeosUserId();

  try {
    switch (job) {
      case "reminders":
        return NextResponse.json(await runReminders(db, userId));
      case "daily-summary":
        return NextResponse.json(await runDailySummary(db, userId));
      case "missed-routines":
        return NextResponse.json(await runMissedRoutines(db, userId));
      case "weekly-review":
        return NextResponse.json(await runWeeklyReview(db, userId));
      default:
        return NextResponse.json(
          { error: "unknown job — use reminders | daily-summary | missed-routines | weekly-review" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error(`[cron:${job}] failed:`, err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

type Db = ReturnType<typeof createAdminClient>;

/** Fire task reminders whose (due datetime - offset) falls in the last 5 minutes. */
async function runReminders(db: Db, userId: string) {
  const today = todayISO();
  const { data: tasks } = await db
    .from("tasks")
    .select("id, title, due_date, due_time, reminder_offsets")
    .eq("user_id", userId)
    .eq("status", "open")
    .eq("due_date", today)
    .not("due_time", "is", null);

  const now = hmToMinutes(nowHM());
  let sent = 0;
  for (const t of tasks ?? []) {
    const due = hmToMinutes((t.due_time as string).slice(0, 5));
    const offsets: number[] = t.reminder_offsets?.length ? t.reminder_offsets : [0];
    for (const offset of offsets) {
      const fireAt = due - offset;
      if (now >= fireAt && now < fireAt + 5) {
        await sendPush({
          title: "Task reminder",
          message: `${t.title} — due ${(t.due_time as string).slice(0, 5)}`,
          priority: 1,
        });
        sent++;
        break;
      }
    }
  }
  return { job: "reminders", sent };
}

/** 07:30 — today's calendar events, top tasks, habit prompts, inbox count. */
async function runDailySummary(db: Db, userId: string) {
  const today = todayISO();
  const [tasksRes, inboxRes, habitsRes, events] = await Promise.all([
    db
      .from("tasks")
      .select("title, due_time, priority")
      .eq("user_id", userId)
      .eq("status", "open")
      .lte("due_date", today)
      .order("priority", { ascending: false })
      .limit(3),
    db
      .from("captures")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "inbox"),
    db.from("habits").select("name, streak_current").eq("user_id", userId),
    getTodayEvents(3),
  ]);

  const lines: string[] = [];
  if (events.length) {
    lines.push(
      "📅 " +
        events
          .map((e) => (e.allDay ? e.summary : `${e.start.slice(11, 16)} ${e.summary}`))
          .join(" · ")
    );
  }
  for (const t of tasksRes.data ?? []) {
    lines.push(`☐ ${t.title}${t.due_time ? ` (${(t.due_time as string).slice(0, 5)})` : ""}`);
  }
  for (const h of habitsRes.data ?? []) {
    lines.push(`🔁 ${h.name} — streak ${h.streak_current}`);
  }
  if (inboxRes.count) lines.push(`📥 ${inboxRes.count} unsorted capture${inboxRes.count === 1 ? "" : "s"}`);
  if (!lines.length) lines.push("Nothing scheduled. Clean slate.");

  await sendPush({ title: `Today — ${shortDate(today)}`, message: lines.join("\n") });
  return { job: "daily-summary", lines: lines.length };
}

/** 21:30 — nudge for daily habits with a notify_time that aren't logged today. */
async function runMissedRoutines(db: Db, userId: string) {
  const today = todayISO();
  const { data: habits } = await db
    .from("habits")
    .select("id, name, streak_current, notify_time")
    .eq("user_id", userId)
    .not("notify_time", "is", null);

  let nudged = 0;
  for (const h of habits ?? []) {
    const { data: log } = await db
      .from("habit_logs")
      .select("id")
      .eq("habit_id", h.id)
      .eq("date", today)
      .maybeSingle();
    if (!log) {
      await sendPush({
        title: "Routine not logged",
        message: `${h.name} isn't logged today — streak ${h.streak_current} on the line.`,
      });
      nudged++;
    }
  }
  return { job: "missed-routines", nudged };
}

/** Sunday 18:00 — weekly review prompt with headline counts. */
async function runWeeklyReview(db: Db, userId: string) {
  const today = todayISO();
  const [overdue, touches] = await Promise.all([
    db
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "open")
      .lt("due_date", today),
    db
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .lte("next_touch_due", today),
  ]);

  await sendPush({
    title: "Weekly review",
    message: `${overdue.count ?? 0} overdue task(s), ${touches.count ?? 0} overdue people touch(es). Open the Review screen.`,
    url: process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/review` : undefined,
    urlTitle: "Open Review",
  });
  return { job: "weekly-review", overdue: overdue.count, touches: touches.count };
}

function hmToMinutes(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
}
