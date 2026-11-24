"use client";

import AppShell from "@/components/AppShell";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { useAuth } from "@/lib/auth-context";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto w-full px-4 py-8">
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-blue text-ink">
                Administration
              </span>
            </div>
            <CardTitle as="h1">Institution Administrator Portal</CardTitle>
            <CardDescription>
              {user?.institution?.name || "Institution"} • Workshop & Cohort Management
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border border-card-border bg-cream/40 p-6 flex flex-col gap-3">
              <h4 className="font-display font-semibold text-base text-ink">
                Institutional Admin Dashboard (Coming in Phase 4)
              </h4>
              <p className="text-sm text-muted">
                Welcome, {user?.first_name || user?.username}. You have administrative privileges for {user?.institution?.name || "your institution"}. Analytical throughput metrics, cohort audit logs, and trainer assignments will be configured here.
              </p>
              <div className="pt-2 text-xs text-muted">
                Admin User: <span className="font-mono text-ink">{user?.username}</span> • Role:{" "}
                <span className="font-mono text-ink">{user?.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
