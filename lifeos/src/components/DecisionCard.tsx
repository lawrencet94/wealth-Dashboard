"use client";

import { useTransition } from "react";
import { scoreDecision, decideDecision } from "@/app/actions";
import type { Decision } from "@/lib/types";

/** Weighted-criteria decision record (e.g. DB11 vs 911). Tap a cell to score 1-5. */
export default function DecisionCard({ decision }: { decision: Decision }) {
  const [pending, startTransition] = useTransition();
  const options = decision.options_json ?? [];
  const criteria = decision.criteria_json ?? [];

  const totals = options.map((opt) =>
    criteria.reduce(
      (sum, c) => sum + (c.scores?.[opt] ?? 0) * (c.weight ?? 1),
      0
    )
  );
  const maxTotal = Math.max(...totals, 0);

  return (
    <div className={`card space-y-3 ${pending ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{decision.name}</h3>
        <span
          className="rounded-full border px-2 py-0.5 text-xs"
          style={{ borderColor: "var(--hairline)", color: "var(--ink-muted)" }}
        >
          {decision.status === "decided" ? `✓ ${decision.outcome}` : decision.status}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="section-title pb-1 text-left font-semibold">Criterion (weight)</th>
              {options.map((opt, i) => (
                <th
                  key={opt}
                  className="pb-1 text-right text-xs font-semibold"
                  style={{ color: totals[i] === maxTotal && maxTotal > 0 ? "var(--series)" : "var(--ink-secondary)" }}
                >
                  {opt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, ci) => (
              <tr key={ci} className="border-t" style={{ borderColor: "var(--hairline)" }}>
                <td className="py-1.5 pr-2" style={{ color: "var(--ink-secondary)" }}>
                  {c.criterion} <span style={{ color: "var(--ink-muted)" }}>×{c.weight}</span>
                </td>
                {options.map((opt) => (
                  <td key={opt} className="py-1.5 text-right">
                    <button
                      className="rounded-md border px-2 py-0.5 tabular-nums"
                      style={{ borderColor: "var(--hairline)" }}
                      title="Tap to score 1-5"
                      onClick={() => {
                        const raw = prompt(`Score "${opt}" on "${c.criterion}" (1-5):`, String(c.scores?.[opt] ?? ""));
                        const score = Number(raw);
                        if (raw && !isNaN(score) && score >= 0 && score <= 5) {
                          startTransition(() => scoreDecision(decision.id, ci, opt, score));
                        }
                      }}
                    >
                      {c.scores?.[opt] ?? "–"}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t font-semibold" style={{ borderColor: "var(--hairline)" }}>
              <td className="py-1.5">Weighted total</td>
              {options.map((opt, i) => (
                <td
                  key={opt}
                  className="py-1.5 text-right tabular-nums"
                  style={{ color: totals[i] === maxTotal && maxTotal > 0 ? "var(--series)" : "var(--ink)" }}
                >
                  {totals[i]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {decision.notes && (
        <p className="text-xs" style={{ color: "var(--ink-muted)" }}>
          {decision.notes}
        </p>
      )}

      {decision.status === "open" && (
        <div className="flex gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              className="btn text-xs"
              onClick={() => {
                if (confirm(`Decide: ${opt}?`)) {
                  startTransition(() => decideDecision(decision.id, opt));
                }
              }}
            >
              Decide: {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
