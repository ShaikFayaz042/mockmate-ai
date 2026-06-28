# MockMate — UI Reference Manual

A page-by-page, element-by-element specification of the redesigned MockMate frontend. For each page you get the **exact visible copy** (taken verbatim from the source) and a **table of every interactive element with its effect**.

Stack: TanStack Start (React 19) · TanStack Router (file-based) · Tailwind v4 (OKLCH tokens) · shadcn/ui · lucide-react · sonner toasts.

---

## Table of contents

1. [Global shell](#1-global-shell)
2. [Landing — `/`](#2-landing--)
3. [Login — `/login`](#3-login--login)
4. [Sign up — `/signup`](#4-sign-up--signup)
5. [Forgot password — `/forgot-password`](#5-forgot-password--forgot-password)
6. [Reset password — `/reset-password`](#6-reset-password--reset-password)
7. [Dashboard — `/dashboard`](#7-dashboard--dashboard)
8. [My Interviews — `/my-interviews`](#8-my-interviews--my-interviews)
9. [Interview Room — `/interview/$id`](#9-interview-room--interviewid)
10. [Report — `/report/$id`](#10-report--reportid)
11. [Settings — `/settings`](#11-settings--settings)
12. [Upgrade — `/upgrade`](#12-upgrade--upgrade)
13. [Design tokens](#13-design-tokens)

---

## 1. Global shell

### `AppSidebar` (`src/components/app-sidebar.tsx`)
Sticky 256-px sidebar (`hidden lg:flex`), used on every authenticated route.

| Element | Visible text | Effect |
| --- | --- | --- |
| Brand mark (top) | `MockMate` logo | — (decorative) |
| Nav link | **Home** | → `/` |
| Nav link | **Dashboard** | → `/dashboard`, highlighted when `active="dashboard"` |
| Nav link | **My interviews** | → `/my-interviews` |
| Nav link | **Settings** | → `/settings` |
| Nav link | **Upgrade plan** | → `/upgrade` |
| Credits card | `Credits` label · numeric value | Static display of remaining credits |
| Button | **Top up** | → `/upgrade` |
| Button | **Log out** | Fires `toast("Logged out")` (demo) |

Active link tint: `bg-muted text-foreground`. Hover: `hover:bg-muted/60 hover:text-foreground`. Backdrop: `bg-background/60 backdrop-blur-xl`, right border `border-border/60`.

### `SiteNavbar` (marketing pages — landing, auth)
Brand on the left; anchor links **Features**, **Modes**, **How it works**, **Pricing**; **Log in** (ghost) → `/login`; **Start free** (primary, rounded) → `/signup`.

### `SiteFooter`
Brand, three link columns (Product / Company / Legal), copyright line.

### `ThemeToggle`
Single icon button. Cycles light ↔ dark; persists to `localStorage`.

---

## 2. Landing — `/`
File: `src/routes/index.tsx`. Meta title: `MockMate — AI-powered mock interviews that actually feel real`.

### 2.1 Hero
- Eyebrow pill: dot + **"Now with realtime voice mode"**.
- H1: **"Interviews that feel real."** + gradient line **"Feedback that moves the needle."** (`text-gradient-primary`).
- Subhead: *"MockMate is your personal AI interviewer. Practice in text, voice, or video — and walk away with the exact reps and feedback you need to land the offer."*
- Microcopy under CTAs: **"No credit card · 3 free interviews · Cancel anytime"**.

| Button | Effect |
| --- | --- |
| **Start free** (with `ArrowRight`, `shadow-glow`) | → `/signup` |
| **How it works** (outline) | Anchor-scroll to `#how` |

### 2.2 Hero preview card
Mock app window with traffic-light dots and URL `mockmate.app · interview · senior-frontend`.

- **Interviewer** bubble: *"Walk me through how you'd design a real-time collaborative editor. Start with the data model and how you'd handle conflict resolution."*
- **You** bubble: *"I'd model the document as a CRDT — specifically a sequence CRDT like RGA — so concurrent inserts converge without a central server arbitrating order…"*
- Score chips on the right: **Clarity 88**, **Structure 74**, **Depth 81**, each with a gradient progress bar.

### 2.3 Features (`#features`)
- Eyebrow: **Features**.
- H2: **"Everything you need to interview better — nothing you don't."**

| Icon | Title | Body |
| --- | --- | --- |
| Brain | **Adaptive interviewer** | Questions adapt to your role, skills, and answers — no two sessions feel the same. |
| LineChart | **Detailed feedback** | Scores for clarity, depth, structure, and confidence — with line-by-line suggestions. |
| Target | **Target-role tuned** | Pick a role (SDE, PM, DS…) and difficulty. We tailor the interview around it. |
| ShieldCheck | **Private by default** | Your sessions and recordings stay yours. Delete anything, anytime. |
| Zap | **Fast, low-latency** | Streamed responses keep the conversation flowing — no awkward gaps. |
| Sparkles | **Beautiful history** | Every interview, transcript, and score lives in a clean, searchable timeline. |

Hover effect: card background brightens (`hover:bg-card`).

### 2.4 Modes (`#modes`)
- Eyebrow: **Modes**.
- H2: **"Three ways to practice. Pick what fits the moment."**

| Icon | Name | Tag | Body |
| --- | --- | --- | --- |
| MessageSquare | **Text** | Most popular | Type your answers. Perfect for quick reps, system design, and behavioral drills. |
| Mic | **Voice** | Realistic | Speak naturally with an AI interviewer that listens, follows up, and pushes back. |
| Video | **Video** | Experimental | Camera + mic. Practice presence, eye contact, and pacing like the real thing. |

Hover effect: lifts (`-translate-y-0.5`) + `shadow-elegant`.

### 2.5 How it works (`#how`)
- Eyebrow: **How it works**.
- H2: **"From signup to your first feedback report in under 2 minutes."**

| Step | Title | Body |
| --- | --- | --- |
| 01 | **Build your profile** | Add target role, skills, and experience level. |
| 02 | **Pick a mode** | Text, voice, or video — choose what you want to practice. |
| 03 | **Interview live** | Adaptive questions, real follow-ups, natural pacing. |
| 04 | **Get feedback** | Scores, strengths, and concrete next steps — instantly. |

### 2.6 Pricing (`#pricing`)
- Eyebrow: **Pricing**.
- H2: **"Simple plans. Cancel anytime."**

| Plan | Price | Cadence | Features | CTA |
| --- | --- | --- | --- | --- |
| **Free** | ₹0 | forever | 3 interviews / month · Text mode · Basic feedback · Last 7 days history | **Start free** → `/signup` |
| **Pro** (highlight, "Most popular" ribbon, `shadow-glow`) | ₹499 | / month | Unlimited text & voice · Detailed scoring · Full history · Role-tuned questions | **Go Pro** → `/signup` |
| **Premium** | ₹999 | / month | Everything in Pro · Video interviews · Priority models · Exportable reports | **Go Premium** → `/signup` |

Each feature row uses a `Check` icon in `text-primary`.

### 2.7 Final CTA + footer
- H2: **"Your next interview is in a week."** + gradient **"Be ready by Sunday."**
- Subhead: **"Start with three free interviews. No card, no commitment."**

| Button | Effect |
| --- | --- |
| **Create your account** (`ArrowRight`, `shadow-glow`) | → `/signup` |
| **I have an account** (outline) | → `/login` |

Then `SiteFooter`.

---

## 3. Login — `/login`
File: `src/routes/login.tsx`. Meta: `Log in · MockMate`.

`AuthShell` props:
- **eyebrow**: `Welcome back`
- **title**: `Log in to MockMate`
- **subtitle**: `Pick up where you left off — your history and feedback are waiting.`
- **footer**: `New here?` + link **Create an account** → `/signup`.

| Element | Visible text / placeholder | Effect |
| --- | --- | --- |
| Outline button | **Continue with Google** (Google glyph) | `toast("Google sign-in (demo)")` |
| Divider | **or** | Visual only |
| Input | **Email** · `you@work.com` · type `email`, required, autoComplete `email` | Form field |
| Label-row link | **Forgot?** | → `/forgot-password` |
| Input | **Password** · `••••••••` · type `password`, required, autoComplete `current-password` | Form field |
| Submit (primary, `shadow-glow`) | **Log in** / **Signing in…** while loading | Demo handler: 700 ms then `toast.success("Signed in (demo)", { description: "Wire to your backend to complete login." })` |

---

## 4. Sign up — `/signup`
File: `src/routes/signup.tsx`. Meta: `Create your account · MockMate`.

`AuthShell`:
- **eyebrow**: `Get started`
- **title**: `Create your MockMate account`
- **subtitle**: `Three free interviews. No credit card required.`
- **footer**: `Already have an account?` + link **Log in** → `/login`.

| Element | Text / placeholder | Effect |
| --- | --- | --- |
| Outline button | **Sign up with Google** | `toast("Google sign-up (demo)")` |
| Input | **Full name** · `Ada Lovelace` · required | Form field |
| Input | **Email** · `you@work.com` · type `email`, required | Form field |
| Input | **Password** · `At least 8 characters` · type `password`, autoComplete `new-password` | Form field |
| Submit | **Create account** / **Creating account…** | 700 ms then `toast.success("Account created (demo)", { description: "Wire to your backend to finalize." })` |
| Fine print | **"By continuing you agree to MockMate's Terms and Privacy Policy."** | Static |

---

## 5. Forgot password — `/forgot-password`
File: `src/routes/forgot-password.tsx`.

`AuthShell`:
- **eyebrow**: `Reset password`
- **title**: `Forgot your password?`
- **subtitle**: `Enter the email on your account and we'll send you a reset link.`
- **footer**: `Remembered it?` + **Back to log in** → `/login`.

| Element | Text | Effect |
| --- | --- | --- |
| Input | **Email** · `you@work.com` · required | Form field |
| Submit (`shadow-glow`) | **Send reset link** | Sets `sent=true`, fires `toast.success("Check your inbox (demo)")` |
| Confirmation panel (after submit) | **"If an account exists for that email, a reset link is on its way."** | Replaces the form |

---

## 6. Reset password — `/reset-password`
File: `src/routes/reset-password.tsx`.

`AuthShell`:
- **eyebrow**: `Almost there`
- **title**: `Set a new password`
- **subtitle**: `Pick something memorable — at least 8 characters.`
- **footer**: **Back to log in** → `/login`.

| Element | Text / placeholder | Effect |
| --- | --- | --- |
| Input | **New password** · `At least 8 characters` · type `password` | Form field |
| Input | **Confirm password** · `Repeat password` · type `password` | Form field |
| Submit | **Update password** / **Updating…** | 700 ms then `toast.success("Password updated (demo)")` |

---

## 7. Dashboard — `/dashboard`
File: `src/routes/dashboard.tsx`. Meta: `Dashboard · MockMate`.

State the page tracks: `category` (default `technical`), `difficulty` (`medium`), `mode` (`text`), `questionCount` (`10`), `isTimeBased` (`true`), `loading`. Mock user: `Fayaz Shaik`, 320 credits.

### 7.1 Topbar
- Eyebrow: **DASHBOARD** (mono, uppercase).
- H1: **"Welcome back, {first name}."** → e.g. *Welcome back, Fayaz.*
- Subtitle: **"Pick up where you left off, or start a fresh round."**

| Element | Text | Effect |
| --- | --- | --- |
| `ThemeToggle` | — | Light/dark cycle |
| **Quick start** (`Zap` icon, `shadow-glow`) | Or **Preparing…** | Disabled when `insufficient` credits or loading; otherwise runs `handleStart` (see 7.4) |

### 7.2 Stats row — 4 `StatCard`s
| Label | Value | Hint | Trend | Tone (glow color) |
| --- | --- | --- | --- | --- |
| **Total interviews** | `stats.total` | All-time | +2 this week | primary |
| **Average score** | `{avg}%` | Across all sessions | +4 pts | emerald |
| **Best score** | `{best}%` | Personal best | Mixed · Text | amber |
| **Credits left** | `stats.credits` | `~{floor(credits/25)} text rounds` | Pro plan | violet |

Each card has a radial blurred gradient blob in its tone color (`-right-10 -top-10 h-32 w-32 … blur-2xl`) and `border` brightens on hover.

### 7.3 Customize your interview (monolithic glass card)
- H2: **"Customize your interview"**.
- Subtitle: **"Configure your session parameters for optimal performance."**
- Right header chip: **"COST {n} cr"** (mono, uppercase) — `n = modeMeta[mode].cost`.

#### Session architecture (label is mono uppercase)
Left tile = Mode segmented; right tile = Timer toggle.

| Mode option | Cost | Description | Active effects |
| --- | --- | --- | --- |
| **Text** (FileText) | 25 | Type your answers | Radial primary glow, tiny pulsing dot top-right of icon |
| **Voice** (Mic) | 50 | Speak into the mic | Radial primary glow, full **`animate-ping`** ring around icon |
| **Video** (Video) | 50 | Face + voice analysis | Radial primary glow, **pulsing rose REC dot** with destructive shadow |

All three share: icon scales to 110 % when active, gradient `from-primary/15 via-primary/5 to-transparent`, inset primary 35 % ring.

| Timer toggle | State copy | Effect |
| --- | --- | --- |
| Switch `OFF` (`isTimeBased=false`) | **Normal** / *Fixed total time* | Sends `timer: "total"` to the room |
| Switch `ON` (`isTimeBased=true`, default) | **Time based** / *AI per-question timing* | Sends `timer: "per_question"` |

Switch is a custom `role="switch"`, `aria-checked` button; thumb slides between `translate-x-0.5` and `translate-x-5`.

#### Domain category — 3 cards
| Card | Icon | Label | Description |
| --- | --- | --- | --- |
| `technical` | Code2 | **Technical** | Coding, DSA, System Design |
| `hr` | Users | **HR** | Behavioral, cultural fit |
| `mix` | Shuffle | **Mixed** | Technical + HR blend |

Selected card: `border-primary/50 bg-card/70 ring-1 ring-primary/30 shadow-glow`, icon turns primary, small primary dot appears top-right.

#### Difficulty level — 3 chips
| Chip | Dot color | Active style |
| --- | --- | --- |
| **Easy** | emerald | `border-emerald-500/50 bg-emerald-500/10 text-emerald-300` + emerald glow shadow |
| **Medium** | amber | amber-tinted equivalent |
| **Hard** | rose | rose-tinted equivalent |

Dot uses `animate-ping` overlay when its chip is active.

#### Question count — 6 preset chips
Right of label: live **`{n} Q`** mono primary readout.

Options: **5 · 8 · 10 · 12 · 15 · 20**. Each chip shows a big number and the mono uppercase caption **"questions"**. Selected: `border-primary/50 bg-muted ring-1 ring-primary/30 shadow-glow` + small primary dot top-right.

#### CTA row
| Element | Text | Effect |
| --- | --- | --- |
| Helper (sufficient credits) | **"You'll have `{remaining}` credits remaining."** | Updates live as mode changes |
| Helper (insufficient) | **"Insufficient credits — upgrade to continue."** (destructive) | Replaces helper |
| **Begin session** (`Zap`, `shadow-glow`, lg) | Or **Starting…** | `handleStart`: 500 ms delay → `toast.success("Interview ready", { description: "{Category} · {difficulty} · {n} questions" })` → `navigate({ to: "/interview/$id", params: { id: "new" }, search: { mode, category, difficulty, questions, timer } })`. Disabled when insufficient/loading. |

### 7.4 Recent interviews
- H2: **"Recent interviews"** + subtitle **"Your last {n} sessions."**
- **View all** ghost button (`ArrowUpRight`) → `/` (currently routes to landing; placeholder).

Desktop table columns: **Date · Type · Mode · Questions · Score · (action)**.

Score-tone pill rules (used in dashboard, my-interviews, report):
- `≥85` → emerald · `≥70` → amber · `<70` → rose. All as `bg-{color}/10 text-{color}-500 ring-{color}/20` rounded-full pill.

| Per-row action | Text | Effect |
| --- | --- | --- |
| **View** (ghost, `ArrowUpRight`) | — | Fires `toast("Opening report…")` (demo) |

Mobile list: each row shows `{category} · {modeIcon}{mode}` + `{date} · {questions} Q` + score pill.

---

## 8. My Interviews — `/my-interviews`
File: `src/routes/my-interviews.tsx`. Meta: `My Interviews · MockMate`.

### Header
- Eyebrow: **HISTORY**.
- H1: **"My interviews"**.
- Subtitle: **"All {n} sessions, filterable and exportable."** (n = 8 in mock data).

| Element | Text | Effect |
| --- | --- | --- |
| `ThemeToggle` | — | Light/dark |
| **Export** (outline, `Download`) | — | `toast("Exporting CSV…")` |

### Filter bar
| Element | Text | Effect |
| --- | --- | --- |
| Search input (`Search` icon) | placeholder **"Search by id, category, or mode…"** | Filters rows on `id + category + mode` substring |
| Category `FilterGroup` | **All categories · Technical · HR · Mixed** | Sets `catFilter` |
| Mode `FilterGroup` | **All modes · Text · Voice · Video** | Sets `modeFilter` |

### Table
Columns: **Date · Type · Mode · Questions · Duration · Score · (actions)**. Mock dataset has 8 rows spanning May–June 2026.

| Per-row action | Text | Effect |
| --- | --- | --- |
| **View report** (ghost, `ArrowUpRight`) | → `/report/$id` with `params={{ id: row.id }}` |
| Trash icon (ghost) | — | `toast("Deleted", { description: row.id })` — does **not** actually mutate state |

Empty state (table or list): **"No interviews match these filters."**

Mobile list: tapping the whole row navigates to the report.

---

## 9. Interview Room — `/interview/$id`
File: `src/routes/interview.$id.tsx`. Meta: `Interview room — MockMate`.

Full-viewport, non-scrolling layout (`h-screen overflow-hidden`). Search params validated to `{ mode, category, difficulty, questions, timer }`.

Question bank (cycled to fill `total`):
- **technical** (5): URL shortener for 1B/day; optimistic vs pessimistic concurrency; Node.js memory leak; HTTPS handshake; queue vs stream.
- **behavioral** (3): disagreement with teammate; project that didn't go as planned; prioritization under pressure.
- **system_design** (2): real-time collaborative document editor; multi-tenant analytics platform.
- **hr** (2): why us; five-year plan.

Per-question timer base: easy 120 s, medium 90 s, hard 60 s. `total` mode multiplies by question count.

### 9.1 Top bar (header)
| Element | Text | Effect |
| --- | --- | --- |
| `BrandMark` | MockMate | Visual brand |
| Mono chip | `{mode}` (uppercase, e.g. **TEXT**) | Static |
| Crumb | `{categoryLabel} · {difficulty}` | Static |
| **Q chip** (primary) | **`Q {idx+1} / {total}`** | Live counter |
| Timer chip | `MM:SS` remaining | Icon turns rose when `<15 s` left |
| Pause / Resume | **Pause** → **Resume** (`Pause`/`Play` icon) | Toggles `paused`; interval stops while paused |
| `ThemeToggle` | — | Light/dark |
| **End** (rose pill, `X`) | — | Opens "End interview?" modal |

Below header: gradient progress bar (`from-primary to-primary/60`) filling `((idx+1)/total)*100 %`.

### 9.2 Interviewer card (top of main panel)
- Avatar: `Sparkles` icon in primary-tinted circle.
- Eyebrow: **"Interviewer · MockMate AI"** (mono uppercase).
- Body: current question, OR **"Preparing the next question…"** with spinning `Loader2` for 600 ms between questions.

### 9.3 Answer area — varies by mode

#### Text mode (`TextAnswer`)
Single textarea, `min-h-[260px]`, placeholder **"Type your answer here. Structure your thinking — assumptions, approach, trade-offs."**. Focused border turns primary. Disabled when paused or thinking.

#### Voice mode (`VoiceAnswer`)
Dual orb interface, ~520 px tall center area.

| Orb | Tone | Icon | Label | Status copy | Active visuals |
| --- | --- | --- | --- | --- | --- |
| Left — Interviewer | violet (`from-violet-500 to-indigo-600`) | `Bot` | **Interviewer** | **"Speaking…"** while `aiSpeaking` (first 2.8 s) → **"Listening"** | Three concentric rings (outer static, middle `animate-ping` 2.4 s, inner `animate-ping` 1.8 s), violet glow shadow, 5 equalizer dots pulsing with 120 ms stagger, core scales to 105 % |
| Right — You | emerald (`from-emerald-400 to-teal-500`) | `User` → `MicOff` when recording | **You** | **"Mic off — tap to talk"** → **"Recording · MM:SS"** | Tap orb to toggle. On stop, appends `(transcribed) I would start by clarifying the requirements and constraints…` to `draft`, fires `toast.success("Captured", { description: "{n}s of audio transcribed." })`. While recording: same ring/equalizer treatment in emerald. |

Transcript strip (appears after first capture): mono eyebrow **TRANSCRIPT** + current `draft`.

#### Video mode (`VideoAnswer`)
Two-column grid (`lg:grid-cols-2`) inside the main panel.

| Tile | Content | Notes |
| --- | --- | --- |
| Left — AI Interviewer | `<img>` from `aiInterviewerAvatar.url`, `object-cover object-top`, top-to-bottom black gradient overlay | Bottom-left label **"MockMate AI · Interviewer"**; top-right pill **"● Live"** with `animate-pulse` emerald dot |
| Right — You | `<video>` element bound to camera; muted/playsInline | When camera off: dark fallback with `Video` icon, text **"Camera is off"**, button **"Enable camera & mic"**, and error text **"Camera/mic permission denied. You can still type your answer using text mode."** on failure. When recording: top-left **"● Rec"** rose pill (white pulsing dot). Bottom-left label **"You"**. |

Bottom control row:

| Button | Text | Effect |
| --- | --- | --- |
| **Start recording** / **Stop & transcribe** (default → destructive) | `Mic` / `MicOff` icon | Toggles `recording`. On stop appends `(transcribed) My approach to this problem would be…` to `draft` and fires `toast.success("Clip captured & transcribed")`. Disabled until camera is on. |
| **Enable camera** / **Disable camera** (outline) | `Video` / `VideoOff` icon | Calls `getUserMedia({ video: true, audio: true })` or stops all tracks. Cleanup on unmount. |
| Transcript pill (right) | **"TRANSCRIPT:"** + `draft` | Truncated single line |

### 9.4 Footer actions (all modes)
| Button | Text | Effect |
| --- | --- | --- |
| **Previous** (`ArrowLeft`) | — | Saves current `draft` into `answers[idx]`, then `idx--`, restores `answers[idx-1]`. Disabled at `idx===0`. |
| Status text (sm+) | **"{n} words drafted"** OR **"Take your time — quality over speed."** | Live |
| **Submit & continue** (`Send` + `ArrowRight`) → **Finish** (`CheckCircle2`) on last question | — | Saves draft. If last, calls `finish()` → `toast.success("Session complete", { description: "Generating your feedback report…" })` → `/my-interviews`. Otherwise shows "thinking" spinner for 600 ms then advances `idx`. Disabled while paused/thinking. |

### 9.5 Modals
| Modal | Trigger | Copy | Actions |
| --- | --- | --- | --- |
| **End interview?** | "End" header button | **"Your progress on remaining questions won't be saved. We'll still grade what you've completed."** | **Keep going** (closes); **End & grade** (rose) → `finish()` |
| **Session paused** | Pause toggle | Big `Pause` icon + **"Session paused"** | **Resume** (`Play`) → unpauses |

---

## 10. Report — `/report/$id`
File: `src/routes/report.$id.tsx`. Meta title: **`Report {id} · MockMate`**.

Loads from local `REPORTS` map (default mock: id `i_9f2`, Technical/Video, overall **86 %**, 10 Q, 28 min, taken 2026-06-24).

### 10.1 Top bar
| Element | Text | Effect |
| --- | --- | --- |
| **Back to history** (ghost, `ArrowLeft`) | — | → `/my-interviews` |
| `ThemeToggle` | — | Light/dark |
| **Share** (outline, `Share2`) | — | `toast("Link copied")` |
| **Download PDF** (primary, `Download`) | — | `toast("Downloading PDF…")` |

### 10.2 Header card
- Eyebrow: **"Report · {id}"** (mono).
- H1: **"{Category} interview"** (e.g. *Technical interview*).
- Meta chips: mode icon + label · `Clock` + **"{duration} min"** · `MessageSquare` + **"{n} questions"** · mono date.
- Ring score (right): SVG ring filled to `(overall/100) * 264` of 264 dasharray; center shows the number and mono caption **"Overall"**.

### 10.3 Score breakdown (left card)
- Title row: `TrendingUp` icon + **"Score breakdown"**.
- Bars (label · value):
  - **Technical depth** — 88
  - **Communication** — 82
  - **Problem solving** — 90
  - **Confidence** — 78
  - **Structure** — 84

### 10.4 Strengths & Areas to improve (right column)
- Emerald-tinted **Strengths** card (`Award` icon, `CheckCircle2` bullets):
  1. *Clear, structured answers with concrete examples from past projects.*
  2. *Strong grasp of system-design tradeoffs (consistency vs. availability).*
  3. *Good pacing — rarely paused or used filler words.*
- Amber-tinted **Areas to improve** card (`Target` icon, `Lightbulb` bullets):
  1. *Tighten time on open-ended questions — answers ran ~20% long.*
  2. *Use the STAR framework more explicitly for behavioural questions.*
  3. *Quantify impact with numbers where possible.*

### 10.5 Question-by-question feedback
Title: `Brain` icon + **"Question-by-question feedback"**. Mock data renders 3 cards. Each card contains:
- Mono eyebrow **"Question {i+1}"** + the question text + score pill (same `scoreTone`).
- **Your answer** block: mono eyebrow + the answer text.
- **AI feedback** block (muted bg, `XCircle` icon tinted by score band).
- **Ideal answer hint** block (primary tint, `Lightbulb` icon) — only when `ideal` is present.

Sample rows in mock:
1. *Explain the difference between SQL and NoSQL databases.* — 92 — *"Excellent — covered ACID vs BASE and gave a real use case."* — hint *"Mention CAP theorem tradeoffs and a concrete example per category."*
2. *How would you design a URL shortener?* — 84 — *"Solid high-level design. Missed discussing cache invalidation and analytics pipeline."*
3. *Tell me about a time you handled conflict on a team.* — 76 — *"Good story, but didn't quantify outcome. Use STAR more tightly."*

### 10.6 Footer actions
| Button | Effect |
| --- | --- |
| **Back to history** (outline) | → `/my-interviews` |
| **Start another interview** (primary) | → `/dashboard` |

---

## 11. Settings — `/settings`
File: `src/routes/settings.tsx`. Meta: `Account Settings · MockMate`.

### 11.1 Header
- Eyebrow: **ACCOUNT**.
- H1 (gradient primary→violet): **"Account Settings"**.
- Subtitle: **"Manage your profile and preferences."**
- `ThemeToggle` on the right.

### 11.2 Identity card
- Avatar tile = initials of `profile.name` (uppercase, max 2 letters) in a gradient square.
- Camera button bottom-right of the avatar → `toast("Avatar upload coming soon")`.
- Name + `Mail` icon + email.
- Plan pill (primary tint, `Sparkles`): **"{plan} plan"** (currently *Free plan*).

### 11.3 Tabs (underlined)
| Tab | Icon | Effect |
| --- | --- | --- |
| **Profile Info** | User | Shows Profile panel |
| **Resume** | FileText | Shows Resume panel |
| **Change Password** | KeyRound | Shows Password panel |
| **Danger Zone** | Shield (destructive tone) | Shows Danger panel |

### 11.4 Profile Info panel
Grid of `FieldRow`s — each label is a mono uppercase caption.

| Field | Control | Notes |
| --- | --- | --- |
| **Full name** | `Input` (maxLength 80) | Required for save |
| **Phone** | `Input type="tel"`, placeholder `+91 98765 43210`, maxLength 20 | |
| **Location** | `Input`, placeholder `City, Country` | |
| **Current role** | `Select` — *Select / Student / Fresher / Working Professional* | |
| **Target role** | `Input`, placeholder `Frontend Developer, Data Analyst, etc.` | |
| **Experience level** | `Select` — *Select / 0-1 year / 1-3 years / 3-5 years / 5+ years* | |
| **Skills** (spans 2 cols) | `Input` + **Add** button; existing chips with × buttons | Enter key triggers add. Duplicate → `toast.error("Skill already added")`. Pre-seeded: **React**, **Node.js**, **MongoDB**. |
| **Target company type** (spans 2) | `Select` with options *General IT Company (no preference) / Startup / MNC / FAANG / Government / Other (specify below)*; extra `Input` placeholder **"Enter company name (e.g., Google, Microsoft)"** appears when "Other" | |

| Button | Text | Effect |
| --- | --- | --- |
| **Save changes** (`Save`, `shadow-glow`) / **Saving…** | — | Requires non-empty name (else `toast.error("Name is required")`); 600 ms then `toast.success("Profile updated successfully!")` |

### 11.5 Resume panel
Two parts.

#### Parsed resume data (shown only after a successful upload)
Four `ParsedBlock` cards in a 2-column grid:
| Block | Empty-state text |
| --- | --- |
| **Extracted skills** | No skills extracted |
| **Experience** | No experience extracted |
| **Education** | No education extracted |
| **Projects** | No projects extracted |

Mock parse populates:
- Skills: *TypeScript · System Design · PostgreSQL* (emerald chips), merged into `profile.skills`.
- Experience: *Frontend Intern — Acme · 2024*; *Open-source contributor · 2023*.
- Education: *B.Tech CSE — VIT, 2026*.
- Projects: *MockMate — AI interviewer*; *Realtime chat app*.

Plus a link **"View uploaded resume (PDF)"** (`FileText`, opens `resumeUrl` in new tab).

#### Upload updated resume (dashed dropzone)
- Heading: **"Upload updated resume"**.
- Sub: **"Upload your latest resume (PDF) — AI will extract new skills and merge them with your existing ones."**
- Dropzone button content: `Upload` icon · **"Click to upload PDF"** · **"Only text-based PDFs are supported. Scanned PDFs will not parse correctly."** · **"Parsing resume…"** while loading.

| Effect | Trigger |
| --- | --- |
| Click dropzone | Opens hidden file input (`accept="application/pdf"`) |
| Non-PDF | `toast.error("Please upload a PDF file")` |
| Valid PDF | 900 ms simulated parse → merges skills, sets parsed data, `toast.success("Resume parsed successfully!")` |

### 11.6 Change Password panel
| Field | Control | Helper |
| --- | --- | --- |
| **Current password** | `Input type="password"` | — |
| **New password** | `Input type="password"` | **"Minimum 6 characters."** |
| **Confirm new password** | `Input type="password"` | — |

| Button | Text | Effect |
| --- | --- | --- |
| **Update password** (`KeyRound`, `shadow-glow`) / **Updating…** | — | Validations (in order): mismatch → *"New passwords do not match"*; length <6 → *"Password must be at least 6 characters"*; empty current → *"Enter your current password"*. Then 600 ms + `toast.success("Password changed successfully!")` and clears fields. |

### 11.7 Danger Zone panel
- H3 (destructive): **"Delete account"**.
- Body: **"Once you delete your account, all your interview data and progress will be permanently lost. This action cannot be undone."**

| Button | Text | Effect |
| --- | --- | --- |
| **Delete my account** (destructive, `Trash2`) | First click → button text becomes **"Click again to confirm"** and `toast("Click delete again to confirm", { description: "This action cannot be undone." })` | Second click within 4 s → 600 ms + `toast.success("Account deleted (demo).")`. Confirm state auto-resets after 4 s. |

### 11.8 Current plan footer card
- Eyebrow: **CURRENT PLAN**.
- Value: **"Free"** (primary). Sub: **"100 credits remaining"**.
- Button: **Upgrade plan** (outline, `Sparkles`) → `/upgrade`.

### 11.9 Back link
Centered text link **"Back to Dashboard"** (`ArrowLeft`) → `/dashboard`.

---

## 12. Upgrade — `/upgrade`
File: `src/routes/upgrade.tsx`. Meta: `Upgrade plan · MockMate`.

### Header
- Eyebrow: **BILLING**.
- H1: **"Upgrade your plan"**.
- Subtitle: **"You're currently on the Free plan. Unlock voice, video, and unlimited rounds."**
- `ThemeToggle` on the right.

### Cycle toggle (centered pill)
| Option | Text | Effect |
| --- | --- | --- |
| **monthly** | — | Uses `p.monthly` |
| **yearly** | — + **−17%** primary chip | Uses `Math.round(p.yearly / 12)` for the displayed monthly price |

### Plan cards (3 columns)
| Plan | Monthly | Yearly | Tagline | Features | CTA |
| --- | --- | --- | --- | --- | --- |
| **Free** | ₹0 | ₹0 | *Try MockMate, no card required.* | 100 credits / month · Text mode only · Basic feedback · 1 saved profile | **Stay on Free** (disabled when current plan = free) |
| **Pro** (highlighted, "Most popular" ribbon, `shadow-glow`) | ₹299 | ₹2 990 | *For serious interview prep.* | 1,500 credits / month · Text, Voice & Video modes · Detailed AI feedback + scores · Downloadable PDF reports · Unlimited profiles | **Upgrade to Pro** (`Zap`) |
| **Premium** | ₹599 | ₹5 990 | *Unlimited practice, top tier.* | Unlimited credits · All modes + face/voice analysis · Priority AI response time · Custom question banks · 1:1 mentor referral (quarterly) | **Upgrade to Premium** (`Zap`) |

| `choose(plan)` outcome | Text |
| --- | --- |
| Same as current plan | No-op (button shows **"Current plan"** and is disabled) |
| `free` selected from another plan | `toast("You're already on Free")` |
| `pro` / `premium` | `toast.success("Opening checkout…", { description: "{Plan} · {cycle}" })` |

### Footnote `Note` cards (2 × 2 grid)
| Title | Body |
| --- | --- |
| **Cancel anytime** | Plans renew automatically. Cancel from Settings → Billing — no questions asked. |
| **Secure payments** | Powered by Razorpay. Cards, UPI, and net-banking supported across India. |
| **Credits never expire** | Unused credits roll over while your subscription is active. |
| **Need a custom plan?** | Teams of 5+ get team dashboards and SSO. Reach us at team@mockmate.dev. |

Bottom microcopy (centered, `Sparkles` icon): **"All plans include a 7-day money-back guarantee."**

---

## 13. Design tokens

Defined in `src/styles.css` via Tailwind v4 `@theme` (OKLCH values, light + dark).

- **Surfaces**: `background`, `surface`, `card`, `popover`, `border`, `input`, `ring`.
- **Text**: `foreground`, `muted-foreground`.
- **Brand**: `primary`, `primary-foreground`, `primary-glow`, `accent`, `accent-foreground`.
- **Status**: `success`, `destructive`, `chart-1 … chart-5`.
- **Effects**: `shadow-elegant`, `shadow-glow`, `bg-mesh` (radial mesh), `bg-grid` (subtle grid), `text-gradient-primary`.
- **Status palettes** used inline for difficulty/score bands: `emerald`, `amber`, `rose`, `violet` (Tailwind defaults).

Hard rule: components never hardcode colors — every color is either a semantic token or one of those four status palettes used through Tailwind utilities, so light/dark theming and re-tinting stay coherent.
