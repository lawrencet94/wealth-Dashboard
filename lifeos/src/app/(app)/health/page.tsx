import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addDaysISO, todayISO } from "@/lib/dates";
import LineChart, { type ChartPoint } from "@/components/LineChart";
import MetricForm from "@/components/MetricForm";
import TaskItem from "@/components/TaskItem";
import type { Area, Metric, Task } from "@/lib/types";

export const dynamic = "force-dynamic";

const CHARTS: { type: Metric["type"]; label: string; unit: string }[] = [
  { type: "glucose_avg", label: "7-day glucose average", unit: "mmol/L" },
  { type: "hrv", label: "Morning HRV", unit: "ms" },
  { type: "weight", label: "Weight", unit: "kg" },
];

/** Health — manual/Shortcut metrics with 30/90-day charts + appointment tasks. */
export default async function HealthPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const days = searchParams.range === "90" ? 90 : 30;
  const supabase = createClient();
  const since = addDaysISO(todayISO(), -days);

  const { data: areaData } = await supabase
    .from("areas")
    .select("*")
    .eq("name", "Health")
    .maybeSingle();
  const area = areaData as Area | null;

  const [metricsRes, tasksRes] = await Promise.all([
    supabase
      .from("metrics")
      .select("*")
      .gte("recorded_at", `${since}T00:00:00Z`)
      .order("recorded_at"),
    area
      ? supabase
          .from("tasks")
          .select("*")
          .eq("area_id", area.id)
          .in("status", ["open", "waiting"])
          .order("due_date", { ascending: true, nullsFirst: false })
      : Promise.resolve({ data: [] as Task[] }),
  ]);

  const metrics = (metricsRes.data ?? []) as Metric[];
  const tasks = (tasksRes.data ?? []) as Task[];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Health</h1>
        <MetricForm />
      </div>

      <div className="flex gap-1">
        {[30, 90].map((d) => (
          <Link
            key={d}
            href={`/health?range=${d}`}
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: days === d ? "var(--series)" : "var(--hairline)",
              color: days === d ? "var(--series)" : "var(--ink-secondary)",
            }}
          >
            {d} days
          </Link>
        ))}
      </div>

      {CHARTS.map((chart) => {
        const points: ChartPoint[] = metrics
          .filter((m) => m.type === chart.type)
          .map((m) => ({ date: m.recorded_at.slice(0, 10), value: Number(m.value) }));
        const latest = points[points.length - 1];
        return (
          <section key={chart.type} className="card">
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="section-title">{chart.label}</h2>
              {latest && (
                <span className="text-sm font-bold tabular-nums">
                  {latest.value}
                  <span className="ml-1 font-normal" style={{ color: "var(--ink-muted)" }}>
                    {chart.unit}
                  </span>
                </span>
              )}
            </div>
            <LineChart points={points} unit={chart.unit} />
          </section>
        );
      })}

      <section className="card">
        <h2 className="section-title mb-1">Appointments & follow-ups</h2>
        {tasks.length === 0 ? (
          <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            No open health tasks. Capture appointments with lead-time reminders.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {tasks.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
