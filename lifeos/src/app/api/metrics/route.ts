import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, lifeosUserId } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const METRIC_TYPES = ["glucose_avg", "hrv", "weight", "sleep"];

/**
 * POST /api/metrics — direct metric logging from Shortcuts (HealthKit → POST).
 * Body: { type: "hrv" | "glucose_avg" | "weight" | "sleep", value: number, unit?: string, recorded_at?: ISO }
 * Auth: Authorization: Bearer <CAPTURE_TOKEN>
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "");
  if (!process.env.CAPTURE_TOKEN || token !== process.env.CAPTURE_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { type?: string; value?: number; unit?: string; recorded_at?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body.type || !METRIC_TYPES.includes(body.type) || typeof body.value !== "number") {
    return NextResponse.json(
      { error: `type must be one of ${METRIC_TYPES.join(", ")} and value a number` },
      { status: 400 }
    );
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("metrics")
    .insert({
      user_id: lifeosUserId(),
      type: body.type,
      value: body.value,
      unit: body.unit ?? null,
      recorded_at: body.recorded_at ?? new Date().toISOString(),
      source: "shortcut",
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "insert failed" }, { status: 500 });
  }
  return NextResponse.json({ id: data.id });
}
