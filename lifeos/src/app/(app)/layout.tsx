import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import QuickAdd from "@/components/QuickAdd";
import { signOut } from "@/app/actions";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/tasks", label: "Tasks" },
  { href: "/inbox", label: "Inbox" },
  { href: "/property", label: "Property" },
  { href: "/wealth", label: "Wealth" },
  { href: "/health", label: "Health" },
  { href: "/people", label: "People" },
  { href: "/trips", label: "Trips" },
  { href: "/habits", label: "Habits" },
  { href: "/work", label: "Work" },
  { href: "/review", label: "Review" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { count: inboxCount } = await supabase
    .from("captures")
    .select("id", { count: "exact", head: true })
    .eq("status", "inbox");

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col">
      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{ borderColor: "var(--hairline)", background: "color-mix(in srgb, var(--plane) 85%, transparent)" }}
      >
        <div className="flex items-center justify-between px-4 pt-3">
          <Link href="/" className="text-lg font-bold tracking-tight">
            LifeOS
          </Link>
          <div className="flex items-center gap-3">
            <QuickAdd />
            <form action={signOut}>
              <button className="text-xs" style={{ color: "var(--ink-muted)" }}>
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav className="scrollbar-none flex gap-1 overflow-x-auto px-3 py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative whitespace-nowrap rounded-full px-3 py-1 text-sm"
              style={{ color: "var(--ink-secondary)" }}
            >
              {item.label}
              {item.href === "/inbox" && (inboxCount ?? 0) > 0 && (
                <span
                  className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{ background: "#d03b3b" }}
                >
                  {inboxCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1 space-y-4 p-4 pb-16">{children}</main>
    </div>
  );
}
