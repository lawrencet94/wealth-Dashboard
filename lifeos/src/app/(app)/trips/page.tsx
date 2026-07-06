import { createClient } from "@/lib/supabase/server";
import TripCard from "@/components/TripCard";
import NewTripForm from "@/components/NewTripForm";
import type { Trip } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Trips — pipeline per trip (Idea → Booked → Packing → Done) with checklists. */
export default async function TripsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });
  const trips = (data ?? []) as Trip[];

  const active = trips.filter((t) => t.status !== "done");
  const done = trips.filter((t) => t.status === "done");

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Trips</h1>
        <NewTripForm />
      </div>

      {active.length === 0 && done.length === 0 && (
        <p className="card py-8 text-center text-sm" style={{ color: "var(--ink-muted)" }}>
          No trips yet.
        </p>
      )}

      {active.map((t) => (
        <TripCard key={t.id} trip={t} />
      ))}

      {done.length > 0 && (
        <>
          <h2 className="section-title pt-2">Archive</h2>
          {done.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </>
      )}
    </>
  );
}
