import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in · MockMate" },
      { name: "description", content: "Log in to MockMate and continue practicing." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const fakeLogin = (e?: FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const mail = email || "demo@mockmate.ai";
      const name = mail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      login({ name, email: mail });
      setLoading(false);
      toast.success("Signed in", { description: "Welcome back to MockMate." });
      navigate({ to: "/" });
    }, 500);
  };

  const onSubmit = fakeLogin;


  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to MockMate"
      subtitle="Pick up where you left off — your history and feedback are waiting."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-foreground hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Button variant="outline" className="w-full rounded-lg" onClick={() => fakeLogin()}>
        <GoogleGlyph /> Continue with Google
      </Button>

      <Divider />

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required placeholder="you@work.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot?
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full rounded-lg shadow-glow" disabled={loading}>
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="mr-1 h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c6.9 0 9.2-4.8 9.2-7.3 0-.5 0-.9-.1-1.3H12z" />
    </svg>
  );
}
