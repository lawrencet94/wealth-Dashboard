"use client";

import { useTransition } from "react";
import { touchContact } from "@/app/actions";
import type { Contact } from "@/lib/types";
import { shortDate, todayISO } from "@/lib/dates";

export default function ContactRow({ contact }: { contact: Contact }) {
  const [pending, startTransition] = useTransition();
  const overdue = !!contact.next_touch_due && contact.next_touch_due <= todayISO();

  return (
    <div className={`flex items-start justify-between gap-3 py-2 ${pending ? "opacity-50" : ""}`}>
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {contact.name}
          {contact.relationship && (
            <span className="ml-1 text-xs font-normal" style={{ color: "var(--ink-muted)" }}>
              · {contact.relationship}
            </span>
          )}
        </p>
        <p className="text-xs" style={{ color: overdue ? "#d03b3b" : "var(--ink-muted)" }}>
          {[
            contact.last_touch ? `last touch ${shortDate(contact.last_touch)}` : "never touched",
            contact.next_touch_due ? `${overdue ? "OVERDUE " : "next "}${shortDate(contact.next_touch_due)}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {contact.context_notes && (
          <p className="mt-0.5 text-xs" style={{ color: "var(--ink-secondary)" }}>
            {contact.context_notes}
          </p>
        )}
      </div>
      <button
        className="btn shrink-0 text-xs"
        onClick={() => {
          const next = prompt("Touched today. Next touch due (YYYY-MM-DD, blank for none):") || null;
          startTransition(() => touchContact(contact.id, next));
        }}
      >
        Touch ✓
      </button>
    </div>
  );
}
