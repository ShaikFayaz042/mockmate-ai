import { Link } from "@tanstack/react-router";

export function BrandMark({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2">
      <span
        aria-hidden
        className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg"
        style={{ backgroundImage: "var(--gradient-primary)" }}
      >
        <span className="absolute inset-0 rounded-lg opacity-60 blur-md" style={{ backgroundImage: "var(--gradient-primary)" }} />
        <svg viewBox="0 0 24 24" className="relative h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18V7l4 6 4-6 4 6 4-6v11" />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-semibold tracking-tight text-foreground">
          MockMate<span className="text-primary">.</span>
        </span>
      )}
    </Link>
  );
}
