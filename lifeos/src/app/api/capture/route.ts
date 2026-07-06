import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, lifeosUserId } from "@/lib/supabase/admin";
import { parseCapture } from "@/lib/capture/parser";
import { loadParserContext } from "@/lib/capture/context";
import { routeCapture } from "@/lib/capture/router";
import { sendPush } from "@/lib/pushover";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/capture — the heart of the system.
 * Body: { text: string, timestamp?: string, source?: "shortcut" | "web" | "email" }
 * Auth: Authorization: Bearer <CAPTURE_TOKEN>
 *
 * Stores the raw capture first (nothing is ever lost), then classifies with
 * Claude Haiku and routes. Confidence >= 0.8 routes directly with a Pushover
 * confirmation; anything else lands in the Inbox.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!process.env.CAPTURE_TOKEN || token !== process.env.CAPTURE_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { text?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const text = (body.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const source = ["shortcut", "web", "email"].includes(body.source ?? "")
    ? (body.source as string)
    : "shortcut";

  const db = createAdminClient();
  const userId = lifeosUserId();

  // 1. Store the raw capture FIRST — the trust guarantee.
  const { data: capture, error: insertError } = await db
    .from("captures")
    .insert({ user_id: userId, raw_text: text, source, status: "inbox" })
    .select("id")
    .single();
  if (insertError || !capture) {
    console.error("[capture] failed to store raw capture:", insertError);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }

  // 2. Parse + route. Failures leave the capture safely in the Inbox.
  try {
    const ctx = await loadParserContext(db, userId);
    const parsed = await parseCapture(text, ctx);
    const result = await routeCapture(db, userId, parsed);

    await db
      .from("captures")
      .update({
        parsed_json: parsed,
        confidence: parsed.confidence,
        status: result.routed ? "routed" : "inbox",
        routed_to_table: result.table,
        routed_to_id: result.id,
      })
      .eq("id", capture.id);

    await sendPush({
      title: result.routed ? "LifeOS ✓" : "LifeOS → Inbox",
      message: result.routed ? result.summary : `Needs sorting: "${text}"`,
      priority: result.routed ? -1 : 0,
    });

    return NextResponse.json({
      id: capture.id,
      routed: result.routed,
      summary: result.summary,
      confidence: parsed.confidence,
    });
  } catch (err) {
    console.error("[capture] parse/route failed, capture kept in inbox:", err);
    await sendPush({
      title: "LifeOS → Inbox",
      message: `Parser failed, saved raw: "${text}"`,
    });
    return NextResponse.json({ id: capture.id, routed: false, summary: "Sent to Inbox" });
  }
}
