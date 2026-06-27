import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5">
          <BrandMark />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Home
            </Link>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-10">
          <div className="w-full max-w-md">
            {eyebrow && (
              <div className="mb-3 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {eyebrow}
                </span>
              </div>
            )}
            <h1 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-sm text-center text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}

            <div className="mt-8 rounded-2xl border border-border/70 bg-card/70 p-6 shadow-elegant backdrop-blur-xl sm:p-8">
              {children}
            </div>

            {footer && (
              <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
            )}
          </div>
        </main>

        <footer className="px-6 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MockMate · Practice with confidence
        </footer>
      </div>
    </div>
  );
}
