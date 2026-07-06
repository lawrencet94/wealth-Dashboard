import { createClient } from "@/lib/supabase/server";
import TaskItem from "@/components/TaskItem";
import NewTaskForm from "@/components/NewTaskForm";
import WealthSnapshotForm from "@/components/WealthSnapshotForm";
import type { Area, Project, Task, WealthSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Wealth — thin by design. Wealth Garden is the system of record; this screen
 * shows the latest manual snapshot plus renewal/admin tasks (ISA deadlines,
 * insurance renewals).
 */
export default async function WealthPage() {
  const supabase = createClient();

  const { data: areaData } = await supabase
    .from("areas")
    .select("*")
    .eq("name", "Wealth")
    .maybeSingle();
  const area = areaData as Area | null;

  const [snapshotsRes, tasksRes, projectsRes] = await Promise.all([
    supabase
      .from("wealth_snapshots")
      .select("*")
      .order("recorded_at", { ascending: false })
      .limit(8),
    area
      ? supabase
          .from("tasks")
          .select("*")
          .eq("area_id", area.id)
          .in("status", ["open", "waiting"])
          .order("due_date", { ascending: true, nullsFirst: false })
      : Promise.resolve({ data: [] as Task[] }),
    supabase.from("projects").select("*").eq("status", "active").order("name"),
  ]);

  const snapshots = (snapshotsRes.data ?? []) as WealthSnapshot[];
  const latest = snapshots[0];
  const tasks = (tasksRes.data ?? []) as Task[];
  const projects = (projectsRes.data ?? []) as Project[];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Wealth</h1>
        <WealthSnapshotForm />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Net worth" value={latest?.net_worth != null ? gbp(latest.net_worth) : "—"} />
        <StatTile
          label="Savings goal"
          value={latest?.savings_goal_progress != null ? `${Math.round(latest.savings_goal_progress * 100)}%` : "—"}
        />
        <StatTile label="Month spend" value={latest?.month_spend != null ? gbp(latest.month_spend) : "—"} />
      </div>
      {latest && (
        <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
          Snapshot from {latest.recorded_at} · Wealth Garden remains the system of record.
        </p>
      )}

      <section className="card">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="section-title">Renewals & admin</h2>
          {area && <NewTaskForm areas={[area]} projects={projects} defaultAreaId={area.id} />}
        </div>
        {tasks.length === 0 ? (
          <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            No renewal or admin tasks. Add ISA deadlines and insurance renewals here.
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

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="card !p-3">
      <p className="section-title">{label}</p>
      <p className="mt-1 truncate text-lg font-bold">{value}</p>
    </div>
  );
}

function gbp(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}
