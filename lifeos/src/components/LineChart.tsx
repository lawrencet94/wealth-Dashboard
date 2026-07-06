"use client";

import { useMemo, useRef, useState } from "react";

export interface ChartPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

/**
 * Single-series line chart (SVG) with a crosshair + tooltip hover layer.
 * Palette follows the validated reference instance: series blue on the
 * light/dark surface, hairline grid, muted axis labels. Single series →
 * the card title names it, so no legend box is needed.
 */
export default function LineChart({
  points,
  unit,
  height = 120,
  goal,
}: {
  points: ChartPoint[];
  unit?: string | null;
  height?: number;
  goal?: number | null;
}) {
  const width = 320;
  const pad = { top: 10, right: 8, bottom: 18, left: 34 };
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const { path, xs, ys, min, max } = useMemo(() => {
    if (points.length === 0)
      return { path: "", xs: [] as number[], ys: [] as number[], min: 0, max: 1 };
    const values = points.map((p) => p.value);
    let lo = Math.min(...values, goal ?? Infinity);
    let hi = Math.max(...values, goal ?? -Infinity);
    if (lo === hi) {
      lo -= 1;
      hi += 1;
    }
    const spanPad = (hi - lo) * 0.1;
    lo -= spanPad;
    hi += spanPad;
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const xs = points.map((_, i) =>
      points.length === 1 ? pad.left + innerW / 2 : pad.left + (i / (points.length - 1)) * innerW
    );
    const ys = points.map(
      (p) => pad.top + innerH - ((p.value - lo) / (hi - lo)) * innerH
    );
    const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
    return { path, xs, ys, min: lo, max: hi };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, height, goal]);

  if (points.length === 0) {
    return (
      <p className="py-6 text-center text-xs" style={{ color: "var(--ink-muted)" }}>
        No data yet
      </p>
    );
  }

  const innerH = height - pad.top - pad.bottom;
  const yFor = (v: number) => pad.top + innerH - ((v - min) / (max - min)) * innerH;

  function onMove(e: React.PointerEvent) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * width;
    let best = 0;
    let bestDist = Infinity;
    xs.forEach((x, i) => {
      const d = Math.abs(x - px);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setHoverIdx(best);
  }

  const hover = hoverIdx != null ? points[hoverIdx] : null;
  const gridLines = [min + (max - min) * 0.25, min + (max - min) * 0.75];

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full touch-none select-none"
        role="img"
        aria-label={`Line chart, latest ${points[points.length - 1].value}${unit ? " " + unit : ""}`}
        onPointerMove={onMove}
        onPointerLeave={() => setHoverIdx(null)}
      >
        {/* hairline grid */}
        {gridLines.map((v) => (
          <line
            key={v}
            x1={pad.left}
            x2={width - pad.right}
            y1={yFor(v)}
            y2={yFor(v)}
            stroke="var(--hairline)"
            strokeWidth="1"
          />
        ))}
        {/* y labels */}
        {[min, max].map((v, i) => (
          <text
            key={i}
            x={pad.left - 6}
            y={yFor(v) + (i === 0 ? 0 : 8)}
            textAnchor="end"
            fontSize="9"
            fill="var(--ink-muted)"
          >
            {formatNum(v)}
          </text>
        ))}
        {/* x labels: first + last date */}
        <text x={pad.left} y={height - 4} fontSize="9" fill="var(--ink-muted)">
          {points[0].date.slice(5)}
        </text>
        <text x={width - pad.right} y={height - 4} textAnchor="end" fontSize="9" fill="var(--ink-muted)">
          {points[points.length - 1].date.slice(5)}
        </text>
        {/* goal line */}
        {goal != null && (
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={yFor(goal)}
            y2={yFor(goal)}
            stroke="var(--ink-muted)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}
        {/* series */}
        <path d={path} fill="none" stroke="var(--series)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* crosshair + hover marker */}
        {hoverIdx != null && (
          <>
            <line
              x1={xs[hoverIdx]}
              x2={xs[hoverIdx]}
              y1={pad.top}
              y2={height - pad.bottom}
              stroke="var(--ink-muted)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx={xs[hoverIdx]}
              cy={ys[hoverIdx]}
              r="4"
              fill="var(--series)"
              stroke="var(--surface)"
              strokeWidth="2"
            />
          </>
        )}
        {/* latest point marker */}
        {hoverIdx == null && (
          <circle
            cx={xs[xs.length - 1]}
            cy={ys[ys.length - 1]}
            r="3.5"
            fill="var(--series)"
            stroke="var(--surface)"
            strokeWidth="2"
          />
        )}
      </svg>
      {hover && (
        <div
          className="pointer-events-none absolute -top-1 rounded-md border px-2 py-1 text-xs shadow-sm"
          style={{
            left: `${(xs[hoverIdx!] / width) * 100}%`,
            transform: xs[hoverIdx!] > width * 0.7 ? "translateX(-105%)" : "translateX(8px)",
            background: "var(--surface)",
            borderColor: "var(--hairline)",
            color: "var(--ink)",
          }}
        >
          <span className="font-semibold tabular-nums">
            {formatNum(hover.value)}
            {unit ? ` ${unit}` : ""}
          </span>{" "}
          <span style={{ color: "var(--ink-muted)" }}>{hover.date.slice(5)}</span>
        </div>
      )}
    </div>
  );
}

function formatNum(v: number): string {
  return Math.abs(v) >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, "");
}
