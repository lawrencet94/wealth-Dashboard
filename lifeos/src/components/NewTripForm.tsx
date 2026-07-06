"use client";

import { useState, useTransition } from "react";
import { createTrip } from "@/app/actions";

export default function NewTripForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");

  if (!open) {
    return (
      <button className="btn text-xs" onClick={() => setOpen(true)}>
        + Trip
      </button>
    );
  }

  return (
    <form
      className="card flex w-full flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        startTransition(async () => {
          await createTrip({ name: name.trim(), destination: destination || null });
          setOpen(false);
          setName("");
          setDestination("");
        });
      }}
    >
      <input className="input flex-1" placeholder="Trip name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <input className="input flex-1" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <button className="btn-primary text-xs" disabled={pending}>
        {pending ? "…" : "Create"}
      </button>
      <button type="button" className="btn text-xs" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}
