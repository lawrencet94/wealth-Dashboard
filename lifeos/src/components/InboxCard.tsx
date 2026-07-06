"use client";

import { useState, useTransition } from "react";
import {
  routeInboxAsTask,
  routeInboxAsNote,
  dismissCapture,
  acceptSuggestion,
} from "@/app/actions";
import type { Area, Capture, Project } from "@/lib/types";

/**
 * One unsorted capture: shows the raw text + the parser's low-confidence
 * suggestion, with one-tap routing to task/note, accept, or dismiss.
 */
export default function InboxCard({
  capture,
  areas,
  projects,
}: {
  capture: Capture;
  areas: Area[];
  projects: Project[];
}) {
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "task" | "note">("idle");
  const parsed = capture.parsed_json;

  const [title, setTitle] = useState(parsed?.title ?? capture.raw_text);
  const [areaId, setAreaId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>(parsed?.due_date ?? "");

  const suggestionUsable =
    parsed && parsed.type !== "unknown" && parsed.type !== undefined;

  return (
    <div className={`card space-y-3 ${pending ? "opacity-50" : ""}`}>
      <div>
        <p className="text-sm font-medium">“{capture.raw_text}”</p>
        <p className="mt-1 text-xs" style={{ color: "var(--ink-muted)" }}>
          via {capture.source} · {new Date(capture.created_at).toLocaleString("en-GB")}
          {parsed && (
            <>
              {" · "}parser: {parsed.type}
              {parsed.confidence != null && ` (${Math.round(parsed.confidence * 100)}%)`}
            </>
          )}
        </p>
      </div>

      {mode === "idle" && (
        <div className="flex flex-wrap gap-2">
          {suggestionUsable && (
            <button
              className="btn-primary text-xs"
              onClick={() => startTransition(async () => void (await acceptSuggestion(capture.id)))}
            >
              Accept: {parsed!.type}
              {parsed!.project_name ? ` → ${parsed!.project_name}` : parsed!.area_name ? ` → ${parsed!.area_name}` : ""}
            </button>
          )}
          <button className="btn text-xs" onClick={() => setMode("task")}>
            → Task
          </button>
          <button className="btn text-xs" onClick={() => setMode("note")}>
            → Note
          </button>
          <button
            className="btn text-xs"
            onClick={() => startTransition(() => dismissCapture(capture.id))}
          >
            Dismiss
          </button>
        </div>
      )}

      {mode !== "idle" && (
        <div className="space-y-2">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <select className="input !w-auto flex-1" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
              <option value="">Area…</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.icon ? `${a.icon} ` : ""}{a.name}
                </option>
              ))}
            </select>
            {mode === "task" && (
              <>
                <select
                  className="input !w-auto flex-1"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">Project…</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="input !w-auto"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="btn-primary text-xs"
              onClick={() =>
                startTransition(async () => {
                  if (mode === "task") {
                    await routeInboxAsTask(capture.id, {
                      title,
                      areaId: areaId || null,
                      projectId: projectId || null,
                      dueDate: dueDate || null,
                    });
                  } else {
                    await routeInboxAsNote(capture.id, title, areaId || null);
                  }
                })
              }
            >
              Save {mode}
            </button>
            <button className="btn text-xs" onClick={() => setMode("idle")}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
