"use client";

import { useTransition } from "react";
import { logHabit, unlogHabit } from "@/app/actions";
import type { Habit } from "@/lib/types";

export default function HabitRow({
  habit,
  doneToday,
  todayValue,
}: {
  habit: Habit;
  doneToday: boolean;
  todayValue: number | null;
}) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    if (doneToday) {
      startTransition(() => unlogHabit(habit.id));
      return;
    }
    if (habit.track_value) {
      const raw = prompt(`${habit.name} — ${habit.value_label ?? "value"} (optional):`);
      const value = raw && !isNaN(Number(raw)) ? Number(raw) : null;
      startTransition(() => logHabit(habit.id, value));
    } else {
      startTransition(() => logHabit(habit.id));
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`flex w-full items-center justify-between gap-2 py-2 text-left ${pending ? "opacity-50" : ""}`}
    >
      <span className="flex items-center gap-2 text-sm">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full border-2 text-[11px] text-white"
          style={{
            borderColor: doneToday ? "#0ca30c" : "var(--hairline)",
            background: doneToday ? "#0ca30c" : "transparent",
          }}
        >
          {doneToday ? "✓" : ""}
        </span>
        {habit.name}
        {todayValue != null && (
          <span className="text-xs" style={{ color: "var(--ink-muted)" }}>
            {todayValue}
          </span>
        )}
      </span>
      <span className="text-xs tabular-nums" style={{ color: "var(--ink-muted)" }}>
        🔥 {habit.streak_current}
        {habit.streak_best > 0 && ` · best ${habit.streak_best}`}
      </span>
    </button>
  );
}
