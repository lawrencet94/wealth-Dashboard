import { createClient } from "@/lib/supabase/server";
import TaskItem from "@/components/TaskItem";
import NewTaskForm from "@/components/NewTaskForm";
import DecisionCard from "@/components/DecisionCard";
import type { Area, Decision, Project, Task } from "@/lib/types";

export const dynamic = "force-dynamic";

const PROPERTY_AREAS = ["Property", "Home (Anacapri)", "Cars"];

/**
 * Property & Assets — the richest module at launch. Projects (Fitzclarence
 * pipeline, radiator shortlist, Anacapri maintenance) with their open tasks,
 * plus decision records (DB11 vs 911).
 */
export default async function PropertyPage() {
  const supabase = createClient();

  const { data: areasData } = await supabase
    .from("areas")
    .select("*")
    .in("name", PROPERTY_AREAS)
    .order("sort_order");
  const areas = (areasData ?? []) as Area[];
  const areaIds = areas.map((a) => a.id);

  const [projectsRes, tasksRes, decisionsRes, notesRes] = await Promise.all([
    supabase.from("projects").select("*").in("area_id", areaIds).neq("status", "done").order("name"),
    supabase
      .from("tasks")
      .select("*")
      .in("area_id", areaIds)
      .neq("status", "dropped")
      .order("created_at"),
    supabase.from("decisions").select("*").in("area_id", areaIds).order("created_at"),
    supabase.from("notes").select("*").eq("entity_type", "project").order("created_at", { ascending: false }).limit(20),
  ]);

  const projects = (projectsRes.data ?? []) as Project[];
  const tasks = (tasksRes.data ?? []) as Task[];
  const decisions = (decisionsRes.data ?? []) as Decision[];
  const notes = notesRes.data ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Property & Assets</h1>
        <NewTaskForm areas={areas} projects={projects} defaultAreaId={areas[0]?.id} />
      </div>

      {projects.map((project) => {
        const projectTasks = tasks.filter((t) => t.project_id === project.id);
        const projectNotes = notes.filter((n) => n.entity_id === project.id);
        const isPipeline = projectTasks.some((t) => t.title.startsWith("Stage:"));
        return (
          <section key={project.id} className="card space-y-2">
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">{project.name}</h2>
              <span className="text-xs" style={{ color: "var(--ink-muted)" }}>
                {areas.find((a) => a.id === project.area_id)?.name}
              </span>
            </div>
            {project.notes && (
              <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
                {project.notes}
              </p>
            )}
            {isPipeline && <PipelineStrip tasks={projectTasks} />}
            <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
              {projectTasks.filter((t) => t.status !== "done").map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
              {projectTasks.filter((t) => t.status !== "done").length === 0 && (
                <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                  No open tasks.
                </p>
              )}
            </div>
            {projectNotes.length > 0 && (
              <div className="space-y-1 border-t pt-2" style={{ borderColor: "var(--hairline)" }}>
                {projectNotes.slice(0, 3).map((n) => (
                  <p key={n.id} className="text-xs" style={{ color: "var(--ink-secondary)" }}>
                    📝 {n.body}
                  </p>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {decisions.length > 0 && (
        <>
          <h2 className="section-title pt-2">Decisions</h2>
          {decisions.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </>
      )}
    </>
  );
}

/** Compact Offer → Survey → … stage strip derived from "Stage:" tasks. */
function PipelineStrip({ tasks }: { tasks: Task[] }) {
  const stages = tasks
    .filter((t) => t.title.startsWith("Stage:"))
    .map((t) => ({
      label: t.title.replace(/^Stage:\s*/, "").split("—")[0].trim(),
      done: t.status === "done",
    }));
  if (stages.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      {stages.map((s, i) => (
        <span key={i} className="flex items-center gap-1">
          <span
            className="rounded-full border px-2 py-0.5"
            style={{
              borderColor: s.done ? "var(--series)" : "var(--hairline)",
              color: s.done ? "var(--series)" : "var(--ink-muted)",
            }}
          >
            {s.done ? "✓ " : ""}
            {s.label}
          </span>
          {i < stages.length - 1 && <span style={{ color: "var(--ink-muted)" }}>→</span>}
        </span>
      ))}
    </div>
  );
}
