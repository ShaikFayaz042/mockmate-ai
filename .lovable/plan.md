
## Goal

Rebuild MockMate's **Landing page + Auth flow (Login, Signup, Forgot Password, Reset Password)** in this Lovable project as a polished design reference you can port back to your MERN repo by hand. Functionality is mocked — no real backend calls, no Google OAuth wiring — but every screen, state, and form layout from your source is preserved so the markup translates cleanly.

Aesthetic: **modern premium AI SaaS** — Vercel / Linear / Raycast register. Dark-first with a true light mode, dense type, generous whitespace, restrained motion.

## Design system

Set up once in `src/styles.css` and `src/routes/__root.tsx`, reused by every page.

- **Theme tokens** (OKLCH in `@theme inline`, mapped from `:root` and `.dark`):
  - Dark (default): near-black canvas `oklch(0.14 0.01 270)`, elevated surface `oklch(0.18 0.012 270)`, hairline border `oklch(0.28 0.015 270)`, primary violet `oklch(0.68 0.19 295)` with electric-blue glow `oklch(0.72 0.17 250)`.
  - Light: paper `oklch(0.99 0.005 270)`, surface `oklch(0.97 0.008 270)`, ink `oklch(0.18 0.01 270)`, same primary tuned for AA contrast.
  - Semantic: `--gradient-primary`, `--gradient-mesh` (subtle aurora), `--shadow-elegant`, `--shadow-glow`.
- **Typography**: Geist Sans (body/UI) + Geist Mono (numerics, eyebrows) via `<link>` in `__root.tsx` head — no remote `@import` in CSS. Tight tracking on display sizes, generous on captions.
- **Theme toggle**: `.dark` class on `<html>`, `@custom-variant dark (&:where(.dark, .dark *))` in `styles.css`, tiny `useTheme` hook persisting to `localStorage` (no `next-themes` dep). Sun/Moon icon button lives in the navbar.
- **Shared chrome**: `SiteNavbar` (logo, Features/How/Pricing anchors, theme toggle, Login / Get Started) and `SiteFooter` reused across landing + auth.

## Routes (file-based, TanStack)

```text
src/routes/
  __root.tsx          # head links (fonts, meta), ThemeProvider, <Outlet/>
  index.tsx           # Landing
  login.tsx           # Login
  signup.tsx          # Signup
  forgot-password.tsx # ForgotPassword
  reset-password.tsx  # ResetPassword (reads ?token=…)
```

Each route sets its own `head()` with unique `title` / `description` / `og:title` / `og:description`. Forms submit to local handlers that simulate success/error via toast (sonner) so flows feel real without a backend.

## Page-by-page

**Landing (`/`)** — preserves the section order from your `Landing.jsx`, rebuilt with the new system:
1. Hero — split layout, oversized display headline with gradient on "Real AI", subhead, dual CTA (Start free / Watch demo), trust row (Free • No card • Instant), social proof stats. Soft mesh-gradient + grid backdrop, no purple blob cliche.
2. Logo strip / "trusted by" placeholder row.
3. Why MockMate — 4-up feature grid (Personalized Questions, Confidence Score, Voice & Face Analysis, Download Report) as bento cards with icon chips.
4. How It Works — 3 numbered steps on a connector line.
5. Interview Modes — Text / Voice / Video cards, Video marked "Recommended" with subtle ring.
6. Pricing — Free / Pro / Premium (₹0 / ₹299 / ₹599) with "Most Popular" badge on Pro, matching your data verbatim.
7. Final CTA band + Footer.

**Login (`/login`)** — centered card on aurora backdrop, email + password, "Continue with Google" button (visual only), forgot-password link, link to signup. Field-level validation, loading state on submit, error toast on mock failure.

**Signup (`/signup`)** — same shell as login; name + email + password + confirm password, terms checkbox, password strength meter, Google button, link to login.

**Forgot Password (`/forgot-password`)** — single email field, success state swaps the form for a "Check your inbox" confirmation card with a resend link.

**Reset Password (`/reset-password`)** — reads `?token=` from search params (mock-validated), new password + confirm, strength meter, success state redirects to `/login` with a toast.

## Tech notes

- Stack stays TanStack Start + React 19 + TS + Tailwind v4. No `tailwind.config.js`, no `@tailwind` directives — tokens go in `@theme inline` inside `src/styles.css`.
- shadcn primitives already in the template: `Button`, `Input`, `Label`, `Card`, `Checkbox`, plus `sonner` for toasts. Add `lucide-react` icons (already present) for the toggle and field icons.
- No business-logic changes, no DB, no auth wiring. All submits are local mocks behind 600ms timers so the UI states (idle / loading / success / error) are real and reviewable.
- A small fix lands alongside the redesign: the current `src/routes/index.tsx` is the blank-template placeholder, which is what's causing the preview's dynamic-import error you're seeing — replacing it with the real Landing route resolves it.

## Build order

1. Theme tokens + fonts + `.dark` variant + `useTheme` hook + shared `SiteNavbar` / `SiteFooter` / `ThemeToggle`.
2. Landing (`/`).
3. Login + Signup.
4. Forgot Password + Reset Password.

After this lands you review in the preview, then we move on to Dashboard and Interview Room in a follow-up pass.
