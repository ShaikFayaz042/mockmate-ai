import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset password · MockMate" }],
  }),
  component: ResetPage,
});

function ResetPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password updated (demo)");
    }, 700);
  };

  return (
    <AuthShell
      eyebrow="Almost there"
      title="Set a new password"
      subtitle="Pick something memorable — at least 8 characters."
      footer={
        <Link to="/login" className="font-medium text-foreground hover:underline">
          Back to log in
        </Link>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" required placeholder="At least 8 characters" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type="password" required placeholder="Repeat password" />
        </div>
        <Button type="submit" className="w-full rounded-lg shadow-glow" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}
