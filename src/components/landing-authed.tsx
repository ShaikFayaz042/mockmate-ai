import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Flame,
  LayoutDashboard,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import type { FakeUser } from "@/hooks/use-auth";

// Static-but-realistic demo data
const KPIS = [
  { label: "Total interviews", value: "24", hint: "All-time", icon: BarChart3, tone: "primary" },
  { label: "Average score", value: "78%", hint: "Last 10 sessions", icon: Trophy, tone: "emerald" },
  { label: "Best score", value: "92%", hint: "Frontend · Medium", icon: Award, tone: "amber" },
  { label: "Streak", value: "5d", hint: "Practice streak", icon: Flame, tone: "rose" },
] as const;

const TONES: Record<string, string> = {
  primary: "from-primary/30 to-primary/0 text-primary",
  emerald: "from-emerald-500/30 to-emerald-500/0 text-emerald-400",
  amber: "from-amber-500/30 to-amber-500/0 text-amber-400",
  rose: "from-rose-500/30 to-rose-500/0 text-rose-400",
};

const PROGRESS = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 70 },
  { day: "Wed", score: 68 },
  { day: "Thu", score: 81 },
  { day: "Fri", score: 76 },
  { day: "Sat", score: 88 },
  { day: "Sun", score: 84 },
];

const SCHEDULED = [
  { title: "Frontend · React deep-dive", when: "Today, 6:00 PM", mode: "Video", difficulty: "Medium" },
  { title: "System design fundamentals", when: "Tomorrow, 10:30 AM", mode: "Voice", difficulty: "Hard" },
  { title: "Behavioral · STAR practice", when: "Fri, 5:00 PM", mode: "Text", difficulty: "Easy" },
];

const SKILLS = [
  { name: "React", level: 82 },
  { name: "TypeScript", level: 74 },
  { name: "System Design", level: 58 },
  { name: "DSA", level: 66 },
  { name: "Behavioral", level: 88 },
];

export function LandingAuthed({ user }: { user: FakeUser }) {
  const max = Math.max(...PROGRESS.map((p) => p.score));
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
        {/* Hero */}
        <section className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Welcome back</p>
            <h1 className="mt-1 truncate text-3xl font-semibold tracking-tight sm:text-4xl">
              Hey, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You're 4 points away from your personal best. One more round today keeps the streak alive.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/my-interviews">History</Link>
            </Button>
            <Button asChild className="rounded-full shadow-glow">
              <Link to="/dashboard">
                <LayoutDashboard className="mr-1.5 h-4 w-4" /> Go to dashboard
              </Link>
            </Button>
          </div>
        </section>

        {/* KPI cards */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {KPIS.map((k) => {
            const Icon = k.icon;
            return (
              <div
                key={k.label}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl"
              >
                <div className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${TONES[k.tone]} opacity-60 blur-2xl`} />
                <div className="relative flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                  <Icon className={`h-4 w-4 ${TONES[k.tone].split(" ").pop()}`} />
                </div>
                <div className="relative mt-2 font-mono text-2xl font-semibold">{k.value}</div>
                <p className="relative mt-0.5 text-[11px] text-muted-foreground">{k.hint}</p>
              </div>
            );
          })}
        </section>

        {/* Charts + scheduled */}
        <section className="mb-10 grid gap-4 lg:grid-cols-3">
          {/* Progress chart */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Weekly progress</h2>
                <p className="text-xs text-muted-foreground">Average score per session, last 7 days</p>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                +12% WoW
              </span>
            </div>
            <div className="flex h-44 items-end gap-2 sm:gap-4">
              {PROGRESS.map((p) => {
                const h = Math.max(8, Math.round((p.score / max) * 100));
                return (
                  <div key={p.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="relative w-full overflow-hidden rounded-md bg-muted/40" style={{ height: "100%" }}>
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-md bg-gradient-to-t from-primary to-primary/40 transition-all"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] uppercase text-muted-foreground">{p.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scheduled */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Scheduled interviews</h2>
                <p className="text-xs text-muted-foreground">Your upcoming sessions</p>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <ul className="space-y-3">
              {SCHEDULED.map((s) => (
                <li
                  key={s.title}
                  className="group flex items-start gap-3 rounded-xl border border-border/50 bg-background/40 p-3 transition hover:border-border"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.title}</p>
                    <p className="text-[11px] text-muted-foreground">{s.when}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {s.mode}
                      </span>
                      <span className="rounded-full border border-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {s.difficulty}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full rounded-lg">
              <Link to="/dashboard">Schedule new</Link>
            </Button>
          </div>
        </section>

        {/* Skills + CTA */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Current skills</h2>
                <p className="text-xs text-muted-foreground">Calibrated from your last 10 sessions</p>
              </div>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <ul className="space-y-3">
              {SKILLS.map((s) => (
                <li key={s.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{s.name}</span>
                    <span className="font-mono text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary/40"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 via-card/70 to-card/60 p-5 backdrop-blur-xl">
            <Sparkles className="absolute -right-2 -top-2 h-20 w-20 text-primary/10" />
            <h2 className="text-sm font-semibold">Ready for another round?</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Jump straight into a fresh interview tailored to your target role.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild className="w-full rounded-full shadow-glow">
                <Link to="/dashboard">
                  <Zap className="mr-1.5 h-4 w-4" /> Start interview
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link to="/my-interviews">
                  View past reports <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
