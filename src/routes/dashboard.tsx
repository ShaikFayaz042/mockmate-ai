import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Code2,
  Coins,
  FileText,
  Mic,
  Shuffle,
  Trophy,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · MockMate" },
      { name: "description", content: "Track your interview progress, review recent sessions, and launch new AI-powered practice rounds." },
    ],
  }),
  component: DashboardPage,
});

type Mode = "text" | "voice" | "video";
type Category = "technical" | "hr" | "mix";
type Difficulty = "easy" | "medium" | "hard";

const MOCK_USER = { name: "Fayaz Shaik", creditsRemaining: 320 };
const MOCK_INTERVIEWS = [
  { id: "i_9f2", date: "2026-06-24T14:20:00Z", category: "technical", mode: "video", overallScore: 86, questions: 10 },
  { id: "i_8d1", date: "2026-06-22T09:05:00Z", category: "hr",        mode: "voice", overallScore: 74, questions: 8  },
  { id: "i_7c5", date: "2026-06-19T18:42:00Z", category: "mix",       mode: "text",  overallScore: 91, questions: 12 },
  { id: "i_6b3", date: "2026-06-15T11:10:00Z", category: "technical", mode: "text",  overallScore: 68, questions: 10 },
  { id: "i_5a0", date: "2026-06-11T16:30:00Z", category: "hr",        mode: "video", overallScore: 79, questions: 8  },
];

const modeMeta: Record<Mode, { label: string; icon: typeof Mic; cost: number; desc: string }> = {
  text:  { label: "Text",  icon: FileText, cost: 25, desc: "Type your answers" },
  voice: { label: "Voice", icon: Mic,      cost: 50, desc: "Speak into the mic" },
  video: { label: "Video", icon: Video,    cost: 50, desc: "Face + voice analysis" },
};
const categoryMeta: Record<Category, { label: string; icon: typeof Code2; desc: string }> = {
  technical: { label: "Technical", icon: Code2,   desc: "Coding, DSA, System Design" },
  hr:        { label: "HR",        icon: Users,   desc: "Behavioral, cultural fit" },
  mix:       { label: "Mixed",     icon: Shuffle, desc: "Technical + HR blend" },
};

import { fmtDate } from "@/lib/format";

function scoreTone(s: number) {
  if (s >= 85) return "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20";
  if (s >= 70) return "text-amber-500 bg-amber-500/10 ring-amber-500/20";
  return "text-rose-500 bg-rose-500/10 ring-rose-500/20";
}

function DashboardPage() {
  const navigate = useNavigate();
  const user = MOCK_USER;
  const interviews = MOCK_INTERVIEWS;

  const [category, setCategory] = useState<Category>("technical");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [mode, setMode] = useState<Mode>("text");
  const [questionCount, setQuestionCount] = useState(10);
  const [isTimeBased, setIsTimeBased] = useState(true);
  const [loading, setLoading] = useState(false);

  const cost = modeMeta[mode].cost;
  const insufficient = user.creditsRemaining < cost;

  const stats = useMemo(() => {
    const scores = interviews.map((i) => i.overallScore);
    const total = interviews.length;
    const avg = total ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
    const best = total ? Math.max(...scores) : 0;
    return { total, avg, best, credits: user.creditsRemaining };
  }, [interviews, user.creditsRemaining]);

  const handleStart = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success("Interview ready", { description: `${categoryMeta[category].label} · ${difficulty} · ${questionCount} questions` });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px]">
        <AppSidebar active="dashboard" credits={stats.credits} />


        {/* Main */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
          {/* Topbar */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Dashboard</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {user.name.split(" ")[0]}.
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off, or start a fresh round.</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={handleStart} disabled={insufficient || loading} className="rounded-full shadow-glow">
                <Zap className="mr-1.5 h-4 w-4" /> {loading ? "Preparing…" : "Quick start"}
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <section className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard label="Total interviews" value={stats.total} icon={BarChart3} hint="All-time" trend="+2 this week" tone="primary" />
            <StatCard label="Average score"   value={`${stats.avg}%`}  icon={Trophy}   hint="Across all sessions" trend="+4 pts" tone="emerald" />
            <StatCard label="Best score"      value={`${stats.best}%`} icon={Award}    hint="Personal best"       trend="Mixed · Text" tone="amber" />
            <StatCard label="Credits left"    value={stats.credits}    icon={Coins}    hint={`~${Math.floor(stats.credits / 25)} text rounds`} trend="Pro plan" tone="violet" />
          </section>

          {/* Interview customization */}
          <section className="mb-10 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-elegant backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Customize your interview</h2>
                <p className="text-sm text-muted-foreground">Choose the shape of your next practice round.</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                Cost: <span className="text-foreground">{cost} credits</span>
              </span>
            </div>

            <Field label="Category">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(Object.keys(categoryMeta) as Category[]).map((c) => {
                  const m = categoryMeta[c];
                  const Icon = m.icon;
                  return (
                    <OptionCard key={c} selected={category === c} onClick={() => setCategory(c)}>
                      <Icon className="h-5 w-5" />
                      <div className="mt-2 font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </OptionCard>
                  );
                })}
              </div>
            </Field>

            <Field label="Difficulty">
              <div className="inline-flex rounded-full border border-border/70 bg-muted/40 p-1">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition",
                      difficulty === d ? "bg-background text-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Mode">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(Object.keys(modeMeta) as Mode[]).map((m) => {
                  const meta = modeMeta[m];
                  const Icon = meta.icon;
                  return (
                    <OptionCard key={m} selected={mode === m} onClick={() => setMode(m)}>
                      <div className="flex w-full items-center justify-between">
                        <Icon className="h-5 w-5" />
                        <span className="font-mono text-[11px] text-muted-foreground">{meta.cost} cr</span>
                      </div>
                      <div className="mt-2 font-medium">{meta.label}</div>
                      <div className="text-xs text-muted-foreground">{meta.desc}</div>
                    </OptionCard>
                  );
                })}
              </div>
            </Field>

            <Field label="Timer mode">
              <div className="flex flex-wrap gap-2">
                <Pill active={isTimeBased} onClick={() => setIsTimeBased(true)}>Per-question (AI)</Pill>
                <Pill active={!isTimeBased} onClick={() => setIsTimeBased(false)}>Fixed 30 min total</Pill>
              </div>
            </Field>

            <Field label={`Questions · ${questionCount}`}>
              <input
                type="range"
                min={5}
                max={20}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="w-full accent-[color:var(--primary)]"
              />
              <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
                <span>5</span><span>10</span><span>15</span><span>20</span>
              </div>
            </Field>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              {insufficient ? (
                <p className="text-sm text-destructive">Insufficient credits — upgrade your plan to continue.</p>
              ) : (
                <p className="text-sm text-muted-foreground">You'll have <span className="font-mono text-foreground">{user.creditsRemaining - cost}</span> credits after this round.</p>
              )}
              <Button size="lg" disabled={insufficient || loading} onClick={handleStart} className="rounded-full px-6 shadow-glow">
                <Zap className="mr-1.5 h-4 w-4" />
                {loading ? "Starting…" : "Start interview"}
              </Button>
            </div>
          </section>

          {/* Recent interviews */}
          <section className="rounded-2xl border border-border/60 bg-card/60 shadow-elegant backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Recent interviews</h2>
                <p className="text-sm text-muted-foreground">Your last {interviews.length} sessions.</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate({ to: "/" })}>
                View all <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Mode</th>
                    <th className="px-6 py-3 font-medium">Questions</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((row) => {
                    const cat = categoryMeta[row.category as Category];
                    const md = modeMeta[row.mode as Mode];
                    const Icon = md.icon;
                    return (
                      <tr key={row.id} className="border-b border-border/40 transition-colors hover:bg-muted/40">
                        <td className="px-6 py-3.5 font-mono text-muted-foreground">{fmtDate(row.date)}</td>
                        <td className="px-6 py-3.5">{cat.label}</td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5 text-foreground">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {md.label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-muted-foreground">{row.questions}</td>
                        <td className="px-6 py-3.5">
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", scoreTone(row.overallScore))}>
                            {row.overallScore}%
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => toast("Opening report…")}>
                            View <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <ul className="divide-y divide-border/40 md:hidden">
              {interviews.map((row) => {
                const cat = categoryMeta[row.category as Category];
                const md = modeMeta[row.mode as Mode];
                const Icon = md.icon;
                return (
                  <li key={row.id} className="flex items-center justify-between px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {cat.label}
                        <span className="text-muted-foreground">·</span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" />{md.label}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                        {fmtDate(row.date)} · {row.questions} Q
                      </div>
                    </div>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", scoreTone(row.overallScore))}>
                      {row.overallScore}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}


function StatCard({
  label, value, icon: Icon, hint, trend, tone,
}: {
  label: string; value: string | number; icon: typeof BarChart3; hint: string; trend: string;
  tone: "primary" | "emerald" | "amber" | "violet";
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/15 to-transparent text-primary",
    emerald: "from-emerald-500/15 to-transparent text-emerald-500",
    amber:   "from-amber-500/15 to-transparent text-amber-500",
    violet:  "from-violet-500/15 to-transparent text-violet-400",
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 shadow-elegant backdrop-blur-xl transition-colors hover:border-border">
      <div className={cn("pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-70 blur-2xl", tones[tone])} />
      <div className="relative flex items-start justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className={cn("h-4 w-4", tones[tone].split(" ").pop())} />
      </div>
      <p className="relative mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <div className="relative mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{hint}</span>
        <span className="font-mono">{trend}</span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function OptionCard({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start rounded-xl border p-4 text-left transition",
        selected
          ? "border-primary/60 bg-primary/5 shadow-glow"
          : "border-border/60 bg-background/40 hover:border-border hover:bg-muted/40"
      )}
    >
      {children}
    </button>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm transition",
        active ? "border-primary/60 bg-primary/10 text-foreground" : "border-border/60 bg-background/40 text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
