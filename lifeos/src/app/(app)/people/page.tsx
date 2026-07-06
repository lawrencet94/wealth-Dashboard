import { createClient } from "@/lib/supabase/server";
import ContactRow from "@/components/ContactRow";
import NewContactForm from "@/components/NewContactForm";
import { todayISO } from "@/lib/dates";
import type { Contact } from "@/lib/types";

export const dynamic = "force-dynamic";

/** People — lightweight CRM with an "overdue touches" list up top. */
export default async function PeoplePage() {
  const supabase = createClient();
  const { data } = await supabase.from("contacts").select("*").order("name");
  const contacts = (data ?? []) as Contact[];
  const today = todayISO();

  const overdue = contacts.filter((c) => c.next_touch_due && c.next_touch_due <= today);
  const rest = contacts.filter((c) => !overdue.includes(c));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">People</h1>
        <NewContactForm />
      </div>

      {overdue.length > 0 && (
        <section className="card">
          <h2 className="section-title mb-1" style={{ color: "#d03b3b" }}>
            Overdue touches
          </h2>
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {overdue.map((c) => (
              <ContactRow key={c.id} contact={c} />
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="section-title mb-1">Everyone</h2>
        {rest.length === 0 && overdue.length === 0 ? (
          <p className="py-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            No contacts yet.
          </p>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
            {rest.map((c) => (
              <ContactRow key={c.id} contact={c} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
