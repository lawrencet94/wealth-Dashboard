import { createClient } from "@/lib/supabase/server";
import { addDaysISO, todayISO } from "@/lib/dates";
import TaskItem from "@/components/TaskItem";
import ContactRow from "@/components/ContactRow";
import type { Contact, Project, Task } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Weekly review — overdue tasks, stale projects (no activity in 14 days),
 * overdue people touches, and the week's completions. Prompted by the Sunday
 * 18:00 Pushover notification.
 */
export default async function ReviewPage() {
  const supabase = createClient();
  const today = todayISO();
  const staleCutoff = addDaysISO(today, -14);
  const weekAgo = addDaysISO(today, -7);

  const [overdueRes, staleRes, touchesRes, doneRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, projects(name), areas(name)")
      .eq("status", "open")
      .lt("due_date", today)
      .order("due_date"),
    supabase
      .from("projects")
      .select("*")
      .eq("status", "active")
      .lt("updated_at", `${staleCutoff}T00:00:00Z`)
      .order("updated_at"),
    supabase
      .from("contacts")
      .select("*")
      .lte("next_touch_due", today)
      .order("next_touch_due"),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("status", "done")
      .gte("completed_at", `${weekAgo}T00:00:00Z`),
  ]);

  const overdue = (overdueRes.data ?? []) as (Task & {
    projects: { name: string } | null;
    areas: { name: string } | null;
  })[];
  const stale = (staleRes.data ?? []) as Project[];
  const touches = (touchesRes.data ?? []) as Contact[];

  return (
    <>
      <h1 className="text-xl font-bold">Weekly review</h1>
      <p className="text-sm" style={{ color: "var(--ink-secondary)" }}>
        ✅ {doneRes.count ?? 0} task{(doneRes.count ?? 0) === 1 ? "" : "s"} completed in the last 7 days.
      </p>

      <section className="card">
        <h2 className="section-title mb-1">Overdue tasks ({overdue.length})</h2>
        {overdue.length === 0 ? (
          <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            Nothing overdue. 🎉
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {overdue.map((t) => (
              <TaskItem key={t.id} task={t} context={t.projects?.name ?? t.areas?.name} />
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="section-title mb-1">Stale projects — no activity in 14 days ({stale.length})</h2>
        {stale.length === 0 ? (
          <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            All projects moving.
          </p>
        ) : (
          <ul className="space-y-1">
            {stale.map((p) => (
              <li key={p.id} className="text-sm">
                <span className="font-medium">{p.name}</span>
                <span style={{ color: "var(--ink-muted)" }}>
                  {" "}
                  — last touched {p.updated_at.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="section-title mb-1">Overdue people touches ({touches.length})</h2>
        {touches.length === 0 ? (
          <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            All caught up on people.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {touches.map((c) => (
              <ContactRow key={c.id} contact={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
