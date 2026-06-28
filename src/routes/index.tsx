import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Mic,
  Video,
  MessageSquare,
  Sparkles,
  Target,
  LineChart,
  ShieldCheck,
  Brain,
  Zap,
  Check,
} from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MockMate — AI mock interviews in text, voice, and video" },
      {
        name: "description",
        content:
          "Practice text, voice, and video interviews with an adaptive AI interviewer. Pick a role, difficulty, and question count — get a scored report after every session.",
      },
      { property: "og:title", content: "MockMate — AI-powered mock interviews" },
      {
        property: "og:description",
        content:
          "Adaptive AI interviewer across text, voice, and video. Per-question feedback, overall score, and a clean session history.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Brain,
    title: "Adaptive interviewer",
    body: "Questions adapt to your role, skills, and answers — no two sessions feel the same.",
  },
  {
    icon: LineChart,
    title: "Detailed feedback",
    body: "Scores for clarity, depth, structure, and confidence — with line-by-line suggestions.",
  },
  {
    icon: Target,
    title: "Target-role tuned",
    body: "Pick a role (SDE, PM, DS…) and difficulty. We tailor the interview around it.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Your sessions and recordings stay yours. Delete anything, anytime.",
  },
  {
    icon: Zap,
    title: "Fast, low-latency",
    body: "Streamed responses keep the conversation flowing — no awkward gaps.",
  },
  {
    icon: Sparkles,
    title: "Beautiful history",
    body: "Every interview, transcript, and score lives in a clean, searchable timeline.",
  },
];

const MODES = [
  {
    icon: MessageSquare,
    name: "Text",
    tag: "Most popular",
    body: "Type your answers in a focused workbench. Best for behavioral, system design, and quick reps.",
  },
  {
    icon: Mic,
    name: "Voice",
    tag: "Realistic",
    body: "Dual-orb interface — the AI speaks, you tap to talk back. Natural pacing with live status cues.",
  },
  {
    icon: Video,
    name: "Video",
    tag: "Experimental",
    body: "Your camera on one side, the AI interviewer avatar on the other. Practice presence and pacing.",
  },
];

const STEPS = [
  { n: "01", t: "Create your account", b: "Sign up with email or Google and land on your dashboard." },
  { n: "02", t: "Configure the session", b: "Pick mode, category, difficulty, question count, and timer style." },
  { n: "03", t: "Run the interview", b: "Question-by-question flow with a live timer and progress bar." },
  { n: "04", t: "Open the report", b: "Scores, strengths, improvements, and per-question feedback." },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    cadence: "forever",
    features: ["3 interviews / month", "Text mode", "Basic feedback", "Last 7 days of history"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    cadence: "/ month",
    features: ["Unlimited text & voice", "Full scored reports", "Unlimited history", "All difficulty levels"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Premium",
    price: "₹999",
    cadence: "/ month",
    features: ["Everything in Pro", "Video mode with AI avatar", "Priority models", "Exportable PDF reports"],
    cta: "Go Premium",
    highlight: false,
  },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteNavbar />

      {/* HERO */}
      <section className="relative px-4 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Now with realtime voice mode
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Interviews that feel real.
            <br />
            <span className="text-gradient-primary">Feedback that moves the needle.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            MockMate is your personal AI interviewer. Practice in text, voice, or video — and walk
            away with the exact reps and feedback you need to land the offer.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full shadow-glow">
              <Link to="/signup">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href="#how">How it works</a>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card · 3 free interviews · Cancel anytime
          </p>
        </div>

        {/* preview card */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-2 shadow-elegant backdrop-blur-xl">
            <div className="rounded-xl border border-border/60 bg-surface">
              <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-chart-4/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                  mockmate.app · interview · senior-frontend
                </span>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Interviewer
                    </p>
                    <p className="mt-2 text-sm text-foreground">
                      Walk me through how you'd design a real-time collaborative editor. Start with
                      the data model and how you'd handle conflict resolution.
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-accent/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">You</p>
                    <p className="mt-2 text-sm text-foreground">
                      I'd model the document as a CRDT — specifically a sequence CRDT like RGA — so
                      concurrent inserts converge without a central server arbitrating order…
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { l: "Clarity", v: 88 },
                    { l: "Structure", v: 74 },
                    { l: "Depth", v: 81 },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-xl border border-border/60 bg-background/60 p-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{s.l}</span>
                        <span className="font-mono text-foreground">{s.v}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                          style={{ width: `${s.v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to interview better — nothing you don't.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="group bg-card/60 p-6 transition-colors hover:bg-card">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODES */}
      <section id="modes" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Modes</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Three ways to practice. Pick what fits the moment.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {MODES.map((m) => (
              <div
                key={m.name}
                className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                    <m.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-border/70 bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {m.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              From signup to your first scored report in under two minutes.
            </h2>
          </div>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur"
              >
                <span className="font-mono text-xs text-primary">{s.n}</span>
                <h3 className="mt-3 text-base font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple plans. Cancel anytime.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-6 backdrop-blur ${
                  p.highlight
                    ? "border-primary/40 bg-card shadow-glow"
                    : "border-border/70 bg-card/60"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                  <span className="text-sm text-muted-foreground">{p.cadence}</span>
                </div>
                <Button
                  asChild
                  className="mt-5 w-full rounded-full"
                  variant={p.highlight ? "default" : "outline"}
                >
                  <Link to="/signup">{p.cta}</Link>
                </Button>
                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-10 text-center backdrop-blur-xl sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next interview is in a week.
              <br />
              <span className="text-gradient-primary">Be ready by Sunday.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              Start with three free interviews. No card, no commitment.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full shadow-glow">
                <Link to="/signup">
                  Create your account <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/login">I have an account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
