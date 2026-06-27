import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Code2,
  Download,
  FileText,
  Mic,
  Search,
  Shuffle,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fmtDate } from "@/lib/format";

export const Route = createFileRoute("/my-interviews")({
  head: () => ({
    meta: [
      { title: "My Interviews · MockMate" },
      { name: "description", content: "Browse every mock interview you've taken — filter by mode, category, and score." },
    ],
  }),
  component: MyInterviewsPage,
});

type Mode = "text" | "voice" | "video";
type Category = "technical" | "hr" | "mix";

const INTERVIEWS = [
  { id: "i_9f2", date: "2026-06-24T14:20:00Z", category: "technical", mode: "video", overallScore: 86, questions: 10, duration: 28 },
  { id: "i_8d1", date: "2026-06-22T09:05:00Z", category: "hr",        mode: "voice", overallScore: 74, questions: 8,  duration: 19 },
  { id: "i_7c5", date: "2026-06-19T18:42:00Z", category: "mix",       mode: "text",  overallScore: 91, questions: 12, duration: 34 },
  { id: "i_6b3", date: "2026-06-15T11:10:00Z", category: "technical", mode: "text",  overallScore: 68, questions: 10, duration: 22 },
  { id: "i_5a0", date: "2026-06-11T16:30:00Z", category: "hr",        mode: "video", overallScore: 79, questions: 8,  duration: 24 },
  { id: "i_4z9", date: "2026-06-04T13:00:00Z", category: "technical", mode: "voice", overallScore: 82, questions: 10, duration: 26 },
  { id: "i_3y2", date: "2026-05-30T20:15:00Z", category: "mix",       mode: "text",  overallScore: 64, questions: 12, duration: 31 },
  { id: "i_2x8", date: "2026-05-25T08:45:00Z", category: "hr",        mode: "text",  overallScore: 88, questions: 8,  duration: 17 },
];

const categoryMeta: Record<Category, { label: string; icon: typeof Code2 }> = {
  technical: { label: "Technical", icon: Code2 },
  hr:        { label: "HR",        icon: Users },
  mix:       { label: "Mixed",     icon: Shuffle },
};
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

function MyInterviewsPage() {
  const [q, setQ] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | Mode>("all");
  const [catFilter, setCatFilter] = useState<"all" | Category>("all");

  const rows = useMemo(() => {
    return INTERVIEWS.filter((r) => {
      if (modeFilter !== "all" && r.mode !== modeFilter) return false;
      if (catFilter !== "all" && r.category !== catFilter) return false;
      if (q && !`${r.id} ${r.category} ${r.mode}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, modeFilter, catFilter]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px]">
        <AppSidebar active="interviews" />

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">History</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">My interviews</h1>
              <p className="mt-1 text-sm text-muted-foreground">All {INTERVIEWS.length} sessions, filterable and exportable.</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" className="rounded-full" onClick={() => toast("Exporting CSV…")}>
                <Download className="mr-1.5 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-3 shadow-elegant backdrop-blur-xl">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by id, category, or mode…"
                className="rounded-full border-border/60 bg-background/60 pl-9"
              />
            </div>
            <FilterGroup
              value={catFilter}
              onChange={(v) => setCatFilter(v as typeof catFilter)}
              options={[
                { value: "all", label: "All categories" },
                { value: "technical", label: "Technical" },
                { value: "hr", label: "HR" },
                { value: "mix", label: "Mixed" },
              ]}
            />
            <FilterGroup
              value={modeFilter}
              onChange={(v) => setModeFilter(v as typeof modeFilter)}
              options={[
                { value: "all", label: "All modes" },
                { value: "text", label: "Text" },
                { value: "voice", label: "Voice" },
                { value: "video", label: "Video" },
              ]}
            />
          </div>

          {/* Table */}
          <section className="rounded-2xl border border-border/60 bg-card/60 shadow-elegant backdrop-blur-xl">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Mode</th>
                    <th className="px-6 py-3 font-medium">Questions</th>
                    <th className="px-6 py-3 font-medium">Duration</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const cat = categoryMeta[row.category as Category];
                    const md = modeMeta[row.mode as Mode];
                    const Icon = md.icon;
                    return (
                      <tr key={row.id} className="border-b border-border/40 transition-colors hover:bg-muted/40">
                        <td className="px-6 py-3.5 font-mono text-muted-foreground">{fmtDate(row.date)}</td>
                        <td className="px-6 py-3.5">{cat.label}</td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {md.label}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 font-mono text-muted-foreground">{row.questions}</td>
                        <td className="px-6 py-3.5 font-mono text-muted-foreground">{row.duration}m</td>
                        <td className="px-6 py-3.5">
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", scoreTone(row.overallScore))}>
                            {row.overallScore}%
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex justify-end gap-1">
                            <Button asChild variant="ghost" size="sm" className="rounded-full">
                              <Link to="/report/$id" params={{ id: row.id }}>
                                View report <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive" onClick={() => toast("Deleted", { description: row.id })}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="px-6 py-12 text-center text-sm text-muted-foreground">No interviews match these filters.</div>
              )}
            </div>

            <ul className="divide-y divide-border/40 md:hidden">
              {rows.map((row) => {
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
                        {fmtDate(row.date)} · {row.questions} Q · {row.duration}m
                      </div>
                    </div>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", scoreTone(row.overallScore))}>
                      {row.overallScore}%
                    </span>
                  </li>
                );
              })}
              {rows.length === 0 && (
                <li className="px-5 py-12 text-center text-sm text-muted-foreground">No interviews match these filters.</li>
              )}
            </ul>
          </section>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}

function FilterGroup({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-border/60 bg-muted/40 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition",
            value === o.value ? "bg-background text-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
