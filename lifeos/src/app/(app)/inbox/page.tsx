import { createClient } from "@/lib/supabase/server";
import InboxCard from "@/components/InboxCard";
import type { Area, Capture, Project } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Inbox — unsorted captures. Nothing ever silently vanishes. */
export default async function InboxPage() {
  const supabase = createClient();
  const [capturesRes, areasRes, projectsRes] = await Promise.all([
    supabase
      .from("captures")
      .select("*")
      .eq("status", "inbox")
      .order("created_at", { ascending: false }),
    supabase.from("areas").select("*").order("sort_order"),
    supabase.from("projects").select("*").eq("status", "active").order("name"),
  ]);

  const captures = (capturesRes.data ?? []) as Capture[];
  const areas = (areasRes.data ?? []) as Area[];
  const projects = (projectsRes.data ?? []) as Project[];

  return (
    <>
      <h1 className="text-xl font-bold">
        Inbox{captures.length > 0 && ` (${captures.length})`}
      </h1>
      {captures.length === 0 ? (
        <p className="card py-8 text-center text-sm" style={{ color: "var(--ink-muted)" }}>
          Inbox zero. Everything routed. ✨
        </p>
      ) : (
        <div className="space-y-3">
          {captures.map((c) => (
            <InboxCard key={c.id} capture={c} areas={areas} projects={projects} />
          ))}
        </div>
      )}
    </>
  );
}
