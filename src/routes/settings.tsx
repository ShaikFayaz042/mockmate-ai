import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  Briefcase,
  Camera,
  Check,
  KeyRound,
  Mail,
  Monitor,
  Moon,
  Save,
  Shield,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · MockMate" },
      { name: "description", content: "Manage your MockMate account, profile, appearance, and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  targetRole: z.string().trim().max(80).optional(),
  experience: z.string().trim().max(40).optional(),
  skills: z.string().trim().max(240).optional(),
  bio: z.string().trim().max(280).optional(),
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState({
    name: "Fayaz Shaik",
    email: "fayaz@mockmate.dev",
    targetRole: "Full-stack Engineer",
    experience: "2 years",
    skills: "React, Node.js, MongoDB, System Design",
    bio: "Final year CS student preparing for SDE-1 roles.",
  });
  const [saving, setSaving] = useState(false);

  const [notif, setNotif] = useState({
    productUpdates: true,
    interviewReminders: true,
    weeklyReport: false,
    marketing: false,
  });

  const handleSave = async () => {
    const parsed = profileSchema.safeParse(profile);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Profile updated");
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px]">
        <AppSidebar active="settings" />

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Account</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your profile, appearance, and notifications.</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button onClick={handleSave} disabled={saving} className="rounded-full shadow-glow">
                <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Section nav */}
            <nav className="sticky top-6 hidden h-fit flex-col gap-1 rounded-2xl border border-border/60 bg-card/60 p-2 text-sm shadow-elegant backdrop-blur-xl lg:flex">
              <SectionLink href="#account" icon={User} label="Account" />
              <SectionLink href="#profile" icon={Briefcase} label="Interview profile" />
              <SectionLink href="#appearance" icon={Monitor} label="Appearance" />
              <SectionLink href="#notifications" icon={Bell} label="Notifications" />
              <SectionLink href="#security" icon={Shield} label="Security" />
              <SectionLink href="#danger" icon={Trash2} label="Danger zone" />
            </nav>

            <div className="space-y-6">
              {/* Account */}
              <Card id="account" title="Account" desc="Your public identity on MockMate." icon={User}>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/20 text-xl font-semibold text-foreground ring-1 ring-border/60">
                      {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <button
                      onClick={() => toast("Upload coming soon")}
                      className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-elegant hover:text-foreground"
                      aria-label="Change avatar"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold tracking-tight">{profile.name}</div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" /> {profile.email}
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/20">
                      <Check className="h-3 w-3" /> Pro plan
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <FieldRow label="Full name">
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      maxLength={80}
                    />
                  </FieldRow>
                  <FieldRow label="Email">
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      maxLength={255}
                    />
                  </FieldRow>
                </div>
              </Card>

              {/* Profile */}
              <Card id="profile" title="Interview profile" desc="Helps the AI tailor questions to your goals." icon={Briefcase}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldRow label="Target role">
                    <Input
                      value={profile.targetRole}
                      onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                      placeholder="e.g. Frontend Engineer"
                      maxLength={80}
                    />
                  </FieldRow>
                  <FieldRow label="Experience">
                    <Input
                      value={profile.experience}
                      onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                      placeholder="e.g. 3 years"
                      maxLength={40}
                    />
                  </FieldRow>
                  <FieldRow label="Skills" className="sm:col-span-2">
                    <Input
                      value={profile.skills}
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                      placeholder="Comma-separated"
                      maxLength={240}
                    />
                  </FieldRow>
                  <FieldRow label="Short bio" className="sm:col-span-2">
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      maxLength={280}
                      placeholder="One or two sentences about you."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
                      {profile.bio?.length ?? 0}/280
                    </div>
                  </FieldRow>
                </div>
              </Card>

              {/* Appearance */}
              <Card id="appearance" title="Appearance" desc="Pick the theme that suits your eyes." icon={Monitor}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ThemeOption label="Light" active={theme === "light"} onClick={() => setTheme("light")} icon={Sun} />
                  <ThemeOption label="Dark"  active={theme === "dark"}  onClick={() => setTheme("dark")}  icon={Moon} />
                </div>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Density</p>
                <div className="mt-2 inline-flex rounded-full border border-border/70 bg-muted/40 p-1">
                  {["Comfortable", "Compact"].map((d, i) => (
                    <button
                      key={d}
                      onClick={() => toast(`Density: ${d}`)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition",
                        i === 0 ? "bg-background text-foreground shadow-elegant" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Notifications */}
              <Card id="notifications" title="Notifications" desc="Choose what lands in your inbox." icon={Bell}>
                <div className="divide-y divide-border/40">
                  <ToggleRow
                    label="Product updates"
                    desc="New features, modes, and improvements."
                    checked={notif.productUpdates}
                    onChange={(v) => setNotif({ ...notif, productUpdates: v })}
                  />
                  <ToggleRow
                    label="Interview reminders"
                    desc="Nudges to keep your practice streak alive."
                    checked={notif.interviewReminders}
                    onChange={(v) => setNotif({ ...notif, interviewReminders: v })}
                  />
                  <ToggleRow
                    label="Weekly report"
                    desc="A summary of your scores every Monday."
                    checked={notif.weeklyReport}
                    onChange={(v) => setNotif({ ...notif, weeklyReport: v })}
                  />
                  <ToggleRow
                    label="Marketing emails"
                    desc="Occasional offers and announcements."
                    checked={notif.marketing}
                    onChange={(v) => setNotif({ ...notif, marketing: v })}
                  />
                </div>
              </Card>

              {/* Security */}
              <Card id="security" title="Security" desc="Keep your account locked down." icon={Shield}>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
                  <div>
                    <div className="text-sm font-medium">Password</div>
                    <div className="text-xs text-muted-foreground">Last changed 3 months ago</div>
                  </div>
                  <Button variant="outline" className="rounded-full" onClick={() => toast("Password reset email sent")}>
                    <KeyRound className="mr-1.5 h-4 w-4" /> Change password
                  </Button>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
                  <div>
                    <div className="text-sm font-medium">Two-factor authentication</div>
                    <div className="text-xs text-muted-foreground">Add an extra step at sign in.</div>
                  </div>
                  <Button variant="outline" className="rounded-full" onClick={() => toast("2FA setup coming soon")}>
                    Enable 2FA
                  </Button>
                </div>
              </Card>

              {/* Danger */}
              <Card id="danger" title="Danger zone" desc="Irreversible actions on your account." icon={Trash2} tone="destructive">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                  <div>
                    <div className="text-sm font-medium">Delete account</div>
                    <div className="text-xs text-muted-foreground">Permanently remove your account and all interview history.</div>
                  </div>
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => toast.error("Account deletion is disabled in demo")}
                  >
                    Delete account
                  </Button>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="rounded-full shadow-glow">
                  <Save className="mr-1.5 h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>

              <div className="h-10" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Card({
  id, title, desc, icon: Icon, tone, children,
}: {
  id: string; title: string; desc: string; icon: typeof User;
  tone?: "destructive"; children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 rounded-2xl border bg-card/60 p-6 shadow-elegant backdrop-blur-xl sm:p-8",
        tone === "destructive" ? "border-destructive/30" : "border-border/60"
      )}
    >
      <div className="mb-5 flex items-start gap-3">
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl ring-1",
          tone === "destructive"
            ? "bg-destructive/10 text-destructive ring-destructive/20"
            : "bg-primary/10 text-primary ring-primary/20"
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function FieldRow({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SectionLink({ href, icon: Icon, label }: { href: string; icon: typeof User; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
    >
      <Icon className="h-4 w-4" /> {label}
    </a>
  );
}

function ThemeOption({
  label, active, onClick, icon: Icon,
}: { label: string; active: boolean; onClick: () => void; icon: typeof Sun }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border p-4 text-left transition",
        active
          ? "border-primary/60 bg-primary/5 shadow-glow"
          : "border-border/60 bg-background/40 hover:border-border hover:bg-muted/40"
      )}
    >
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
        active ? "bg-primary/10 text-primary ring-primary/20" : "bg-muted text-muted-foreground ring-border/60"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{label === "System" ? "Match your OS" : `Always ${label.toLowerCase()}`}</div>
      </div>
      {active && <Check className="ml-auto h-4 w-4 text-primary" />}
    </button>
  );
}

function ToggleRow({
  label, desc, checked, onChange,
}: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted ring-1 ring-inset ring-border/60"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
