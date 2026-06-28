import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Loader2,
  Mic,
  MicOff,
  Pause,
  Play,
  Send,
  Sparkles,
  Timer,
  User as UserIcon,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import aiInterviewerAvatar from "@/assets/ai-interviewer.png.asset.json";

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
    <div className="relative h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-mesh opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_15%,transparent_70%)]" />

      <div className="relative mx-auto flex h-screen max-w-6xl flex-col px-4 py-3 sm:px-6 sm:py-4">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-2.5 backdrop-blur-xl">
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
            {/* Question counter chip */}
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider text-primary">
              Q {idx + 1} / {total}
            </span>
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs">
              <Timer className={cn("h-3.5 w-3.5", remaining < 15 ? "text-rose-400" : "text-muted-foreground")} />
              <span className="font-mono tabular-nums">{fmtTime(remaining)}</span>
            </div>
            <button
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-border hover:text-foreground"
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? "Resume" : "Pause"}
            </button>
            <ThemeToggle />
            <button
              onClick={() => setConfirmEnd(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20"
            >
              <X className="h-3.5 w-3.5" /> End
            </button>
          </div>
        </header>

        {/* Progress bar */}
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main */}
        <main className="mt-3 flex min-h-0 flex-1 flex-col rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl">
          {/* Interviewer question */}
          <div className="border-b border-border/60 p-4 sm:p-5">
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
          <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-5">
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
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-4 py-3 sm:px-5">
            <button
              onClick={goPrev}
              disabled={idx === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-foreground/80 transition hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </button>
            <div className="hidden sm:block text-xs text-muted-foreground">
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
        </main>
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
  const [aiSpeaking, setAiSpeaking] = useState(true);
  const tRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate AI finishing its prompt after a short delay
  useEffect(() => {
    const t = setTimeout(() => setAiSpeaking(false), 2800);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    if (recording) {
      if (tRef.current) clearInterval(tRef.current);
      setRecording(false);
      onTranscript("(transcribed) I would start by clarifying the requirements and constraints…");
      toast.success("Captured", { description: `${seconds}s of audio transcribed.` });
      setSeconds(0);
    } else {
      setRecording(true);
      setAiSpeaking(false);
      tRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  };

  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-10 py-6">
      <div className="flex items-start justify-center gap-10 sm:gap-20">
        <Orb
          tone="violet"
          active={aiSpeaking}
          icon={<Bot className="h-10 w-10" strokeWidth={1.75} />}
          label="Interviewer"
          status={aiSpeaking ? "Speaking…" : "Listening"}
        />
        <button
          onClick={toggle}
          className="group flex flex-col items-center focus:outline-none"
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          <Orb
            tone="emerald"
            active={recording}
            icon={
              recording ? (
                <MicOff className="h-10 w-10" strokeWidth={1.75} />
              ) : (
                <UserIcon className="h-10 w-10" strokeWidth={1.75} />
              )
            }
            label="You"
            status={recording ? `Recording · ${fmtTime(seconds)}` : "Mic off — tap to talk"}
          />
        </button>
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

function Orb({
  tone,
  active,
  icon,
  label,
  status,
}: {
  tone: "violet" | "emerald";
  active: boolean;
  icon: React.ReactNode;
  label: string;
  status: string;
}) {
  const palette =
    tone === "violet"
      ? {
          core: "bg-gradient-to-br from-violet-500 to-indigo-600 text-white",
          ring: "ring-violet-500/30",
          glow: "shadow-[0_0_60px_-10px_rgba(139,92,246,0.55)]",
          ripple: "border-violet-400/40",
          dot: "bg-violet-400",
          dotDim: "bg-violet-400/30",
          label: "text-violet-300",
        }
      : {
          core: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
          ring: "ring-emerald-400/30",
          glow: "shadow-[0_0_60px_-10px_rgba(16,185,129,0.55)]",
          ripple: "border-emerald-400/40",
          dot: "bg-emerald-400",
          dotDim: "bg-emerald-400/30",
          label: "text-emerald-300",
        };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
        {/* concentric rings */}
        <span className={cn("absolute inset-0 rounded-full border", palette.ripple, active ? "opacity-80" : "opacity-25")} />
        <span
          className={cn(
            "absolute inset-4 rounded-full border",
            palette.ripple,
            active ? "opacity-60 animate-ping" : "opacity-20",
          )}
          style={{ animationDuration: "2.4s" }}
        />
        <span
          className={cn(
            "absolute inset-8 rounded-full border",
            palette.ripple,
            active ? "opacity-50 animate-ping" : "opacity-15",
          )}
          style={{ animationDuration: "1.8s" }}
        />
        {/* core */}
        <div
          className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-full ring-1 transition-all sm:h-28 sm:w-28",
            palette.core,
            palette.ring,
            active && palette.glow,
            active && "scale-105",
          )}
        >
          {icon}
        </div>
      </div>

      {/* equalizer dots */}
      <div className="mt-2 flex items-end gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-all",
              active ? palette.dot : palette.dotDim,
              active && "animate-pulse",
            )}
            style={active ? { animationDelay: `${i * 120}ms`, animationDuration: "900ms" } : undefined}
          />
        ))}
      </div>

      <div className={cn("mt-4 text-sm font-semibold", palette.label)}>{label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{status}</div>
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
    <div className="flex h-full flex-col gap-3">
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-2">
        {/* AI Interviewer avatar tile (left) */}
        <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-violet-950/60 via-background to-fuchsia-950/40">
          <img
            src={aiInterviewerAvatar.url}
            alt="AI Interviewer"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur">
            MockMate AI · Interviewer
          </div>
          <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-300 ring-1 ring-emerald-500/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
          </div>
        </div>

        {/* User camera tile (right) */}
        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-black/60">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
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
          <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur">
            You
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={toggleRec} disabled={!on} variant={recording ? "destructive" : "default"} size="sm">
          {recording ? (
            <><MicOff className="mr-1.5 h-4 w-4" /> Stop & transcribe</>
          ) : (
            <><Mic className="mr-1.5 h-4 w-4" /> Start recording</>
          )}
        </Button>
        <Button onClick={on ? stopCam : startCam} variant="outline" size="sm">
          {on ? (
            <><VideoOff className="mr-1.5 h-4 w-4" /> Disable camera</>
          ) : (
            <><Video className="mr-1.5 h-4 w-4" /> Enable camera</>
          )}
        </Button>
        {draft && (
          <div className="ml-auto max-w-md truncate rounded-md border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground">
            <span className="mr-2 font-mono uppercase tracking-wider text-foreground/60">Transcript:</span>
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
