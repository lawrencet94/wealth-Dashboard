import { createClient } from "@/lib/supabase/server";
import TaskItem from "@/components/TaskItem";
import NewTaskForm from "@/components/NewTaskForm";
import type { Area, Project, Task } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Work — personal career items only. DAW/carry issue tracker, AGM follow-ups,
 * reading list. Hard rule: no firm, fund, LP, or deal data ever enters LifeOS.
 */
export default async function WorkPage() {
  const supabase = createClient();

  const { data: areaData } = await supabase
    .from("areas")
    .select("*")
    .eq("name", "Work")
    .maybeSingle();
  const area = areaData as Area | null;

  const [projectsRes, tasksRes] = await Promise.all([
    area
      ? supabase.from("projects").select("*").eq("area_id", area.id).neq("status", "done").order("name")
      : Promise.resolve({ data: [] as Project[] }),
    area
      ? supabase
          .from("tasks")
          .select("*")
          .eq("area_id", area.id)
          .in("status", ["open", "waiting"])
          .order("priority", { ascending: false })
      : Promise.resolve({ data: [] as Task[] }),
  ]);

  const projects = (projectsRes.data ?? []) as Project[];
  const tasks = (tasksRes.data ?? []) as Task[];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Work</h1>
        {area && <NewTaskForm areas={[area]} projects={projects} defaultAreaId={area.id} />}
      </div>
      <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
        Personal career items only — no firm, fund, LP, or deal data.
      </p>

      {projects.map((project) => {
        const projectTasks = tasks.filter((t) => t.project_id === project.id);
        return (
          <section key={project.id} className="card">
            <h2 className="mb-1 font-semibold">{project.name}</h2>
            {project.notes && (
              <p className="mb-1 text-xs" style={{ color: "var(--ink-muted)" }}>
                {project.notes}
              </p>
            )}
            {projectTasks.length === 0 ? (
              <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
                No open tasks.
              </p>
            ) : (
              <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                {projectTasks.map((t) => (
                  <TaskItem key={t.id} task={t} />
                ))}
              </div>
            )}
          </section>
        );
      })}

      {(() => {
        const loose = tasks.filter((t) => !t.project_id);
        if (loose.length === 0) return null;
        return (
          <section className="card">
            <h2 className="section-title mb-1">Other work items</h2>
            <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
              {loose.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </div>
          </section>
        );
      })()}
    </>
  );
}
