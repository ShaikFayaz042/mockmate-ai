# MockMate — UI Reference

A page-by-page reference of every screen in the redesigned MockMate frontend: what each section is, the visible copy, and the elements that render. Use it as a spec when porting the design back to the MERN client.

Stack: TanStack Start (React 19) · TanStack Router file-based routing · Tailwind v4 (CSS-first tokens, OKLCH palette) · shadcn/ui · lucide-react icons.

---

## 0. Global shell

### Site navbar (`src/components/site-navbar.tsx`)
Used on the marketing pages (landing, auth).
- Brand: **MockMate** logo + wordmark, links to `/`.
- Nav links (desktop): **Features**, **Modes**, **How it works**, **Pricing** — anchor-scroll on the landing page.
- Right side: **Log in** (ghost) → `/login`, **Start free** (primary, rounded) → `/signup`.

### App sidebar (`src/components/app-sidebar.tsx`)
Used on every authenticated route (`/dashboard`, `/my-interviews`, `/settings`, `/upgrade`).
- Brand block at top.
- Primary nav: **Dashboard**, **My Interviews**, **Settings**, **Upgrade**.
- Footer: user chip (avatar + email), theme toggle, **Log out**.
- Reports are intentionally **not** in the sidebar — they open only from the interview history.

### Site footer (`src/components/site-footer.tsx`)
Brand, three link columns (Product / Company / Legal), and a copyright line.

### Theme
Light + dark via CSS variables in `src/styles.css`. Toggle persists to `localStorage`. All color usage is via semantic tokens (`bg-background`, `text-foreground`, `border-border`, `text-gradient-primary`, `shadow-glow`, `shadow-elegant`, `bg-mesh`, `bg-grid`, …) — never raw hex.

---

## 1. Landing — `/` (`src/routes/index.tsx`)

### Hero
- Eyebrow pill: small dot + **"Now with realtime voice mode"**.
- H1: **"Interviews that feel real."** + gradient line **"Feedback that moves the needle."**
- Subhead: "MockMate is your personal AI interviewer. Practice in text, voice, or video — and walk away with the exact reps and feedback you need to land the offer."
- CTAs: **Start free** (→ `/signup`, with arrow icon), **How it works** (anchor to `#how`).
- Microcopy: "No credit card · 3 free interviews · Cancel anytime".

### Preview card (mock app window)
- Mac-style traffic-light dots + URL stub `mockmate.app · interview · senior-frontend`.
- Left: **Interviewer** message ("Walk me through how you'd design a real-time collaborative editor…") and a **You** reply bubble (CRDT answer stub).
- Right column: small score chips (placeholder feedback widgets).

### Features (`#features`)
Section title **"Features"**. 6 cards, each with icon + title + body:
1. **Adaptive interviewer** — Brain icon.
2. **Detailed feedback** — LineChart icon.
3. **Target-role tuned** — Target icon.
4. **Private by default** — ShieldCheck icon.
5. **Fast, low-latency** — Zap icon.
6. **Beautiful history** — Sparkles icon.

### Modes (`#modes`)
Section title **"Modes"**. 3 cards: **Text** (MessageSquare, tag *Most popular*), **Voice** (Mic, tag *Realistic*), **Video** (Video, tag *Experimental*).

### How it works (`#how`)
4-step numbered list: **01 Build your profile → 02 Pick a mode → 03 Interview live → 04 Get feedback**.

### Pricing (`#pricing`)
3 plan cards:
- **Free** · ₹0 forever — 3 interviews/mo, Text mode, basic feedback, 7-day history. CTA **Start free**.
- **Pro** · ₹499/month (highlighted) — Unlimited text & voice, detailed scoring, full history, role-tuned. CTA **Go Pro**.
- **Premium** · ₹999/month — Everything in Pro + Video, priority models, exportable reports. CTA **Go Premium**.

### Final CTA + footer
"Be ready by Sunday." block with **Start free** button, then site footer.

---

## 2. Auth pages

All four use the `AuthShell` (split screen, marketing copy on the left, form on the right).

### Login — `/login` (`src/routes/login.tsx`)
- Heading: "Welcome back".
- Fields: **Email**, **Password** (with show/hide).
- Links: **Forgot password?** → `/forgot-password`.
- Submit: **Log in**. Divider "or continue with". **Continue with Google** button.
- Footer link: "No account yet? **Sign up**" → `/signup`.

### Signup — `/signup` (`src/routes/signup.tsx`)
- Heading: "Create your account".
- Fields: **Full name**, **Email**, **Password**.
- Submit: **Create account**. Google OAuth button.
- Footer link: "I have an account" → `/login`.

### Forgot password — `/forgot-password`
- Heading + helper text.
- Field: **Email**. Submit: **Send reset link**. Back-to-login link.

### Reset password — `/reset-password`
- Fields: **New password**, **Confirm password**. Submit: **Reset password**.

---

## 3. Dashboard — `/dashboard` (`src/routes/dashboard.tsx`)

Layout: `AppSidebar` + main column.

### Top bar
- Title **"Dashboard"** + subtitle "Pick up where you left off, or start a fresh round."
- Right: credits chip (e.g. `12 credits`), **Upgrade** button → `/upgrade`. If credits = 0, inline warning **"Insufficient credits — upgrade to continue."**

### Stats row
Four glow cards: Interviews taken · Average score · Streak · Credits remaining.

### Customize your interview (workbench, 2 columns)

**Left column — "Customize your interview"** with helper *"Configure your session parameters for optimal performance."*

1. **Mode** — 3 large tiles with distinct effects:
   - **Text** (MessageSquare icon, neutral).
   - **Voice** (Mic icon, pinging ring when active).
   - **Video** (Video icon, pulsing red **REC** dot when active, tagged *Experimental*).
2. **Domain category** — grid of tactile category cards (e.g. Frontend, Backend, System Design, DSA, Behavioral, PM…) with hover glow + active border.
3. **Difficulty level** — 3 chips with status dots and color themes:
   - **Easy** (emerald), **Medium** (amber), **Hard** (rose).
4. **Question count** — 6 preset chips: **5 · 8 · 10 · 12 · 15 · 20**.
5. **Timer mode** — single toggle switch with dynamic helper text:
   - Off → **"Time based (AI per-question)"** — AI sets a timer per question.
   - On  → **"Normal (fixed total time)"** — one fixed timer for the whole session.

**Right column — sticky "Session architecture"**
Live summary of the chosen mode / category / difficulty / question count / timer mode, plus a small cost-of-credits line. Primary **Start interview** button (disabled when no credits). Clicking it navigates to `/interview/$id` with the config as search params.

### Recent interviews
Table with columns **Date · Type · Mode · Questions · Score** and a per-row action. Empty state below if there are none.

---

## 4. My Interviews — `/my-interviews` (`src/routes/my-interviews.tsx`)

- Header: **"My interviews"** + subtitle **"History"**.
- Filter row: search input + mode filter + difficulty filter + sort.
- Desktop table columns: **Date · Type · Mode · Questions · Duration · Score** + **View report** action.
- Mobile: tap a row to open its report.
- Empty state: **"No interviews match these filters."**
- All rows link to `/report/$id`.

---

## 5. Interview Room — `/interview/$id` (`src/routes/interview.$id.tsx`)

Full-viewport, non-scrolling room (`h-screen overflow-hidden`). Validates search params (`mode`, `category`, `difficulty`, `questions`, `timer`).

### Header (single row)
- Left: brand + small breadcrumb (mode · category · difficulty).
- Right: **Q 1 / 10** progress chip, live timer, **Pause** and **End session** buttons.
- Thin progress bar under the header.

### Center stage — varies by mode
- **Text mode** — Question card on the right (compact, top-right), large answer textarea center-stage, **Submit** + **Skip** buttons.
- **Voice mode** — Dual-orb interface:
  - **Interviewer orb** (violet, left): concentric ripple rings, pings while AI speaks, label *Speaking… / Listening*.
  - **You orb** (emerald, right): tap to record, becomes a `MicOff` glow when active, 5-dot equalizer + *Recording* label.
  - Compact question chip in a corner; live transcript strip.
- **Video mode** — Side-by-side tiles:
  - **Left**: AI Interviewer tile with the uploaded avatar image (`object-cover object-top`), MockMate AI label, live status pill, glowing animated bot indicator.
  - **Right**: user camera tile (or **"Camera is off"** placeholder), REC dot when recording, mic / camera / end controls.

### Modals
- **Session paused** — resume / end.
- **End interview?** — confirm + cancel; on confirm, route to report.

---

## 6. Report — `/report/$id` (`src/routes/report.$id.tsx`)

Opened only from My Interviews (not from sidebar).

- Header: interview meta (date, mode, category, difficulty) + **Share** and **Download PDF** actions.
- **Overall** ring score (big circular gauge).
- **Score breakdown** — sub-scores: Technical depth · Communication · Problem-solving (and similar) as bars.
- **Strengths** — green-tinted list of what went well.
- **Areas to improve** — amber/rose-tinted list of concrete fixes.
- **Question-by-question feedback** — per-question cards, each with:
  - The question.
  - **Your answer** (transcript / typed text).
  - **AI feedback** (color-coded notes).
  - **Ideal answer hint** (collapsible).
- Bottom CTA: **Start another interview** → `/dashboard`.

---

## 7. Settings — `/settings` (`src/routes/settings.tsx`)

- Header: **"Settings"** + subtitle **"Manage your profile and preferences."**
- Tabbed layout: **Account**, **Profile Info**, **Resume**, **Change Password**, **Danger Zone**.

### Account
Email, joined date, current plan chip (**Current plan**), link to **Upgrade**.

### Profile Info
- Full name, target role, experience level, target company types (chips).
- **Skills** — chip input with **Add** button; chips are removable.
- Save button.

### Resume
- Upload zone: **"Click to upload PDF"** with hint **"Only text-based PDFs are supported. Scanned PDFs will not parse correctly."**
- While processing: **"Parsing resume…"** spinner.
- After parse: **"Parsed resume data"** block with sub-sections — empty states: **"No skills extracted"**, **"No experience extracted"**, **"No education extracted"**, **"No projects extracted"**.
- **Upload updated resume** button to replace.

### Change Password
Current password, new password, confirm. Helper: **"Minimum 6 characters."**

### Danger Zone
Red-bordered card with two-step **Delete account** confirmation (type-to-confirm).

### Appearance
Theme toggle (System / Light / Dark).

---

## 8. Upgrade — `/upgrade` (`src/routes/upgrade.tsx`)

- Header: **"Upgrade your plan"** + **Billing** sub-label, current plan chip (e.g. **Free**).
- Three plan cards matching the landing pricing block (Free / Pro / Premium) with the same feature lists.
- Each card has a CTA — current plan shows *Current plan* (disabled), others trigger the Razorpay flow in the real app.
- Below: FAQ / billing notes.

---

## 9. Route map

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Marketing landing |
| `/login` | `src/routes/login.tsx` | Sign in |
| `/signup` | `src/routes/signup.tsx` | Create account |
| `/forgot-password` | `src/routes/forgot-password.tsx` | Request reset |
| `/reset-password` | `src/routes/reset-password.tsx` | Set new password |
| `/dashboard` | `src/routes/dashboard.tsx` | Stats + interview workbench |
| `/my-interviews` | `src/routes/my-interviews.tsx` | History & filters |
| `/interview/$id` | `src/routes/interview.$id.tsx` | Live interview room (text / voice / video) |
| `/report/$id` | `src/routes/report.$id.tsx` | Detailed per-interview report |
| `/settings` | `src/routes/settings.tsx` | Profile, resume, password, danger zone |
| `/upgrade` | `src/routes/upgrade.tsx` | Plans & billing |

---

## 10. Design tokens (quick reference)

Defined in `src/styles.css` via Tailwind v4 `@theme`:
- Surfaces: `background`, `surface`, `card`, `popover`, `border`, `input`, `ring`.
- Text: `foreground`, `muted-foreground`.
- Brand: `primary`, `primary-foreground`, `accent`, `accent-foreground`.
- Status: `success`, `destructive`, `chart-1…chart-5`.
- Effects: `shadow-elegant`, `shadow-glow`, `bg-mesh`, `bg-grid`, `text-gradient-primary`.

Rule: never hardcode colors in components — always use these tokens so light/dark mode and future re-theming stay consistent.
