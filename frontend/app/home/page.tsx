"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import Button from "@/components/Button";
import DraftNotice from "@/components/DraftNotice";
import { useAuth } from "@/lib/auth-context";
import { courseApi } from "@/lib/api";
import { Procedure } from "@/lib/types";

export default function LearnerHomePage() {
  const { user } = useAuth();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    courseApi
      .getProcedures()
      .then((res) => {
        if (isMounted) {
          setProcedures(res.results || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to load course procedures. Please verify your connection.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || "Trainee";

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Welcome Banner Card */}
        <div className="rounded-2xl border border-card-border bg-white p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-cream border border-card-border text-muted">
                  Electrical Craftsmanship
                </span>
                <span className="text-2xs text-muted font-medium font-mono">
                  {user?.trainee_id_number ? `Roll: ${user.trainee_id_number}` : ""}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
                Welcome Back, {displayName}
              </h1>
              {user?.institution?.name && (
                <p className="text-xs sm:text-sm text-muted mt-1">
                  {user.institution.name}
                </p>
              )}
            </div>

            <Link href="/procedures">
              <Button variant="primary" size="md" className="font-bold shrink-0">
                <span>View All Procedures</span>
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>

        {/* Competency & Submissions Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competency Summary (Empty state - no fake numbers) */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Competency Summary</CardTitle>
              <CardDescription>Verified step mastery across practical wiring units</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-dashed border-card-border bg-cream/40 p-6 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cream border border-card-border flex items-center justify-center text-muted mb-2">
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-ink">No assessments yet</p>
                <p className="text-xs text-muted max-w-xs mt-1">
                  Complete your first hands-on workbench exercise and submit recorded video footage to establish your competency score.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions (Empty state - no fake numbers) */}
          <Card padding="md">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Recent practice attempts and instructor verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-dashed border-card-border bg-cream/40 p-6 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cream border border-card-border flex items-center justify-center text-muted mb-2">
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-ink">No submissions yet</p>
                <p className="text-xs text-muted max-w-xs mt-1">
                  Select a procedure from the catalog below to record and upload your first practice attempt.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Procedures Catalog Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Workshop Procedures</h2>
              <p className="text-xs sm:text-sm text-muted">
                Curriculum practical wiring exercises
              </p>
            </div>
            <Link
              href="/procedures"
              className="text-xs sm:text-sm font-semibold text-link-blue hover:underline"
            >
              Browse catalog →
            </Link>
          </div>

          {/* DraftNotice must stay until a trainer-approved flag exists in the data */}
          <DraftNotice className="mb-4" />

          {/* Loading State */}
          {isLoading && (
            <div className="rounded-xl border border-card-border bg-white p-12 text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-medium text-muted">Loading curriculum procedures...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="rounded-xl border border-safety-red bg-red-50 p-6 text-center">
              <p className="text-sm font-semibold text-safety-red">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-1.5 text-xs font-semibold rounded-lg bg-white border border-card-border text-ink hover:bg-cream"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && procedures.length === 0 && (
            <div className="rounded-xl border border-card-border bg-white p-12 text-center">
              <p className="text-sm font-semibold text-ink">No procedures available</p>
              <p className="text-xs text-muted mt-1">
                Your institution has not published active workshop procedures yet.
              </p>
            </div>
          )}

          {/* Procedure List Grid */}
          {!isLoading && !error && procedures.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {procedures.map((proc) => {
                const code = proc.procedure_code || proc.id;

                return (
                  <Card key={proc.id} padding="md" className="hover:border-link-blue/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-2xs font-bold text-muted bg-cream border border-card-border px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                          {proc.procedure_code || "PROC"}
                        </span>
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-link-blue border border-blue-200 whitespace-nowrap shrink-0">
                            {proc.difficulty}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-display text-base font-bold text-ink leading-snug">
                        {proc.title}
                      </h3>

                      {proc.description && (
                        <p className="text-xs text-muted line-clamp-2 mt-1.5">
                          {proc.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-xs text-muted">
                      <div className="flex items-center gap-3 flex-wrap">
                        {proc.estimated_duration_minutes ? (
                          <span className="flex items-center gap-1 whitespace-nowrap shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{proc.estimated_duration_minutes} mins</span>
                          </span>
                        ) : null}
                        {typeof proc.total_steps === "number" && (
                          <span className="flex items-center gap-1 whitespace-nowrap shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>{proc.total_steps} steps</span>
                          </span>
                        )}
                        {typeof proc.safety_critical_steps_count === "number" &&
                          proc.safety_critical_steps_count > 0 && (
                            <span className="text-xs text-muted whitespace-nowrap shrink-0">
                              • {proc.safety_critical_steps_count}{" "}
                              {proc.safety_critical_steps_count === 1
                                ? "safety-critical step"
                                : "safety-critical steps"}
                            </span>
                          )}
                      </div>

                      <Link
                        href={`/procedures/${code}`}
                        className="font-semibold text-link-blue hover:underline inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                      >
                        <span>Start</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
