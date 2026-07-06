"use client";

import { useState, useTransition } from "react";
import { createTask } from "@/app/actions";
import type { Area, Project } from "@/lib/types";

export default function NewTaskForm({
  areas,
  projects,
  defaultAreaId,
  defaultProjectId,
}: {
  areas: Area[];
  projects: Project[];
  defaultAreaId?: string;
  defaultProjectId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [areaId, setAreaId] = useState(defaultAreaId ?? "");
  const [projectId, setProjectId] = useState(defaultProjectId ?? "");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState(0);
  const [recurrence, setRecurrence] = useState("");

  if (!open) {
    return (
      <button className="btn text-xs" onClick={() => setOpen(true)}>
        + New task
      </button>
    );
  }

  return (
    <form
      className="card space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        startTransition(async () => {
          await createTask({
            title: title.trim(),
            areaId: areaId || null,
            projectId: projectId || null,
            dueDate: dueDate || null,
            dueTime: dueTime || null,
            priority,
            recurrenceRule: recurrence || null,
          });
          setTitle("");
          setDueDate("");
          setDueTime("");
          setRecurrence("");
          setOpen(false);
        });
      }}
    >
      <input
        className="input"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <div className="flex flex-wrap gap-2">
        <select className="input !w-auto flex-1" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
          <option value="">Area…</option>
          {areas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.icon ? `${a.icon} ` : ""}{a.name}
            </option>
          ))}
        </select>
        <select className="input !w-auto flex-1" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">Project…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <input type="date" className="input !w-auto" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <input type="time" className="input !w-auto" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
        <select
          className="input !w-auto"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          <option value={0}>Priority –</option>
          <option value={1}>!</option>
          <option value={2}>!!</option>
          <option value={3}>!!!</option>
        </select>
        <select className="input !w-auto" value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
          <option value="">No repeat</option>
          <option value="FREQ=DAILY">Daily</option>
          <option value="FREQ=WEEKLY">Weekly</option>
          <option value="FREQ=MONTHLY">Monthly</option>
          <option value="FREQ=YEARLY">Yearly</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary text-xs" disabled={pending}>
          {pending ? "Adding…" : "Add task"}
        </button>
        <button type="button" className="btn text-xs" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
