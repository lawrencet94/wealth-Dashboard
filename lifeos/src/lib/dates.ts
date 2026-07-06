const TZ = process.env.LIFEOS_TIMEZONE || "Europe/London";

/** YYYY-MM-DD for "today" in the configured timezone. */
export function todayISO(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** HH:MM for "now" in the configured timezone. */
export function nowHM(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/** Human-friendly date/time string used in the parser prompt and headers. */
export function nowVerbose(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T12:00:00Z").getTime();
  const b = new Date(toISO + "T12:00:00Z").getTime();
  return Math.round((b - a) / 86400000);
}

/** Short label like "Thu 12 Jun" for a YYYY-MM-DD string. */
export function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso + "T12:00:00Z"));
}
