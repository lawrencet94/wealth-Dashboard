"use client";

import { useState, useTransition } from "react";
import {
  completeTask,
  reopenTask,
  snoozeTask,
  setTaskPriority,
  setTaskWaiting,
} from "@/app/actions";
import type { Task } from "@/lib/types";
import { shortDate, todayISO } from "@/lib/dates";

const PRIORITY_LABEL = ["–", "!", "!!", "!!!"];

export default function TaskItem({
  task,
  context,
}: {
  task: Task;
  context?: string | null; // area/project name to display
}) {
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const done = task.status === "done";
  const overdue = !done && !!task.due_date && task.due_date < todayISO();

  return (
    <div className={`flex items-start gap-3 py-2 ${pending ? "opacity-50" : ""}`}>
      <button
        aria-label={done ? "Reopen task" : "Complete task"}
        onClick={() =>
          startTransition(() => (done ? reopenTask(task.id) : completeTask(task.id)))
        }
        className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition-colors"
        style={{
          borderColor: done ? "var(--series)" : "var(--hairline)",
          background: done ? "var(--series)" : "transparent",
        }}
      >
        {done && <span className="block text-center text-[11px] leading-4 text-white">✓</span>}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm ${done ? "line-through" : ""}`} style={{ color: done ? "var(--ink-muted)" : "var(--ink)" }}>
          {task.priority > 0 && (
            <span className="mr-1 font-bold" style={{ color: task.priority >= 3 ? "#d03b3b" : "var(--series)" }}>
              {PRIORITY_LABEL[task.priority]}
            </span>
          )}
          {task.title}
          {task.recurrence_rule && <span className="ml-1" title="Recurring">🔁</span>}
        </p>
        <p className="text-xs" style={{ color: overdue ? "#d03b3b" : "var(--ink-muted)" }}>
          {[
            context,
            task.due_date ? `${overdue ? "overdue · " : ""}${shortDate(task.due_date)}` : null,
            task.due_time ? task.due_time.slice(0, 5) : null,
            task.status === "waiting" && task.waiting_on ? `waiting on ${task.waiting_on}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      {!done && (
        <div className="relative shrink-0">
          <button
            aria-label="Task actions"
            className="btn !px-2 !py-0.5 text-xs"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ⋯
          </button>
          {menuOpen && (
            <div
              className="card absolute right-0 top-7 z-20 w-44 !p-1 shadow-lg"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <MenuBtn onClick={() => startTransition(() => snoozeTask(task.id, "+1d"))}>Snooze +1 day</MenuBtn>
              <MenuBtn onClick={() => startTransition(() => snoozeTask(task.id, "+1w"))}>Snooze +1 week</MenuBtn>
              <MenuBtn
                onClick={() => {
                  const d = prompt("Snooze to date (YYYY-MM-DD):");
                  if (d) startTransition(() => snoozeTask(task.id, d));
                }}
              >
                Snooze to date…
              </MenuBtn>
              <MenuBtn
                onClick={() =>
                  startTransition(() => setTaskPriority(task.id, (task.priority + 1) % 4))
                }
              >
                Priority: {PRIORITY_LABEL[task.priority]} → {PRIORITY_LABEL[(task.priority + 1) % 4]}
              </MenuBtn>
              {task.status === "waiting" ? (
                <MenuBtn onClick={() => startTransition(() => setTaskWaiting(task.id, null))}>
                  Clear waiting
                </MenuBtn>
              ) : (
                <MenuBtn
                  onClick={() => {
                    const who = prompt("Waiting on whom?");
                    if (who) startTransition(() => setTaskWaiting(task.id, who));
                  }}
                >
                  Mark waiting on…
                </MenuBtn>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MenuBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      className="block w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-black/5 dark:hover:bg-white/10"
      style={{ color: "var(--ink-secondary)" }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
