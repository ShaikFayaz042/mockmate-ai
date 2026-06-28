import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Brain,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Lightbulb,
  MessageSquare,
  Mic,
  Share2,
  Target,
  TrendingUp,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/report/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Report ${params.id} · MockMate` },
      { name: "description", content: "Detailed interview report with per-question feedback, scores, and recommendations." },
    ],
  }),
  component: ReportPage,
});

// --- Mock data keyed by id (would come from API in real app) ---
type Mode = "text" | "voice" | "video";
type Category = "technical" | "hr" | "mix";

const REPORTS: Record<string, {
  id: string; date: string; category: Category; mode: Mode;
  overall: number; questions: number; duration: number;
  scores: { name: string; value: number }[];
  strengths: string[]; improvements: string[];
  qa: { q: string; a: string; score: number; feedback: string; ideal?: string }[];
}> = {
  default: {
    id: "i_9f2", date: "2026-06-24T14:20:00Z", category: "technical", mode: "video",
    overall: 86, questions: 10, duration: 28,
    scores: [
      { name: "Technical depth", value: 88 },
      { name: "Communication",   value: 82 },
      { name: "Problem solving", value: 90 },
      { name: "Confidence",      value: 78 },
      { name: "Structure",       value: 84 },
    ],
    strengths: [
      "Clear, structured answers with concrete examples from past projects.",
      "Strong grasp of system-design tradeoffs (consistency vs. availability).",
      "Good pacing — rarely paused or used filler words.",
    ],
    improvements: [
      "Tighten time on open-ended questions — answers ran ~20% long.",
      "Use the STAR framework more explicitly for behavioural questions.",
      "Quantify impact with numbers where possible.",
    ],
    qa: [
      { q: "Explain the difference between SQL and NoSQL databases.", a: "SQL is relational with strict schemas; NoSQL is non-relational and schema-flexible. SQL suits transactions, NoSQL suits horizontal scale…", score: 92, feedback: "Excellent — covered ACID vs BASE and gave a real use case.", ideal: "Mention CAP theorem tradeoffs and a concrete example per category." },
      { q: "How would you design a URL shortener?", a: "I'd use a hash function over the long URL, store mappings in a key-value store…", score: 84, feedback: "Solid high-level design. Missed discussing cache invalidation and analytics pipeline." },
      { q: "Tell me about a time you handled conflict on a team.", a: "In my last project a teammate disagreed with the architecture choice…", score: 76, feedback: "Good story, but didn't quantify outcome. Use STAR more tightly." },
    ],
  },
};

const categoryMeta: Record<Category, string> = { technical: "Technical", hr: "HR", mix: "Mixed" };
const modeMeta: Record<Mode, { label: string; icon: typeof Mic }> = {
  text:  { label: "Text",  icon: FileText },
  voice: { label: "Voice", icon: Mic },
  video: { label: "Video", icon: Video },
};

function scoreTone(s: number) {
  if (s >= 85) return "text-emerald-500 bg-emerald-500/10 ring-emerald-500/20";
  if (s >= 70) return "text-amber-500 bg-amber-500/10 ring-amber-500/20";
  return "text-rose-500 bg-rose-500/10 ring-rose-500/20";
}

function ReportPage() {
  const { id } = Route.useParams();
  const r = REPORTS[id] ?? { ...REPORTS.default, id };
  const ModeIcon = modeMeta[r.mode].icon;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm" className="rounded-full text-muted-foreground">
            <Link to="/my-interviews">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => toast("Link copied")}>
              <Share2 className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Share</span>
            </Button>
            <Button size="sm" className="rounded-full" onClick={() => toast("Downloading PDF…")}>
              <Download className="h-4 w-4 sm:mr-1.5" /> <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Header card */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-elegant backdrop-blur-xl">
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Report · {r.id}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {categoryMeta[r.category]} interview
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1">
                  <ModeIcon className="h-3.5 w-3.5" /> {modeMeta[r.mode].label}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1">
                  <Clock className="h-3.5 w-3.5" /> {r.duration} min
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1">
                  <MessageSquare className="h-3.5 w-3.5" /> {r.questions} questions
                </span>
                <span className="font-mono text-xs">{fmtDate(r.date)}</span>
              </div>
            </div>

            {/* Ring score */}
            <div className="relative mx-auto h-36 w-36 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" className="fill-none stroke-muted" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42"
                  className="fill-none stroke-primary transition-all"
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(r.overall / 100) * 264} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-3xl font-semibold tabular-nums">{r.overall}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Overall</div>
              </div>
            </div>
          </div>
        </section>

        {/* Score breakdown */}
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-elegant backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold">Score breakdown</h2>
            </div>
            <ul className="space-y-3">
              {r.scores.map((s) => (
                <li key={s.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="font-mono tabular-nums">{s.value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-500" />
                <h2 className="text-sm font-semibold">Strengths</h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {r.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold">Areas to improve</h2>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {r.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Per-question */}
        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-elegant backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Question-by-question feedback</h2>
          </div>
          <ol className="space-y-4">
            {r.qa.map((item, i) => (
              <li key={i} className="rounded-xl border border-border/60 bg-background/40 p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Question {i + 1}
                    </div>
                    <p className="mt-1 text-sm font-medium">{item.q}</p>
                  </div>
                  <span className={cn("inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", scoreTone(item.score))}>
                    {item.score}%
                  </span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Your answer</div>
                    <p className="text-muted-foreground">{item.a}</p>
                  </div>
                  <div className="flex gap-2 rounded-lg border border-border/50 bg-muted/30 p-3">
                    <XCircle className={cn("mt-0.5 h-4 w-4 shrink-0", item.score >= 85 ? "text-emerald-500" : item.score >= 70 ? "text-amber-500" : "text-rose-500")} />
                    <div>
                      <div className="text-xs font-semibold">AI feedback</div>
                      <p className="mt-0.5 text-muted-foreground">{item.feedback}</p>
                    </div>
                  </div>
                  {item.ideal && (
                    <div className="flex gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <div className="text-xs font-semibold text-primary">Ideal answer hint</div>
                        <p className="mt-0.5 text-muted-foreground">{item.ideal}</p>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/my-interviews"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to history</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/dashboard">Start another interview</Link>
          </Button>
        </div>
        <div className="h-10" />
      </div>
    </div>
  );
}
