"use client";

import { useState, useTransition } from "react";
import { addMetric } from "@/app/actions";

const TYPES = [
  { value: "glucose_avg", label: "Glucose 7-day avg", unit: "mmol/L" },
  { value: "hrv", label: "Morning HRV", unit: "ms" },
  { value: "weight", label: "Weight", unit: "kg" },
  { value: "sleep", label: "Sleep", unit: "h" },
];

export default function MetricForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [type, setType] = useState(TYPES[0].value);
  const [value, setValue] = useState("");

  if (!open) {
    return (
      <button className="btn text-xs" onClick={() => setOpen(true)}>
        + Log metric
      </button>
    );
  }
  const unit = TYPES.find((t) => t.value === type)?.unit;

  return (
    <form
      className="card flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const v = Number(value);
        if (isNaN(v)) return;
        startTransition(async () => {
          await addMetric({ type, value: v, unit });
          setOpen(false);
          setValue("");
        });
      }}
    >
      <select className="input !w-auto" value={type} onChange={(e) => setType(e.target.value)}>
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
      <input
        className="input !w-28"
        type="number"
        step="any"
        placeholder={unit}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button className="btn-primary text-xs" disabled={pending}>
        {pending ? "…" : "Log"}
      </button>
      <button type="button" className="btn text-xs" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </form>
  );
}
