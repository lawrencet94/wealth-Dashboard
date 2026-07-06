import { addDaysISO } from "./dates";

/**
 * Minimal RRULE support for recurring tasks. Handles the subset LifeOS uses:
 *   FREQ=DAILY|WEEKLY|MONTHLY|YEARLY
 *   INTERVAL=n
 *   BYDAY=MO,TU,... (weekly)
 *   BYMONTHDAY=n   (monthly/yearly)
 *   BYMONTH=n      (yearly)
 */
const WEEKDAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

interface Rule {
  freq: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  interval: number;
  byday: number[]; // JS getUTCDay numbers
  bymonthday: number | null;
  bymonth: number | null;
}

export function parseRule(rrule: string): Rule | null {
  const parts: Record<string, string> = {};
  for (const kv of rrule.replace(/^RRULE:/, "").split(";")) {
    const [k, v] = kv.split("=");
    if (k && v) parts[k.toUpperCase()] = v.toUpperCase();
  }
  const freq = parts.FREQ as Rule["freq"] | undefined;
  if (!freq || !["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(freq)) return null;
  return {
    freq,
    interval: Math.max(1, parseInt(parts.INTERVAL || "1", 10) || 1),
    byday: (parts.BYDAY || "")
      .split(",")
      .map((d) => WEEKDAYS.indexOf(d))
      .filter((i) => i >= 0),
    bymonthday: parts.BYMONTHDAY ? parseInt(parts.BYMONTHDAY, 10) : null,
    bymonth: parts.BYMONTH ? parseInt(parts.BYMONTH, 10) : null,
  };
}

/**
 * Next occurrence strictly after `afterISO` (YYYY-MM-DD).
 * Returns null if the rule can't be parsed.
 */
export function nextOccurrence(rrule: string, afterISO: string): string | null {
  const rule = parseRule(rrule);
  if (!rule) return null;

  if (rule.freq === "DAILY") return addDaysISO(afterISO, rule.interval);

  if (rule.freq === "WEEKLY") {
    if (rule.byday.length === 0) return addDaysISO(afterISO, 7 * rule.interval);
    // Walk forward day by day (bounded) until we hit a listed weekday.
    let d = afterISO;
    for (let i = 0; i < 7 * rule.interval + 7; i++) {
      d = addDaysISO(d, 1);
      const wd = new Date(d + "T12:00:00Z").getUTCDay();
      if (rule.byday.includes(wd)) return d;
    }
    return null;
  }

  const base = new Date(afterISO + "T12:00:00Z");
  if (rule.freq === "MONTHLY") {
    const day = rule.bymonthday ?? base.getUTCDate();
    const d = new Date(base);
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + rule.interval);
    d.setUTCDate(Math.min(day, daysInMonth(d.getUTCFullYear(), d.getUTCMonth())));
    return d.toISOString().slice(0, 10);
  }

  // YEARLY
  const month = (rule.bymonth ?? base.getUTCMonth() + 1) - 1;
  const day = rule.bymonthday ?? base.getUTCDate();
  const d = new Date(base);
  d.setUTCDate(1);
  d.setUTCFullYear(d.getUTCFullYear() + rule.interval, month, 1);
  d.setUTCDate(Math.min(day, daysInMonth(d.getUTCFullYear(), month)));
  return d.toISOString().slice(0, 10);
}

function daysInMonth(year: number, monthIdx: number): number {
  return new Date(Date.UTC(year, monthIdx + 1, 0)).getUTCDate();
}
