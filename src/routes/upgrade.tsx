import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upgrade")({
  head: () => ({
    meta: [
      { title: "Upgrade plan · MockMate" },
      { name: "description", content: "Upgrade your MockMate plan for more credits, voice & video modes, and detailed reports." },
    ],
  }),
  component: UpgradePage,
});

type Cycle = "monthly" | "yearly";
type PlanKey = "free" | "pro" | "premium";

const PLANS: {
  key: PlanKey;
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  highlight?: boolean;
  features: string[];
}[] = [
  {
    key: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "Try MockMate, no card required.",
    features: ["100 credits / month", "Text mode only", "Basic feedback", "1 saved profile"],
  },
  {
    key: "pro",
    name: "Pro",
    monthly: 299,
    yearly: 2990,
    tagline: "For serious interview prep.",
    highlight: true,
    features: [
      "1,500 credits / month",
      "Text, Voice & Video modes",
      "Detailed AI feedback + scores",
      "Downloadable PDF reports",
      "Unlimited profiles",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    monthly: 599,
    yearly: 5990,
    tagline: "Unlimited practice, top tier.",
    features: [
      "Unlimited credits",
      "All modes + face/voice analysis",
      "Priority AI response time",
      "Custom question banks",
      "1:1 mentor referral (quarterly)",
    ],
  },
];

function UpgradePage() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const [current] = useState<PlanKey>("free");

  const choose = (p: PlanKey) => {
    if (p === current) return;
    if (p === "free") return toast("You're already on Free");
    toast.success("Opening checkout…", { description: `${p === "pro" ? "Pro" : "Premium"} · ${cycle}` });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex w-full min-h-screen max-w-[1400px]">
        <AppSidebar active="upgrade" />

        <main className="flex-1 min-w-0 px-4 pt-20 pb-8 sm:px-8 sm:pt-10 sm:pb-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Billing</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Upgrade your plan</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                You're currently on the <span className="text-foreground">Free</span> plan. Unlock voice, video, and unlimited rounds.
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Cycle toggle */}
          <div className="mb-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 p-1">
              {(["monthly", "yearly"] as Cycle[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition",
                    cycle === c ? "bg-background text-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c}
                  {c === "yearly" && (
                    <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                      −17%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Plans */}
          <section className="grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => {
              const price = cycle === "monthly" ? p.monthly : Math.round(p.yearly / 12);
              const isCurrent = current === p.key;
              return (
                <div
                  key={p.key}
                  className={cn(
                    "relative flex flex-col rounded-2xl border p-6 shadow-elegant backdrop-blur-xl transition",
                    p.highlight
                      ? "border-primary/50 bg-card/80 shadow-glow"
                      : "border-border/60 bg-card/60 hover:border-border"
                  )}
                >
                  {p.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-foreground shadow-glow">
                      Most popular
                    </span>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.tagline}</p>
                  </div>
                  <div className="mb-5 flex items-end gap-1">
                    <span className="font-mono text-4xl font-semibold tracking-tight">₹{price}</span>
                    <span className="mb-1 text-sm text-muted-foreground">/ month</span>
                  </div>
                  <Button
                    onClick={() => choose(p.key)}
                    variant={p.highlight ? "default" : "outline"}
                    className={cn("rounded-full", p.highlight && "shadow-glow")}
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current plan" : p.key === "free" ? "Stay on Free" : (
                      <>
                        <Zap className="mr-1.5 h-4 w-4" /> Upgrade to {p.name}
                      </>
                    )}
                  </Button>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.highlight ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>

          {/* FAQ / footnote */}
          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <Note title="Cancel anytime" body="Plans renew automatically. Cancel from Settings → Billing — no questions asked." />
            <Note title="Secure payments" body="Powered by Razorpay. Cards, UPI, and net-banking supported across India." />
            <Note title="Credits never expire" body="Unused credits roll over while your subscription is active." />
            <Note title="Need a custom plan?" body="Teams of 5+ get team dashboards and SSO. Reach us at team@mockmate.dev." />
          </section>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            All plans include a 7-day money-back guarantee.
          </div>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{body}</div>
    </div>
  );
}
