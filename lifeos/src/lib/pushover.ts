/**
 * Send a Pushover notification. No-ops (with a console warning) when the
 * PUSHOVER_* env vars aren't configured, so the app works without it.
 */
export async function sendPush(opts: {
  title: string;
  message: string;
  url?: string;
  urlTitle?: string;
  priority?: -2 | -1 | 0 | 1;
}): Promise<void> {
  const token = process.env.PUSHOVER_TOKEN;
  const user = process.env.PUSHOVER_USER;
  if (!token || !user) {
    console.warn("[pushover] not configured, skipping:", opts.title);
    return;
  }
  try {
    const body = new URLSearchParams({
      token,
      user,
      title: opts.title,
      message: opts.message,
    });
    if (opts.url) body.set("url", opts.url);
    if (opts.urlTitle) body.set("url_title", opts.urlTitle);
    if (opts.priority !== undefined) body.set("priority", String(opts.priority));
    const res = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      console.error("[pushover] failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[pushover] error:", err);
  }
}
