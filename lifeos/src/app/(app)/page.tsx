import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTodayEvents } from "@/lib/google";
import { todayISO, nowVerbose, addDaysISO } from "@/lib/dates";
import TaskItem from "@/components/TaskItem";
import HabitRow from "@/components/HabitRow";
import type { Habit, HabitLog, Task } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Today — the command centre. One phone-screen glance. */
export default async function TodayPage() {
  const supabase = createClient();
  const today = todayISO();

  const [tasksRes, waitingRes, habitsRes, logsRes, metricRes, inboxRes, events] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("*, projects(name), areas(name)")
        .eq("status", "open")
        .lte("due_date", today)
        .order("priority", { ascending: false })
        .order("due_time", { ascending: true, nullsFirst: false })
        .limit(3),
      supabase
        .from("tasks")
        .select("*, projects(name), areas(name)")
        .eq("status", "waiting")
        .order("updated_at", { ascending: false })
        .limit(4),
      supabase.from("habits").select("*").order("created_at"),
      supabase.from("habit_logs").select("*").eq("date", today),
      supabase
        .from("metrics")
        .select("*")
        .in("type", ["glucose_avg", "hrv"])
        .order("recorded_at", { ascending: false })
        .limit(1),
      supabase
        .from("captures")
        .select("id", { count: "exact", head: true })
        .eq("status", "inbox"),
      getTodayEvents(3),
    ]);

  const tasks = (tasksRes.data ?? []) as (Task & {
    projects: { name: string } | null;
    areas: { name: string } | null;
  })[];
  const waiting = (waitingRes.data ?? []) as typeof tasks;
  const habits = (habitsRes.data ?? []) as Habit[];
  const logs = (logsRes.data ?? []) as HabitLog[];
  const metric = metricRes.data?.[0];
  const inboxCount = inboxRes.count ?? 0;

  return (
    <>
      <div>
        <h1 className="text-xl font-bold">{nowVerbose().split(" at ")[0]}</h1>
        {inboxCount > 0 && (
          <Link href="/inbox" className="text-sm font-medium" style={{ color: "#d03b3b" }}>
            📥 {inboxCount} capture{inboxCount === 1 ? "" : "s"} to sort
          </Link>
        )}
      </div>

      {events.length > 0 && (
        <section className="card">
          <h2 className="section-title mb-2">Calendar</h2>
          <ul className="space-y-1">
            {events.map((e) => (
              <li key={e.id} className="flex gap-2 text-sm">
                <span className="tabular-nums" style={{ color: "var(--ink-muted)" }}>
                  {e.allDay ? "all day" : e.start.slice(11, 16)}
                </span>
                <span>{e.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="section-title">Top tasks</h2>
          <Link href="/tasks" className="text-xs" style={{ color: "var(--series)" }}>
            All tasks →
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p className="py-3 text-sm" style={{ color: "var(--ink-muted)" }}>
            Nothing due today. 🎉
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {tasks.map((t) => (
              <TaskItem key={t.id} task={t} context={t.projects?.name ?? t.areas?.name} />
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="section-title mb-1">Habits</h2>
        {habits.map((h) => {
          const log = logs.find((l) => l.habit_id === h.id && l.done);
          return (
            <HabitRow
              key={h.id}
              habit={h}
              doneToday={!!log}
              todayValue={log?.value ?? null}
            />
          );
        })}
        {habits.length === 0 && (
          <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            No habits yet — add one on the Habits screen.
          </p>
        )}
      </section>

      {metric && (
        <section className="card flex items-baseline justify-between">
          <div>
            <h2 className="section-title">
              {metric.type === "glucose_avg" ? "7-day glucose avg" : "Morning HRV"}
            </h2>
            <p className="text-2xl font-bold">
              {Number(metric.value)}
              <span className="ml-1 text-sm font-normal" style={{ color: "var(--ink-muted)" }}>
                {metric.unit}
              </span>
            </p>
          </div>
          <Link href="/health" className="text-xs" style={{ color: "var(--series)" }}>
            Health →
          </Link>
        </section>
      )}

      {waiting.length > 0 && (
        <section className="card">
          <h2 className="section-title mb-1">Waiting on</h2>
          <ul className="space-y-1">
            {waiting.map((t) => (
              <li key={t.id} className="text-sm">
                <span className="font-medium">{t.waiting_on ?? "…"}</span>
                <span style={{ color: "var(--ink-muted)" }}> — {t.title}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-center text-xs" style={{ color: "var(--ink-muted)" }}>
        ⌘K to capture · tomorrow: {addDaysISO(today, 1)}
      </p>
    </>
  );
}
