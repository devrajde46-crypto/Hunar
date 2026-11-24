"use client";

import AppShell from "@/components/AppShell";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";

export default function TrainerDashboardPage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto w-full px-4 py-8">
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-blue text-ink">
                Trainer Portal
              </span>
            </div>
            <CardTitle as="h1">Welcome, Instructor {user?.first_name || user?.username}</CardTitle>
            <CardDescription>
              {user?.institution?.name || "Vocational Workshop"} • Trainee Review & Evaluation
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border border-card-border bg-cream/40 p-6 flex flex-col gap-3">
              <h4 className="font-display font-semibold text-base text-ink">
                Trainer Review Interface (Coming in Phase 3C/3D)
              </h4>
              <p className="text-sm text-muted">
                Your account is authenticated as an institutional instructor. The instructor video grading workbench, queue triage, and NCVT practical certification workflows will be enabled in the upcoming roadmap phases.
              </p>
              <div className="pt-2 text-xs text-muted">
                User ID: <span className="font-mono text-ink">{user?.id}</span> • Institution Code:{" "}
                <span className="font-mono text-ink">{user?.institution?.code}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
