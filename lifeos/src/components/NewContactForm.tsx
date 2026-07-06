"use client";

import { useState, useTransition } from "react";
import { createContact } from "@/app/actions";

export default function NewContactForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [notes, setNotes] = useState("");
  const [nextDue, setNextDue] = useState("");

  if (!open) {
    return (
      <button className="btn text-xs" onClick={() => setOpen(true)}>
        + Contact
      </button>
    );
  }

  return (
    <form
      className="card w-full space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        startTransition(async () => {
          await createContact({
            name: name.trim(),
            relationship: relationship || null,
            contextNotes: notes || null,
            nextTouchDue: nextDue || null,
          });
          setOpen(false);
          setName("");
          setRelationship("");
          setNotes("");
          setNextDue("");
        });
      }}
    >
      <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
        <input className="input !w-auto" type="date" title="Next touch due" value={nextDue} onChange={(e) => setNextDue(e.target.value)} />
      </div>
      <input className="input" placeholder="Context notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn-primary text-xs" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
        <button type="button" className="btn text-xs" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
