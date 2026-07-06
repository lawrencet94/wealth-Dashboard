import { createClient } from "@/lib/supabase/server";
import { addDaysISO, todayISO } from "@/lib/dates";
import HabitRow from "@/components/HabitRow";
import NewHabitForm from "@/components/NewHabitForm";
import LineChart, { type ChartPoint } from "@/components/LineChart";
import type { Habit, HabitLog } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Habits — streaks, plus a rating chart for value-tracked habits (chess → 1000). */
export default async function HabitsPage() {
  const supabase = createClient();
  const today = todayISO();
  const since = addDaysISO(today, -90);

  const [habitsRes, logsRes] = await Promise.all([
    supabase.from("habits").select("*").order("created_at"),
    supabase
      .from("habit_logs")
      .select("*")
      .gte("date", since)
      .order("date"),
  ]);
  const habits = (habitsRes.data ?? []) as Habit[];
  const logs = (logsRes.data ?? []) as HabitLog[];
  const todayLogs = logs.filter((l) => l.date === today);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Habits</h1>
        <NewHabitForm />
      </div>

      <section className="card">
        {habits.length === 0 ? (
          <p className="py-4 text-center text-sm" style={{ color: "var(--ink-muted)" }}>
            No habits yet.
          </p>
        ) : (
          habits.map((h) => {
            const log = todayLogs.find((l) => l.habit_id === h.id && l.done);
            return (
              <HabitRow key={h.id} habit={h} doneToday={!!log} todayValue={log?.value ?? null} />
            );
          })
        )}
      </section>

      {habits
        .filter((h) => h.track_value)
        .map((h) => {
          const points: ChartPoint[] = logs
            .filter((l) => l.habit_id === h.id && l.value != null)
            .map((l) => ({ date: l.date, value: Number(l.value) }));
          const goal = h.name.toLowerCase().includes("chess") ? 1000 : null;
          return (
            <section key={h.id} className="card">
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="section-title">
                  {h.name} {h.value_label ?? "value"} (90 days{goal ? `, goal ${goal}` : ""})
                </h2>
                {points.length > 0 && (
                  <span className="text-sm font-bold tabular-nums">
                    {points[points.length - 1].value}
                  </span>
                )}
              </div>
              <LineChart points={points} goal={goal} />
            </section>
          );
        })}

      {/* last-14-day grid */}
      {habits.length > 0 && (
        <section className="card overflow-x-auto">
          <h2 className="section-title mb-2">Last 14 days</h2>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="pr-2 text-left font-normal" style={{ color: "var(--ink-muted)" }}></th>
                {range14(today).map((d) => (
                  <th key={d} className="px-0.5 text-center font-normal" style={{ color: "var(--ink-muted)" }}>
                    {d.slice(8)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => (
                <tr key={h.id}>
                  <td className="whitespace-nowrap pr-2" style={{ color: "var(--ink-secondary)" }}>
                    {h.name}
                  </td>
                  {range14(today).map((d) => {
                    const hit = logs.some((l) => l.habit_id === h.id && l.date === d && l.done);
                    return (
                      <td key={d} className="px-0.5 py-1 text-center">
                        <span
                          className="mx-auto block h-3 w-3 rounded-sm"
                          style={{ background: hit ? "var(--series)" : "var(--hairline)" }}
                          title={`${h.name} ${d}: ${hit ? "done" : "—"}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
}

function range14(today: string): string[] {
  return Array.from({ length: 14 }, (_, i) => addDaysISO(today, i - 13));
}
