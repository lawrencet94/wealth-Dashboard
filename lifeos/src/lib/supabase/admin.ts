import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for API routes that authenticate with bearer tokens
 * (capture, metrics, cron) instead of a user session. Bypasses RLS, so every
 * insert sets user_id explicitly via `lifeosUserId()`.
 */
export function createAdminClient(): SupabaseClient {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/** The single user's UUID (auth.users.id), from LIFEOS_USER_ID. */
export function lifeosUserId(): string {
  const id = process.env.LIFEOS_USER_ID;
  if (!id) throw new Error("LIFEOS_USER_ID is not set");
  return id;
}
