"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { quickCapture } from "@/app/actions";

/**
 * Global quick-add bar. Opens with ⌘K / Ctrl+K (or the + button in the nav),
 * pushes text through the same capture pipeline as voice.
 */
export default function QuickAdd() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openBar = useCallback(() => {
    setOpen(true);
    setResult(null);
    setTimeout(() => inputRef.current?.focus(), 30);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openBar();
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openBar]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      const res = await quickCapture(text);
      setResult(res.summary);
      setText("");
      setTimeout(() => {
        setOpen(false);
        setResult(null);
      }, 1400);
    } catch {
      setResult("Capture failed — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        aria-label="Quick add"
        className="btn-primary h-8 w-8 rounded-full !p-0 text-lg leading-none"
        onClick={openBar}
      >
        +
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-lg space-y-2 shadow-xl"
          >
            <input
              ref={inputRef}
              className="input text-base"
              placeholder='Capture anything… e.g. "Chase solicitor Wednesday morning"'
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={busy}
            />
            <div className="flex items-center justify-between text-xs" style={{ color: "var(--ink-muted)" }}>
              <span>{busy ? "Routing…" : result ?? "Enter to capture · Esc to close"}</span>
              <span>⌘K</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
