"use client";

import { useState, useTransition } from "react";
import { addTripItem, setTripStatus, toggleTripItem } from "@/app/actions";
import type { Trip } from "@/lib/types";
import { shortDate } from "@/lib/dates";

const PIPELINE: Trip["status"][] = ["idea", "booked", "packing", "done"];

export default function TripCard({ trip }: { trip: Trip }) {
  const [pending, startTransition] = useTransition();
  const [newItem, setNewItem] = useState("");
  const checklist = Array.isArray(trip.checklist_json) ? trip.checklist_json : [];
  const doneCount = checklist.filter((i) => i.done).length;

  return (
    <div className={`card space-y-3 ${pending ? "opacity-50" : ""}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="font-semibold">{trip.name}</h3>
        <span className="text-xs" style={{ color: "var(--ink-muted)" }}>
          {trip.destination}
          {trip.start_date && ` · ${shortDate(trip.start_date)}`}
          {trip.end_date && `–${shortDate(trip.end_date)}`}
        </span>
      </div>

      {/* Idea → Booked → Packing → Done pipeline */}
      <div className="flex items-center gap-1 text-xs">
        {PIPELINE.map((stage, i) => {
          const reached = PIPELINE.indexOf(trip.status) >= i;
          return (
            <span key={stage} className="flex items-center gap-1">
              <button
                className="rounded-full border px-2 py-0.5 capitalize"
                style={{
                  borderColor: reached ? "var(--series)" : "var(--hairline)",
                  color: reached ? "var(--series)" : "var(--ink-muted)",
                  fontWeight: trip.status === stage ? 700 : 400,
                }}
                onClick={() => startTransition(() => setTripStatus(trip.id, stage))}
              >
                {stage}
              </button>
              {i < PIPELINE.length - 1 && <span style={{ color: "var(--ink-muted)" }}>→</span>}
            </span>
          );
        })}
      </div>

      <div>
        <p className="section-title mb-1">
          Checklist {checklist.length > 0 && `(${doneCount}/${checklist.length})`}
        </p>
        <ul className="space-y-1">
          {checklist.map((item, i) => (
            <li key={i}>
              <button
                className="flex w-full items-center gap-2 text-left text-sm"
                onClick={() => startTransition(() => toggleTripItem(trip.id, i))}
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] text-white"
                  style={{
                    borderColor: item.done ? "var(--series)" : "var(--hairline)",
                    background: item.done ? "var(--series)" : "transparent",
                  }}
                >
                  {item.done ? "✓" : ""}
                </span>
                <span
                  className={item.done ? "line-through" : ""}
                  style={{ color: item.done ? "var(--ink-muted)" : "var(--ink)" }}
                >
                  {item.item}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!newItem.trim()) return;
            startTransition(async () => {
              await addTripItem(trip.id, newItem.trim());
              setNewItem("");
            });
          }}
        >
          <input
            className="input flex-1 !py-1 text-xs"
            placeholder="Add checklist item…"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="btn text-xs">Add</button>
        </form>
      </div>

      {trip.notes && (
        <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
          {trip.notes}
        </p>
      )}
    </div>
  );
}
