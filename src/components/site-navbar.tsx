import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#modes", label: "Modes" },
  { href: "#pricing", label: "Pricing" },
];

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthed } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2 transition-all duration-300 ${
          scrolled
            ? "border-border/70 bg-background/70 backdrop-blur-xl shadow-elegant"
            : "border-transparent bg-transparent"
        }`}
      >
        <BrandMark />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthed ? (
            <Button asChild size="sm" className="hidden sm:inline-flex rounded-full shadow-glow">
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex rounded-full shadow-glow">
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-background/95 p-4 shadow-elegant backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1 rounded-full">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="flex-1 rounded-full">
                <Link to="/signup">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
