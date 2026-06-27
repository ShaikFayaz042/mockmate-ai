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

          {/* Interview customization — monolithic dark glass */}
          <section className="mb-10 overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 shadow-elegant backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Customize your interview</h2>
                <p className="text-sm text-muted-foreground">Configure your session parameters for optimal performance.</p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Cost <span className="ml-1 text-foreground">{cost} cr</span>
              </span>
            </div>

            <div className="space-y-9">
              {/* Unified segmented toggles: Mode + Session type */}
              <div className="space-y-3">
                <Label>Session architecture</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Segmented
                    options={(Object.keys(modeMeta) as Mode[]).map((m) => ({ value: m, label: modeMeta[m].label }))}
                    value={mode}
                    onChange={(v) => setMode(v as Mode)}
                  />
                  <Segmented
                    options={[{ value: "time", label: "Time based (AI per-question)" }, { value: "count", label: "Normal (fixed total time)" }]}
                    value={isTimeBased ? "time" : "count"}
                    onChange={(v) => setIsTimeBased(v === "time")}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <Label>Domain category</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {(Object.keys(categoryMeta) as Category[]).map((c) => {
                    const m = categoryMeta[c];
                    const Icon = m.icon;
                    const selected = category === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={cn(
                          "group relative flex flex-col items-start rounded-xl border bg-card/40 p-4 text-left transition-all",
                          selected
                            ? "border-primary/50 bg-card/70 ring-1 ring-primary/30 shadow-glow"
                            : "border-border/60 hover:border-border hover:bg-card/60"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 transition-colors", selected ? "text-primary" : "text-muted-foreground")} />
                        <div className="mt-2 text-sm font-medium">{m.label}</div>
                        <div className="mt-0.5 text-[11px] text-muted-foreground">{m.desc}</div>
                        {selected && <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary shadow-glow" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <Label>Experience level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={cn(
                        "rounded-lg border bg-card/40 py-2.5 text-xs font-medium capitalize transition-all",
                        difficulty === d
                          ? "border-border bg-muted text-foreground"
                          : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question count — preset chips */}
              <div className="space-y-3 pt-1">
                <div className="flex items-end justify-between">
                  <Label>Question count</Label>
                  <span className="font-mono text-sm text-primary">{questionCount} Q</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {[5, 8, 10, 12, 15, 20].map((n) => {
                    const selected = questionCount === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setQuestionCount(n)}
                        className={cn(
                          "group relative flex flex-col items-center justify-center rounded-xl border bg-card/40 py-3 transition-all",
                          selected
                            ? "border-primary/50 bg-muted ring-1 ring-primary/30 shadow-glow"
                            : "border-border/60 hover:border-border hover:bg-card/60"
                        )}
                      >
                        <span className={cn("text-2xl font-semibold tracking-tight", selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                          {n}
                        </span>
                        <span className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          questions
                        </span>
                        {selected && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>



              {/* CTA */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {insufficient ? (
                  <p className="text-sm text-destructive">Insufficient credits — upgrade to continue.</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You'll have <span className="font-mono text-foreground">{user.creditsRemaining - cost}</span> credits remaining.
                  </p>
                )}
                <Button size="lg" disabled={insufficient || loading} onClick={handleStart} className="rounded-xl px-6 shadow-glow">
                  <Zap className="mr-1.5 h-4 w-4" />
                  {loading ? "Starting…" : "Begin session"}
                </Button>
              </div>
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

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-xl border border-border/60 bg-card/40 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              active
                ? "bg-muted text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        );
      })}
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
