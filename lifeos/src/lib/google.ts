import { todayISO } from "./dates";

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string; // ISO datetime or date
  allDay: boolean;
}

/**
 * Read today's Google Calendar events via a stored OAuth refresh token
 * (reusing the credentials from the prior assistant project). Returns [] when
 * not configured or on any error — the Today view degrades gracefully.
 */
export async function getTodayEvents(limit = 3): Promise<CalendarEvent[]> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return [];

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    });
    if (!tokenRes.ok) return [];
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const today = todayISO();
    const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || "primary");
    const params = new URLSearchParams({
      timeMin: `${today}T00:00:00Z`,
      timeMax: `${today}T23:59:59Z`,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: String(limit),
    });
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`,
      { headers: { Authorization: `Bearer ${access_token}` }, cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      items?: {
        id: string;
        summary?: string;
        start?: { dateTime?: string; date?: string };
      }[];
    };
    return (json.items ?? []).map((e) => ({
      id: e.id,
      summary: e.summary ?? "(untitled)",
      start: e.start?.dateTime ?? e.start?.date ?? "",
      allDay: !e.start?.dateTime,
    }));
  } catch (err) {
    console.error("[google] calendar fetch failed:", err);
    return [];
  }
}
