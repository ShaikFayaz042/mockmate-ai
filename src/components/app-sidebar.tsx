import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Coins,
  History,
  Home,
  LogOut,
  Menu,
  Settings,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type SidebarKey = "dashboard" | "interviews" | "settings" | "upgrade";

const ITEMS: { key: SidebarKey; label: string; to: string; icon: typeof Home }[] = [
  { key: "dashboard",  label: "Dashboard",     to: "/dashboard",      icon: BarChart3 },
  { key: "interviews", label: "My interviews", to: "/my-interviews",  icon: History },
  { key: "settings",   label: "Settings",      to: "/settings",       icon: Settings },
  { key: "upgrade",    label: "Upgrade plan",  to: "/upgrade",        icon: Sparkles },
];

function NavBody({
  active,
  credits,
  onNavigate,
}: {
  active: SidebarKey;
  credits: number;
  onNavigate?: () => void;
}) {
  return (
    <>
      <BrandMark />
      <nav className="mt-10 flex flex-col gap-1 text-sm">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
        >
          <Home className="h-4 w-4" /> Home
        </Link>
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const isActive = it.key === active;
          return (
            <Link
              key={it.key}
              to={it.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" /> {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3">
        <div className="rounded-xl border border-border/60 bg-card/60 p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Coins className="h-3.5 w-3.5" /> Credits
          </div>
          <div className="mt-1 font-mono text-lg font-semibold">{credits}</div>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="mt-2 w-full rounded-lg"
            onClick={onNavigate}
          >
            <Link to="/upgrade">Top up</Link>
          </Button>
        </div>
        <button
          onClick={() => {
            toast("Logged out (demo)");
            onNavigate?.();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </>
  );
}

export function AppSidebar({ active, credits = 320 }: { active: SidebarKey; credits?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobile trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 top-4 z-40 rounded-full border-border/60 bg-background/80 backdrop-blur-xl lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-72 flex-col border-l border-border/60 bg-background/95 px-5 py-6 backdrop-blur-xl">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <NavBody active={active} credits={credits} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-background/60 px-5 py-6 backdrop-blur-xl lg:flex">
        <NavBody active={active} credits={credits} />
      </aside>
    </>
  );
}
