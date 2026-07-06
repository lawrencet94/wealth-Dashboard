import Anthropic from "@anthropic-ai/sdk";
import type { ParsedCapture } from "../types";
import { nowVerbose, todayISO } from "../dates";

/**
 * Classify a raw capture with Claude Haiku 4.5 (per the LifeOS spec: cheap,
 * fast). Structured outputs guarantee the response matches ParsedCapture.
 */

const CAPTURE_SCHEMA = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["task", "note", "contact_touch", "metric", "habit_log", "trip_item", "unknown"],
      description: "What kind of item this capture is.",
    },
    confidence: {
      type: "number",
      description: "0-1 confidence that the classification AND field extraction are correct.",
    },
    title: {
      type: "string",
      description: "Cleaned-up main text: the task title, note body, or item description.",
    },
    area_name: { type: ["string", "null"], description: "Exact area name from the provided list, or null." },
    project_name: { type: ["string", "null"], description: "Exact project name from the provided list, or null. Never invent projects." },
    due_date: { type: ["string", "null"], description: "YYYY-MM-DD, resolved against the current date, or null." },
    due_time: { type: ["string", "null"], description: "HH:MM 24h. 'Morning'=09:00, 'afternoon'=14:00, 'evening'=19:00. Null if unstated." },
    priority: { type: ["integer", "null"], description: "0-3 where 3 is urgent. Null unless urgency is expressed." },
    contact_name: { type: ["string", "null"], description: "For contact_touch: exact contact name from the list, or null if unknown." },
    habit_name: { type: ["string", "null"], description: "For habit_log: exact habit name from the list." },
    metric_type: { type: ["string", "null"], description: "For metric captures: one of glucose_avg, hrv, weight, sleep." },
    value: { type: ["number", "null"], description: "Numeric value for metric or habit_log (e.g. chess rating 940)." },
    unit: { type: ["string", "null"], description: "Unit for metrics, e.g. mmol/L, ms, kg." },
    trip_name: { type: ["string", "null"], description: "For trip_item: exact trip name from the list." },
    notes: { type: ["string", "null"], description: "Any extra context that doesn't fit the title." },
  },
  required: [
    "type", "confidence", "title", "area_name", "project_name", "due_date",
    "due_time", "priority", "contact_name", "habit_name", "metric_type",
    "value", "unit", "trip_name", "notes",
  ],
  additionalProperties: false,
} as const;

export interface ParserContext {
  areas: { name: string }[];
  projects: { name: string; area: string | null }[];
  contacts: { name: string }[];
  habits: { name: string }[];
  trips: { name: string }[];
}

function systemPrompt(ctx: ParserContext): string {
  return `You are the capture classifier for LifeOS, a personal operations dashboard.
The user dictates short captures on their phone; you route each one to the right place.

Current date/time (Europe/London): ${nowVerbose()} (today is ${todayISO()}).

Areas (use exact names): ${ctx.areas.map((a) => a.name).join(", ")}
Active projects (use exact names): ${ctx.projects.map((p) => `${p.name}${p.area ? ` [${p.area}]` : ""}`).join("; ") || "none"}
Contacts: ${ctx.contacts.map((c) => c.name).join(", ") || "none"}
Habits: ${ctx.habits.map((h) => h.name).join(", ") || "none"}
Trips: ${ctx.trips.map((t) => t.name).join(", ") || "none"}

Rules:
- "Remind me to X on <day>" is a task with a due_date (resolve relative days forward from today).
- "Log <habit> ..." or "<habit> rating N" is a habit_log; put the number in value.
- Health numbers (glucose, HRV, weight, sleep) are metric captures.
- "Note for/about X: ..." is a note; match the area if one fits.
- Mentions of getting in touch with, seeing, or following up with a person are contact_touch.
- Packing/booking items for a named trip are trip_item.
- Only use area/project/contact/habit/trip names from the lists above. If nothing matches, leave the field null — never invent one.
- Set confidence below 0.8 whenever the routing target is ambiguous, the person/project is not in the lists, or you had to guess. Low confidence sends the capture to the Inbox for manual sorting, which is the safe outcome.
- If the capture is not clearly any of the types, use type "unknown" with low confidence.`;
}

export async function parseCapture(
  rawText: string,
  ctx: ParserContext
): Promise<ParsedCapture> {
  const client = new Anthropic();

  // Structured outputs guarantee a ParsedCapture-shaped JSON response.
  const response = await client.beta.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: systemPrompt(ctx),
    betas: ["structured-outputs-2025-11-13"],
    output_format: {
      type: "json_schema",
      schema: CAPTURE_SCHEMA as unknown as Record<string, unknown>,
    },
    messages: [{ role: "user", content: rawText }],
  });

  if (response.stop_reason === "refusal") {
    return fallbackParse(rawText);
  }
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") return fallbackParse(rawText);

  try {
    const parsed = JSON.parse(text.text) as ParsedCapture;
    parsed.confidence = Math.max(0, Math.min(1, parsed.confidence ?? 0));
    if (!parsed.title) parsed.title = rawText;
    return parsed;
  } catch {
    return fallbackParse(rawText);
  }
}

/** If parsing fails for any reason, the capture must still land in the Inbox — never lost. */
function fallbackParse(rawText: string): ParsedCapture {
  return {
    type: "unknown",
    confidence: 0,
    title: rawText,
    area_name: null,
    project_name: null,
    due_date: null,
    due_time: null,
    priority: null,
    contact_name: null,
    habit_name: null,
    metric_type: null,
    value: null,
    unit: null,
    trip_name: null,
    notes: null,
  };
}
