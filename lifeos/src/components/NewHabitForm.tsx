"use client";

import { useState, useTransition } from "react";
import { createHabit } from "@/app/actions";

export default function NewHabitForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [notifyTime, setNotifyTime] = useState("");
  const [trackValue, setTrackValue] = useState(false);
  const [valueLabel, setValueLabel] = useState("");

  if (!open) {
    return (
      <button className="btn text-xs" onClick={() => setOpen(true)}>
        + Habit
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
          await createHabit({
            name: name.trim(),
            notifyTime: notifyTime || null,
            trackValue,
            valueLabel: trackValue ? valueLabel || null : null,
          });
          setOpen(false);
          setName("");
          setNotifyTime("");
          setTrackValue(false);
          setValueLabel("");
        });
      }}
    >
      <input className="input" placeholder="Habit name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "var(--ink-secondary)" }}>
        <label className="flex items-center gap-1">
          Nudge at
          <input type="time" className="input !w-auto !py-1" value={notifyTime} onChange={(e) => setNotifyTime(e.target.value)} />
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={trackValue} onChange={(e) => setTrackValue(e.target.checked)} />
          track a number
        </label>
        {trackValue && (
          <input
            className="input !w-28 !py-1"
            placeholder="label (rating)"
            value={valueLabel}
            onChange={(e) => setValueLabel(e.target.value)}
          />
        )}
      </div>
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
