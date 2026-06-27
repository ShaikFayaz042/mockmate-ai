import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  Send,
  Sparkles,
  SquarePen,
  Timer,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type Mode = "text" | "voice" | "video";
type Timer = "per_question" | "total";

type Search = {
  mode: Mode;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  questions: number;
  timer: Timer;
};

export const Route = createFileRoute("/interview/$id")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const mode = (raw.mode as Mode) ?? "text";
    const category = (raw.category as string) ?? "technical";
    const difficulty = (raw.difficulty as Search["difficulty"]) ?? "medium";
    const questions = Number(raw.questions ?? 10) || 10;
    const timer = (raw.timer as Timer) ?? "per_question";
    return { mode, category, difficulty, questions, timer };
  },
  head: () => ({
    meta: [
      { title: "Interview room — MockMate" },
      { name: "description", content: "Live AI interview session with real-time scoring and feedback." },
    ],
  }),
  component: InterviewRoom,
});

const QUESTION_BANK: Record<string, string[]> = {
  technical: [
    "Walk me through how you'd design a URL shortener that handles 1B redirects/day.",
    "Explain the difference between optimistic and pessimistic concurrency control.",
    "How would you debug a memory leak in a long-running Node.js service?",
    "Describe how HTTPS establishes a secure connection — what happens in the handshake?",
    "When would you reach for a queue vs. a stream, and why?",
  ],
  behavioral: [
    "Tell me about a time you disagreed with a teammate. How did you resolve it?",
    "Describe a project that didn't go as planned and what you learned.",
    "How do you prioritize when everything feels urgent?",
  ],
  system_design: [
    "Design a real-time collaborative document editor.",
    "How would you architect a multi-tenant analytics platform?",
  ],
  hr: [
    "Why do you want to work here?",
    "Where do you see yourself in five years?",
  ],
};

function pickQuestions(category: string, n: number) {
  const pool = QUESTION_BANK[category] ?? QUESTION_BANK.technical;
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(pool[i % pool.length]);
  return out;
}

const categoryLabel: Record<string, string> = {
  technical: "Technical",
  behavioral: "Behavioral",
  system_design: "System design",
  hr: "HR / Culture",
};

function InterviewRoom() {
  const { mode, category, difficulty, questions: total, timer } = Route.useSearch();
  const navigate = useNavigate();

  const questions = useMemo(() => pickQuestions(category, total), [category, total]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => Array(total).fill(""));
  const [draft, setDraft] = useState("");
  const [paused, setPaused] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  // timer
  const perQuestion = timer === "per_question";
  const perQuestionSeconds = difficulty === "easy" ? 120 : difficulty === "medium" ? 90 : 60;
  const totalSeconds = perQuestionSeconds * total;
  const [elapsed, setElapsed] = useState(0); // seconds within current scope
  useEffect(() => {
    if (paused || confirmEnd) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [paused, confirmEnd, idx]);
  useEffect(() => {
    if (perQuestion) setElapsed(0);
  }, [idx, perQuestion]);

  const limit = perQuestion ? perQuestionSeconds : totalSeconds;
  const remaining = Math.max(0, limit - elapsed);
  const pct = Math.min(100, (elapsed / limit) * 100);

  const progress = ((idx + 1) / total) * 100;

  const goNext = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = draft;
      return copy;
    });
    setDraft("");
    if (idx + 1 >= total) {
      finish();
    } else {
      setThinking(true);
      setTimeout(() => {
        setIdx((i) => i + 1);
        setThinking(false);
      }, 600);
    }
  };

  const goPrev = () => {
    if (idx === 0) return;
    setAnswers((prev) => {
      const copy = [...prev];
      copy[idx] = draft;
      return copy;
    });
    setIdx((i) => i - 1);
    setDraft(answers[idx - 1] ?? "");
  };

  const finish = () => {
    toast.success("Session complete", { description: "Generating your feedback report…" });
    navigate({ to: "/my-interviews" });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-mesh opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_70%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <BrandMark />
            <div className="hidden h-6 w-px bg-border/70 md:block" />
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono uppercase tracking-wider">
                {mode}
              </span>
              <span>{categoryLabel[category] ?? category}</span>
              <span className="text-border">·</span>
              <span className="capitalize">{difficulty}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-border hover:text-foreground"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? "Resume" : "Pause"}
            </button>
            <ThemeToggle />
            <button
              onClick={() => setConfirmEnd(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
            >
              <X className="h-3.5 w-3.5" /> End session
            </button>
          </div>
        </header>

        {/* Progress + timer */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="rounded-xl border border-border/60 bg-background/40 p-3 backdrop-blur">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase tracking-wider text-muted-foreground">
                Question {idx + 1} / {total}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-4 py-3 backdrop-blur">
            <Timer className={cn("h-4 w-4", remaining < 15 ? "text-rose-400" : "text-muted-foreground")} />
            <div className="font-mono text-lg tabular-nums">
              {fmtTime(remaining)}
            </div>
            <div className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
              {perQuestion ? "per question" : "total"}
            </div>
            <div className="ml-2 hidden h-1.5 w-24 overflow-hidden rounded-full bg-muted/60 sm:block">
              <div
                className={cn(
                  "h-full transition-all",
                  pct > 80 ? "bg-rose-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main */}
        <main className="mt-4 grid flex-1 gap-4 lg:grid-cols-[1fr_320px]">
          <section className="flex flex-col rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl">
            {/* Interviewer question */}
            <div className="border-b border-border/60 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Interviewer · MockMate AI
                  </div>
                  <p className="mt-1 text-base leading-relaxed text-foreground sm:text-lg">
                    {thinking ? (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Preparing the next question…
                      </span>
                    ) : (
                      questions[idx]
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer area: differs per mode */}
            <div className="flex-1 p-5 sm:p-6">
              {mode === "text" && (
                <TextAnswer draft={draft} onChange={setDraft} disabled={paused || thinking} />
              )}
              {mode === "voice" && (
                <VoiceAnswer onTranscript={(t) => setDraft((d) => (d ? d + " " : "") + t)} draft={draft} />
              )}
              {mode === "video" && (
                <VideoAnswer onTranscript={(t) => setDraft((d) => (d ? d + " " : "") + t)} draft={draft} />
              )}
            </div>

            {/* Footer actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-6">
              <button
                onClick={goPrev}
                disabled={idx === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-foreground/80 transition hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
              <div className="text-xs text-muted-foreground">
                {draft.trim().length > 0
                  ? `${draft.trim().split(/\s+/).length} words drafted`
                  : "Take your time — quality over speed."}
              </div>
              <Button onClick={goNext} disabled={paused || thinking}>
                {idx + 1 >= total ? (
                  <>
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Finish
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 h-4 w-4" /> Submit & continue
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </section>

          {/* Side panel */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-xl">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Session
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="Mode" value={mode} mono />
                <Row label="Category" value={categoryLabel[category] ?? category} />
                <Row label="Difficulty" value={difficulty} />
                <Row label="Questions" value={`${idx + 1} / ${total}`} />
                <Row label="Timer" value={perQuestion ? "Per question" : "Total"} />
              </dl>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Live tips
                </div>
                <SquarePen className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                <li>• Use the STAR method for behavioral prompts.</li>
                <li>• State assumptions before designing.</li>
                <li>• Think out loud — clarity beats correctness.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/60 p-4 backdrop-blur-xl">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Roadmap
              </div>
              <ol className="mt-3 space-y-1.5 text-xs">
                {questions.map((_, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5",
                      i === idx && "bg-primary/10 text-foreground",
                      i < idx && "text-muted-foreground",
                      i > idx && "text-muted-foreground/60",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-mono",
                        i === idx
                          ? "border-primary/60 bg-primary/20 text-primary"
                          : i < idx
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-border/60",
                      )}
                    >
                      {i < idx ? "✓" : i + 1}
                    </span>
                    Question {i + 1}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </main>

        <footer className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">← Back to dashboard</Link>
          <span>Stay focused. You've got this.</span>
        </footer>
      </div>

      {/* End confirm */}
      {confirmEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">End interview?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your progress on remaining questions won't be saved. We'll still grade what you've completed.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmEnd(false)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
              >
                Keep going
              </button>
              <button
                onClick={finish}
                className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600"
              >
                End & grade
              </button>
            </div>
          </div>
        </div>
      )}

      {paused && !confirmEnd && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-8 py-6 shadow-xl">
            <Pause className="h-8 w-8 text-primary" />
            <div className="text-lg font-semibold">Session paused</div>
            <Button onClick={() => setPaused(false)}>
              <Play className="mr-1.5 h-4 w-4" /> Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("text-foreground", mono && "font-mono uppercase text-xs tracking-wider")}>{value}</dd>
    </div>
  );
}

function TextAnswer({ draft, onChange, disabled }: { draft: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <textarea
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here. Structure your thinking — assumptions, approach, trade-offs."
        className="min-h-[260px] w-full flex-1 resize-none rounded-xl border border-border/60 bg-background/40 p-4 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary/60 focus:bg-background/60 disabled:opacity-50"
      />
    </div>
  );
}

function VoiceAnswer({ draft, onTranscript }: { draft: string; onTranscript: (t: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const tRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const toggle = () => {
    if (recording) {
      if (tRef.current) clearInterval(tRef.current);
      setRecording(false);
      // mock transcription
      onTranscript("(transcribed) I would start by clarifying the requirements and constraints…");
      toast.success("Captured", { description: `${seconds}s of audio transcribed.` });
      setSeconds(0);
    } else {
      setRecording(true);
      tRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 py-6">
      <div className="relative">
        <button
          onClick={toggle}
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full border transition",
            recording
              ? "border-rose-500/60 bg-rose-500/15 text-rose-300"
              : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          {recording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
          {recording && (
            <>
              <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/20" />
              <span className="absolute -inset-2 animate-pulse rounded-full ring-2 ring-rose-500/30" />
            </>
          )}
        </button>
      </div>
      <div className="text-center">
        <div className="font-mono text-2xl tabular-nums">{fmtTime(seconds)}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {recording ? "Recording — tap mic to stop & transcribe" : "Tap mic to start recording your answer"}
        </div>
      </div>
      {draft && (
        <div className="w-full max-w-2xl rounded-xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-wider text-foreground/60">Transcript</div>
          {draft}
        </div>
      )}
    </div>
  );
}

function VideoAnswer({ draft, onTranscript }: { draft: string; onTranscript: (t: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setOn(true);
      setError(null);
    } catch (e) {
      setError("Camera/mic permission denied. You can still type your answer using text mode.");
    }
  };

  const stopCam = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setOn(false);
    setRecording(false);
  };

  useEffect(() => () => stopCam(), []);

  const toggleRec = () => {
    if (!on) return;
    if (recording) {
      setRecording(false);
      onTranscript("(transcribed) My approach to this problem would be…");
      toast.success("Clip captured & transcribed");
    } else {
      setRecording(true);
    }
  };

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1fr_240px]">
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-black/60">
        <video ref={videoRef} muted playsInline className="h-full max-h-[420px] w-full object-cover" />
        {!on && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-background/80 to-background/50 p-6 text-center">
            <Video className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Camera is off</div>
            <Button onClick={startCam} size="sm">
              <Video className="mr-1.5 h-4 w-4" /> Enable camera & mic
            </Button>
            {error && <p className="max-w-xs text-xs text-rose-400">{error}</p>}
          </div>
        )}
        {recording && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-rose-500/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Rec
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Button onClick={toggleRec} disabled={!on} variant={recording ? "destructive" : "default"}>
          {recording ? (
            <>
              <MicOff className="mr-1.5 h-4 w-4" /> Stop & transcribe
            </>
          ) : (
            <>
              <Mic className="mr-1.5 h-4 w-4" /> Start recording
            </>
          )}
        </Button>
        <Button onClick={on ? stopCam : startCam} variant="outline" size="sm">
          {on ? (
            <>
              <VideoOff className="mr-1.5 h-4 w-4" /> Disable camera
            </>
          ) : (
            <>
              <Video className="mr-1.5 h-4 w-4" /> Enable camera
            </>
          )}
        </Button>
        {draft && (
          <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
            <div className="mb-1 text-[10px] font-mono uppercase tracking-wider text-foreground/60">Transcript</div>
            {draft}
          </div>
        )}
      </div>
    </div>
  );
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
