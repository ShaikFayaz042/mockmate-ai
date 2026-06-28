import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  FileText,
  KeyRound,
  Mail,
  Save,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings · MockMate" },
      { name: "description", content: "Manage your MockMate profile, resume, password, and account." },
    ],
  }),
  component: SettingsPage,
});

type TabKey = "profile" | "resume" | "password" | "danger";

const CURRENT_ROLES = ["Student", "Fresher", "Working Professional"];
const EXPERIENCE_LEVELS = ["0-1 year", "1-3 years", "3-5 years", "5+ years"];
const COMPANY_TYPES = [
  { value: "general",     label: "General IT Company (no preference)" },
  { value: "Startup",     label: "Startup" },
  { value: "MNC",         label: "MNC" },
  { value: "FAANG",       label: "FAANG" },
  { value: "Government",  label: "Government" },
  { value: "other",       label: "Other (specify below)" },
];

type ResumeParsed = {
  skills: string[];
  experience: string[];
  education: string[];
  projects: string[];
};

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "Fayaz Shaik",
    email: "fayaz@mockmate.dev",
    phone: "",
    location: "",
    currentRole: "",
    targetRole: "",
    experienceLevel: "",
    skills: ["React", "Node.js", "MongoDB"] as string[],
    skillInput: "",
    targetCompanyType: "general",
    customCompany: "",
  });
  const [resumeParsed, setResumeParsed] = useState<ResumeParsed | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  // Plan (mock)
  const plan = "Free";
  const creditsRemaining = 100;

  // ---- Profile actions ----
  const addSkill = () => {
    const skill = profile.skillInput.trim();
    if (!skill) return;
    if (profile.skills.includes(skill)) {
      toast.error("Skill already added");
      return;
    }
    setProfile({ ...profile, skills: [...profile.skills, skill], skillInput: "" });
  };
  const removeSkill = (skill: string) =>
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });

  const saveProfile = async () => {
    if (!profile.name.trim()) return toast.error("Name is required");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Profile updated successfully!");
  };

  // ---- Resume ----
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      e.target.value = "";
      return;
    }
    setUploadingResume(true);
    await new Promise((r) => setTimeout(r, 900));
    const mockParsed: ResumeParsed = {
      skills: ["TypeScript", "System Design", "PostgreSQL"],
      experience: ["Frontend Intern — Acme · 2024", "Open-source contributor · 2023"],
      education: ["B.Tech CSE — VIT, 2026"],
      projects: ["MockMate — AI interviewer", "Realtime chat app"],
    };
    const merged = Array.from(new Set([...profile.skills, ...mockParsed.skills]));
    setProfile((p) => ({ ...p, skills: merged }));
    setResumeParsed(mockParsed);
    setResumeUrl(`/uploads/${file.name}`);
    setUploadingResume(false);
    e.target.value = "";
    toast.success("Resume parsed successfully!");
  };

  // ---- Password ----
  const updatePassword = async () => {
    if (passwords.new !== passwords.confirm) return toast.error("New passwords do not match");
    if (passwords.new.length < 6) return toast.error("Password must be at least 6 characters");
    if (!passwords.current) return toast.error("Enter your current password");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setPasswords({ current: "", new: "", confirm: "" });
    toast.success("Password changed successfully!");
  };

  // ---- Delete ----
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      toast("Click delete again to confirm", { description: "This action cannot be undone." });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setConfirmDelete(false);
    toast.success("Account deleted (demo).");
  };
  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 4000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-mesh opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex w-full min-h-screen max-w-[1400px]">
        <AppSidebar active="settings" />

        <main className="flex-1 min-w-0 px-4 pt-20 pb-8 sm:px-8 sm:pt-10 sm:pb-10">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Account</p>
              <h1 className="mt-1 bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                Account Settings
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage your profile and preferences.</p>
            </div>
            <ThemeToggle />
          </div>

          {/* Identity card */}
          <section className="mb-6 flex flex-wrap items-center gap-5 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-elegant backdrop-blur-xl">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/20 text-lg font-semibold text-foreground ring-1 ring-border/60">
                {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <button
                onClick={() => toast("Avatar upload coming soon")}
                className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-elegant hover:text-foreground"
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold tracking-tight">{profile.name || "—"}</div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/20">
              <Sparkles className="h-3 w-3" /> {plan} plan
            </span>
          </section>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-1 border-b border-border/60">
            <Tab active={activeTab === "profile"}  onClick={() => setActiveTab("profile")}  icon={User}>Profile Info</Tab>
            <Tab active={activeTab === "resume"}   onClick={() => setActiveTab("resume")}   icon={FileText}>Resume</Tab>
            <Tab active={activeTab === "password"} onClick={() => setActiveTab("password")} icon={KeyRound}>Change Password</Tab>
            <Tab active={activeTab === "danger"}   onClick={() => setActiveTab("danger")}   icon={Shield} tone="destructive">Danger Zone</Tab>
          </div>

          {/* Profile */}
          {activeTab === "profile" && (
            <Panel>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldRow label="Full name">
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} maxLength={80} />
                </FieldRow>
                <FieldRow label="Phone">
                  <Input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} maxLength={20} placeholder="+91 98765 43210" />
                </FieldRow>
                <FieldRow label="Location">
                  <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} maxLength={80} placeholder="City, Country" />
                </FieldRow>
                <FieldRow label="Current role">
                  <Select value={profile.currentRole} onChange={(v) => setProfile({ ...profile, currentRole: v })} options={[{ value: "", label: "Select" }, ...CURRENT_ROLES.map((r) => ({ value: r, label: r }))]} />
                </FieldRow>
                <FieldRow label="Target role">
                  <Input value={profile.targetRole} onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })} maxLength={80} placeholder="Frontend Developer, Data Analyst, etc." />
                </FieldRow>
                <FieldRow label="Experience level">
                  <Select value={profile.experienceLevel} onChange={(v) => setProfile({ ...profile, experienceLevel: v })} options={[{ value: "", label: "Select" }, ...EXPERIENCE_LEVELS.map((r) => ({ value: r, label: r }))]} />
                </FieldRow>
                <FieldRow label="Skills" className="sm:col-span-2">
                  <div className="flex gap-2">
                    <Input
                      value={profile.skillInput}
                      onChange={(e) => setProfile({ ...profile, skillInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                      }}
                      placeholder="Add a skill…"
                      maxLength={40}
                    />
                    <Button onClick={addSkill} className="rounded-md">Add</Button>
                  </div>
                  {profile.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary ring-1 ring-inset ring-primary/20">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="rounded-full p-0.5 hover:bg-primary/20" aria-label={`Remove ${skill}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </FieldRow>
                <FieldRow label="Target company type" className="sm:col-span-2">
                  <Select
                    value={profile.targetCompanyType}
                    onChange={(v) => setProfile({ ...profile, targetCompanyType: v, customCompany: v === "other" ? profile.customCompany : "" })}
                    options={COMPANY_TYPES}
                  />
                  {profile.targetCompanyType === "other" && (
                    <Input
                      className="mt-2"
                      placeholder="Enter company name (e.g., Google, Microsoft)"
                      value={profile.customCompany}
                      onChange={(e) => setProfile({ ...profile, customCompany: e.target.value })}
                      maxLength={80}
                    />
                  )}
                </FieldRow>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={saveProfile} disabled={loading} className="rounded-full shadow-glow">
                  <Save className="mr-1.5 h-4 w-4" /> {loading ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </Panel>
          )}

          {/* Resume */}
          {activeTab === "resume" && (
            <Panel>
              {resumeParsed && (
                <div className="mb-6">
                  <h3 className="text-base font-semibold tracking-tight">Parsed resume data</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <ParsedBlock title="Extracted skills">
                      {resumeParsed.skills?.length ? (
                        <div className="flex flex-wrap gap-1.5">
                          {resumeParsed.skills.map((s, i) => (
                            <span key={i} className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-500 ring-1 ring-inset ring-emerald-500/20">{s}</span>
                          ))}
                        </div>
                      ) : <Empty>No skills extracted</Empty>}
                    </ParsedBlock>
                    <ParsedBlock title="Experience">
                      {resumeParsed.experience?.length ? (
                        <ul className="space-y-1">
                          {resumeParsed.experience.map((e, i) => <li key={i} className="rounded bg-background/60 p-2 text-sm">{e}</li>)}
                        </ul>
                      ) : <Empty>No experience extracted</Empty>}
                    </ParsedBlock>
                    <ParsedBlock title="Education">
                      {resumeParsed.education?.length ? (
                        <ul className="space-y-1">
                          {resumeParsed.education.map((e, i) => <li key={i} className="rounded bg-background/60 p-2 text-sm">{e}</li>)}
                        </ul>
                      ) : <Empty>No education extracted</Empty>}
                    </ParsedBlock>
                    <ParsedBlock title="Projects">
                      {resumeParsed.projects?.length ? (
                        <ul className="space-y-1">
                          {resumeParsed.projects.map((e, i) => <li key={i} className="rounded bg-background/60 p-2 text-sm">{e}</li>)}
                        </ul>
                      ) : <Empty>No projects extracted</Empty>}
                    </ParsedBlock>
                  </div>
                  {resumeUrl && (
                    <div className="mt-4">
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
                        <FileText className="h-4 w-4" /> View uploaded resume (PDF)
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className={cn("rounded-xl border bg-background/40 p-5", resumeParsed && "mt-2 border-t border-border/60 pt-6")}>
                <h3 className="text-base font-semibold tracking-tight">Upload updated resume</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload your latest resume (PDF) — AI will extract new skills and merge them with your existing ones.
                </p>
                <input ref={fileRef} type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingResume}
                  className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-background/30 px-6 py-10 text-center transition hover:border-primary/50 hover:bg-primary/5 disabled:opacity-60"
                >
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload PDF</p>
                  <p className="mt-1 text-xs text-muted-foreground">Only text-based PDFs are supported. Scanned PDFs will not parse correctly.</p>
                  {uploadingResume && <p className="mt-3 font-mono text-xs text-primary">Parsing resume…</p>}
                </button>
              </div>
            </Panel>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <Panel>
              <div className="grid gap-4 sm:max-w-md">
                <FieldRow label="Current password">
                  <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                </FieldRow>
                <FieldRow label="New password">
                  <Input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                  <p className="mt-1 text-xs text-muted-foreground">Minimum 6 characters.</p>
                </FieldRow>
                <FieldRow label="Confirm new password">
                  <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                </FieldRow>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={updatePassword} disabled={loading} className="rounded-full shadow-glow">
                  <KeyRound className="mr-1.5 h-4 w-4" /> {loading ? "Updating…" : "Update password"}
                </Button>
              </div>
            </Panel>
          )}

          {/* Danger */}
          {activeTab === "danger" && (
            <Panel tone="destructive">
              <h3 className="text-lg font-semibold tracking-tight text-destructive">Delete account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Once you delete your account, all your interview data and progress will be permanently lost. This action cannot be undone.
              </p>
              <div className="mt-5">
                <Button
                  variant="destructive"
                  onClick={deleteAccount}
                  disabled={loading}
                  className="rounded-full"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  {loading ? "Deleting…" : confirmDelete ? "Click again to confirm" : "Delete my account"}
                </Button>
              </div>
            </Panel>
          )}

          {/* Current plan footer card */}
          <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-elegant backdrop-blur-xl">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Current plan</p>
              <p className="mt-1 text-xl font-semibold tracking-tight text-primary">{plan}</p>
              <p className="text-xs text-muted-foreground">{creditsRemaining} credits remaining</p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/upgrade"><Sparkles className="mr-1.5 h-4 w-4" /> Upgrade plan</Link>
            </Button>
          </section>

          <div className="mt-6 text-center">
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
          </div>

          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}

// ===== Helpers =====

function Tab({
  children, active, onClick, icon: Icon, tone,
}: { children: React.ReactNode; active: boolean; onClick: () => void; icon: typeof User; tone?: "destructive" }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "-mb-px inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm transition",
        active
          ? tone === "destructive"
            ? "border-destructive text-destructive"
            : "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
  );
}

function Panel({ children, tone }: { children: React.ReactNode; tone?: "destructive" }) {
  return (
    <section
      className={cn(
        "rounded-2xl border bg-card/60 p-6 shadow-elegant backdrop-blur-xl sm:p-8",
        tone === "destructive" ? "border-destructive/30" : "border-border/60"
      )}
    >
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

function Select({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function ParsedBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4">
      <h4 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
