"use client";

import { useState, useTransition } from "react";
import { addWealthSnapshot } from "@/app/actions";

export default function WealthSnapshotForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [netWorth, setNetWorth] = useState("");
  const [progress, setProgress] = useState("");
  const [spend, setSpend] = useState("");

  if (!open) {
    return (
      <button className="btn text-xs" onClick={() => setOpen(true)}>
        + Weekly snapshot
      </button>
    );
  }

  return (
    <form
      className="card space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await addWealthSnapshot({
            netWorth: netWorth ? Number(netWorth) : null,
            savingsGoalProgress: progress ? Number(progress) / 100 : null,
            monthSpend: spend ? Number(spend) : null,
          });
          setOpen(false);
          setNetWorth("");
          setProgress("");
          setSpend("");
        });
      }}
    >
      <div className="flex flex-wrap gap-2">
        <input className="input !w-auto flex-1" type="number" step="any" placeholder="Net worth (£)" value={netWorth} onChange={(e) => setNetWorth(e.target.value)} />
        <input className="input !w-auto flex-1" type="number" step="any" placeholder="Goal progress (%)" value={progress} onChange={(e) => setProgress(e.target.value)} />
        <input className="input !w-auto flex-1" type="number" step="any" placeholder="Month spend (£)" value={spend} onChange={(e) => setSpend(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button className="btn-primary text-xs" disabled={pending}>
          {pending ? "Saving…" : "Save snapshot"}
        </button>
        <button type="button" className="btn text-xs" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
