## Goal
Remove the range-slider control from the customize section and replace it with a more tactile "number of questions" picker that matches the monolithic dark-glass aesthetic.

## Changes (scoped to `src/routes/dashboard.tsx`, customize section only)

1. **Drop the slider block entirely** — the `<input type="range">`, the duration/Q live readout, and the 15m/30m/45m/60m tick row.
2. **Drop the duration concept** from this control — "Time-based vs Question count" toggle stays, but both modes share the same question-count value (time-based simply means the AI paces each question; count-based means strict N questions). This matches the original MERN behavior (`isTimeBased` flag + `questionCount`).
3. **Replace with a preset chip grid** for question count:
   - Presets: **5 · 8 · 10 · 12 · 15 · 20**
   - Rendered as a 3-col (mobile) / 6-col (desktop) grid of square-ish chips
   - Selected chip: filled `bg-muted` + `border-primary/50` + small primary dot in the corner (same selected-state language as the category cards)
   - Idle chip: `bg-card/40 border-border/60` with hover lift
   - Each chip shows the number large, with a tiny "questions" label underneath in mono
4. **Section label** changes from "Duration" to **"Question count"** with the selected value echoed on the right in mono (e.g. `10 Q`).
5. Keep `questionCount` state, `Segmented` toggle, category cards, difficulty, and CTA untouched.

## Visual spec (preset chip)

```
┌──────────────┐
│      10      │   ← text-2xl font-semibold
│   QUESTIONS  │   ← font-mono text-[10px] muted
└──────────────┘
```

Selected chip gets the same `ring-1 ring-primary/30 shadow-glow` treatment as the active category card so the design language stays consistent.

## Out of scope
- Stats cards, recent interviews table, sidebar — untouched.
- No new files, no new dependencies.