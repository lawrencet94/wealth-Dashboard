# LifeOS — Personal Operations Dashboard

A single, self-hosted web app that runs your personal operations: tasks, projects,
property decisions, travel, people, habits, and health signals — reachable from
iPhone, Apple Watch (via Shortcuts), and laptop.

Built to the LifeOS Scope Document v1.0. Stack: **Next.js (App Router) + Tailwind**,
**Supabase** (Postgres + Auth + RLS), **Anthropic Claude Haiku 4.5** for capture
classification, **Pushover** for notifications, **Google Calendar** (read-only).

---

## What's here

| Screen | What it does |
|---|---|
| **Today** (`/`) | Command centre: next 3 calendar events, top 3 tasks, habit row + streaks, latest health stat, "waiting on" strip, inbox badge |
| **Tasks** | Today / Upcoming / By Area / By Project / Waiting / Done views; complete, snooze (+1d/+1w/date), reprioritise; recurring tasks regenerate on completion (RRULE) |
| **Inbox** | Unsorted captures with the parser's suggestion — one-tap accept, route to task/note, or dismiss. Nothing ever silently vanishes |
| **Property** | Fitzclarence pipeline (stage strip + tasks), radiator project, Anacapri seasonal maintenance, DB11-vs-911 weighted decision matrix |
| **Wealth** | Manual weekly snapshot tiles (net worth, goal %, month spend) + renewal/admin tasks. Wealth Garden stays the system of record |
| **Health** | 30/90-day line charts (glucose 7-day avg, HRV, weight), manual/Shortcut metric logging, appointment tasks |
| **People** | Lightweight CRM: last touch / next touch due, overdue-touches list |
| **Trips** | Idea → Booked → Packing → Done pipeline with checklists (base template auto-added) |
| **Habits** | Streaks, chess-rating chart toward 1000, 14-day grid |
| **Work** | Personal career items only (DAW/carry issues project seeded). No firm/fund/LP/deal data |
| **Review** | Weekly review: overdue tasks, stale projects (14 days), overdue people touches |

Capture channels: **⌘K quick-add** on every screen (web) and **`POST /api/capture`**
for the iOS Shortcut / Apple Watch. Both go through the same pipeline:
raw capture stored first → Claude Haiku classifies → confidence ≥ 0.8 routes
directly (Pushover confirmation) → anything else lands in the Inbox.

---

## Setup

### 1. Supabase (~10 min)

1. Create a project at [supabase.com](https://supabase.com) (free tier, pick an EU region for latency/residency).
2. **SQL editor** → run `supabase/schema.sql`.
3. **Authentication → Users** → *Add user* → create your email + password
   (disable public signups under Auth settings).
4. Copy the new user's UUID, paste it into `supabase/seed.sql`
   (`REPLACE-WITH-YOUR-USER-ID`) and run it — this seeds the areas, the
   Fitzclarence/radiator/Anacapri/DAW projects, contacts, the Greek islands
   trip, the DB11-vs-911 decision, and the chess + electrolytes habits.
5. Grab from **Settings → API**: project URL, `anon` key, `service_role` key.

### 2. Environment

```bash
cp .env.example .env.local   # then fill in every value
```

`LIFEOS_USER_ID` is the same UUID you used in the seed. `CAPTURE_TOKEN` and
`CRON_SECRET` are long random strings you generate (`openssl rand -hex 32`).

### 3. Run locally

```bash
npm install
npm run dev
```

Log in at `http://localhost:3000` with your Supabase user.

### 4. Deploy (Railway / Render / Vercel)

Any Node host works. Set the **root directory to `lifeos/`**, build command
`npm run build`, start command `npm start`, and add every variable from
`.env.local`. Point your subdomain (e.g. `ops.yourdomain.com`) at it and make
sure it's HTTPS (the PWA and Shortcuts need it). Then on iPhone: open the site
in Safari → Share → **Add to Home Screen** — it installs as a standalone app.

### 5. iOS Shortcut ("Capture")

Create a Shortcut with two actions and add it to the home screen, the Action
Button, and the Watch:

1. **Dictate text** (or *Ask for Input* as fallback)
2. **Get contents of URL**
   - URL: `https://ops.yourdomain.com/api/capture`
   - Method: `POST`
   - Headers: `Authorization: Bearer <CAPTURE_TOKEN>`, `Content-Type: application/json`
   - Request body (JSON): `{"text": <Dictated Text>, "source": "shortcut"}`

Optional metric Shortcut (e.g. HealthKit HRV → LifeOS):
`POST /api/metrics` with body `{"type": "hrv", "value": <number>, "unit": "ms"}`
and the same bearer header.

### 6. Scheduled notifications

The app exposes one cron endpoint, secured with `CRON_SECRET`:

```
GET /api/cron?job=<name>
Authorization: Bearer <CRON_SECRET>
```

Schedule these with cron-job.org, Railway cron, or GitHub Actions (times are
Europe/London):

| Job | Schedule | Purpose |
|---|---|---|
| `reminders` | every 5 min | task reminders at configured offsets |
| `daily-summary` | 07:30 daily | events, top tasks, habit prompts, inbox count |
| `missed-routines` | 21:30 daily | nudge if a habit with a notify time isn't logged |
| `weekly-review` | 18:00 Sunday | overdue counts + link to the Review screen |

### 7. Google Calendar (optional)

Reuse your existing OAuth client: set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
and a `GOOGLE_REFRESH_TOKEN` with `calendar.readonly` scope. The Today view and
daily summary pick events up automatically; without these vars the calendar
section simply doesn't render.

---

## Phase exit tests (from the scope doc)

- **Phase 1:** create, complete, and snooze a task from your phone browser. ✅ supported
- **Phase 2:** 10 varied voice captures, ≥8 routed correctly, 0 lost. Raw text is
  always stored *before* parsing, so a parser outage still lands captures in the Inbox.
- **Phase 3:** run a full week from the dashboard (Today view, recurring tasks,
  reminders, streaks, daily summary).

## Design decisions (answers to the Phase-0 open questions)

1. **Hosting** — anything with EU regions works; Supabase project should be EU. The app is a single Next.js service.
2. **Parser creating projects** — no. The parser only files into existing projects (safer); unknown names → Inbox.
3. **Wealth Garden** — manual weekly snapshots in v1 (`wealth_snapshots` table + form). A read-only endpoint can replace the form later without schema changes.
4. **Inaya visibility** — every table already carries `user_id`, so adding a second user + shared-view policies later is a policy change, not a schema migration.
5. **Weekly review** — simple checklist screen first (`/review`); the Claude-written summary can be added to the `weekly-review` cron job later.

## Import your DAW list

The Work area is seeded with a "DAW / carry issues" project. Import the existing
12-item list as tasks against it — quickest via the Tasks screen's *New task*
form or by pasting each line into ⌘K.

## Security notes

- All tables have Row Level Security (`auth.uid() = user_id`).
- `/api/capture` and `/api/metrics` require the `CAPTURE_TOKEN` bearer; `/api/cron` requires `CRON_SECRET`.
- The `service_role` key is server-only — never exposed to the browser.
- Hard rule restated: no Moonfare deal data, LP information, or firm documents.
