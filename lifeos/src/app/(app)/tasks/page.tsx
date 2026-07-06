import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { todayISO, addDaysISO } from "@/lib/dates";
import TaskItem from "@/components/TaskItem";
import NewTaskForm from "@/components/NewTaskForm";
import type { Area, Project, Task } from "@/lib/types";

export const dynamic = "force-dynamic";

const VIEWS = ["today", "upcoming", "by-area", "by-project", "waiting", "done"] as const;
type View = (typeof VIEWS)[number];

type TaskRow = Task & {
  projects: { name: string } | null;
  areas: { name: string } | null;
};

export default async function TasksPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const view: View = VIEWS.includes(searchParams.view as View)
    ? (searchParams.view as View)
    : "today";
  const supabase = createClient();
  const today = todayISO();

  const [areasRes, projectsRes] = await Promise.all([
    supabase.from("areas").select("*").order("sort_order"),
    supabase.from("projects").select("*").neq("status", "done").order("name"),
  ]);
  const areas = (areasRes.data ?? []) as Area[];
  const projects = (projectsRes.data ?? []) as Project[];

  let query = supabase
    .from("tasks")
    .select("*, projects(name), areas(name)")
    .order("priority", { ascending: false })
    .order("due_date", { ascending: true, nullsFirst: false });

  switch (view) {
    case "today":
      query = query.eq("status", "open").lte("due_date", today);
      break;
    case "upcoming":
      query = query
        .eq("status", "open")
        .gt("due_date", today)
        .lte("due_date", addDaysISO(today, 30));
      break;
    case "waiting":
      query = query.eq("status", "waiting");
      break;
    case "done":
      query = query.eq("status", "done").order("completed_at", { ascending: false }).limit(50);
      break;
    default:
      query = query.in("status", ["open", "waiting"]);
  }

  const { data } = await query;
  const tasks = (data ?? []) as TaskRow[];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Tasks</h1>
        <NewTaskForm areas={areas} projects={projects} />
      </div>

      <nav className="flex gap-1 overflow-x-auto">
        {VIEWS.map((v) => (
          <Link
            key={v}
            href={`/tasks?view=${v}`}
            className="whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: v === view ? "var(--series)" : "var(--hairline)",
              color: v === view ? "var(--series)" : "var(--ink-secondary)",
            }}
          >
            {v.replace("-", " ")}
          </Link>
        ))}
      </nav>

      {view === "by-area" && <GroupedList tasks={tasks} groups={areas.map((a) => ({ id: a.id, label: `${a.icon ?? ""} ${a.name}`.trim() }))} keyOf={(t) => t.area_id} />}
      {view === "by-project" && <GroupedList tasks={tasks} groups={projects.map((p) => ({ id: p.id, label: p.name }))} keyOf={(t) => t.project_id} />}
      {view !== "by-area" && view !== "by-project" && (
        <section className="card">
          {tasks.length === 0 ? (
            <p className="py-4 text-center text-sm" style={{ color: "var(--ink-muted)" }}>
              Nothing here.
            </p>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
              {tasks.map((t) => (
                <TaskItem key={t.id} task={t} context={t.projects?.name ?? t.areas?.name} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}

function GroupedList({
  tasks,
  groups,
  keyOf,
}: {
  tasks: TaskRow[];
  groups: { id: string; label: string }[];
  keyOf: (t: TaskRow) => string | null;
}) {
  const ungrouped = tasks.filter((t) => !keyOf(t) || !groups.some((g) => g.id === keyOf(t)));
  return (
    <div className="space-y-3">
      {groups.map((g) => {
        const items = tasks.filter((t) => keyOf(t) === g.id);
        if (items.length === 0) return null;
        return (
          <section key={g.id} className="card">
            <h2 className="section-title mb-1">{g.label}</h2>
            <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
              {items.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </div>
          </section>
        );
      })}
      {ungrouped.length > 0 && (
        <section className="card">
          <h2 className="section-title mb-1">No group</h2>
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {ungrouped.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
