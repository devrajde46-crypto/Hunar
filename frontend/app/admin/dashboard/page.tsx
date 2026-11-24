"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SafetyBadge from "@/components/SafetyBadge";
import PreviewBanner from "@/components/PreviewBanner";
import { SAMPLE_ADMIN_DASHBOARD } from "@/lib/mock/sample-admin";

/**
 * NOTE: Role-based UI visibility for institution admins (/admin/dashboard) is provided here
 * as a client-side convenience for UI testing. The backend must enforce authorization
 * in later phases.
 */
export default function InstitutionAdminDashboardPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<string>("30d");

  const showPreviewToast = (actionName: string) => {
    setToastMessage(`Not available in this preview (${actionName})`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const maxWeeklySubmissions = Math.max(
    ...SAMPLE_ADMIN_DASHBOARD.weeklyTrend.map((d) => d.submissionsCount)
  );

  return (
    <AppShell showPreviewBanner={true}>
      <PreviewBanner message="Preview: sample data, not saved" />

      {/* Floating preview notification toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2 border border-card-border animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-primary-blue inline-block"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Institution Header & Quick Actions */}
        <div className="bg-cream rounded-xl p-5 border border-card-border shadow-2xs flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-primary-blue text-xs font-bold uppercase tracking-wider">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Affiliated with {SAMPLE_ADMIN_DASHBOARD.affiliatedBoard} • Code: {SAMPLE_ADMIN_DASHBOARD.institutionCode}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              {SAMPLE_ADMIN_DASHBOARD.institutionName}
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Institutional Training Administration &amp; Practical Examination Logbook • Academic Year 2024-25 • Electrician &amp; Wireman Trades
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showPreviewToast("Generate NCVT Audit Pack")}
              className="text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Generate NCVT Audit Pack (PDF)</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => showPreviewToast("Export CSV")}
              className="text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export Report (CSV)</span>
            </Button>
          </div>
        </div>

        {/* Filter & Session Context Strip */}
        <div className="bg-white rounded-lg p-3 border border-card-border shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cream rounded border border-card-border text-ink font-medium">
              <span className="text-muted">Current Term:</span>
              <strong>Aug 2024 – Jul 2025</strong>
            </div>
            <span className="text-card-border">|</span>
            <button
              type="button"
              onClick={() => setActiveRange("30d")}
              className={`px-2.5 py-2 min-h-[44px] rounded text-xs font-semibold transition-colors ${
                activeRange === "30d"
                  ? "bg-primary-blue text-ink font-bold"
                  : "bg-cream text-muted hover:text-ink border border-card-border"
              }`}
            >
              Past 30 Days
            </button>
            <button
              type="button"
              onClick={() => setActiveRange("quarter")}
              className={`px-2.5 py-2 min-h-[44px] rounded text-xs font-semibold transition-colors ${
                activeRange === "quarter"
                  ? "bg-primary-blue text-ink font-bold"
                  : "bg-cream text-muted hover:text-ink border border-card-border"
              }`}
            >
              Past Quarter
            </button>
            <button
              type="button"
              onClick={() => setActiveRange("term")}
              className={`px-2.5 py-2 min-h-[44px] rounded text-xs font-semibold transition-colors ${
                activeRange === "term"
                  ? "bg-primary-blue text-ink font-bold"
                  : "bg-cream text-muted hover:text-ink border border-card-border"
              }`}
            >
              Entire Term
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5 text-status-verified font-medium">
              <span className="w-2 h-2 rounded-full bg-status-verified"></span>
              <span>Live Workshop Bench Rigs Active</span>
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Last Sync: 4 mins ago</span>
          </div>
        </div>

        {/* 4 Prominent Summary Metric Cards (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Trainees */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Active Trainees</span>
              <span className="w-8 h-8 rounded-lg bg-cream text-primary-blue flex items-center justify-center font-bold">
                👥
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-display font-bold text-ink">
                {SAMPLE_ADMIN_DASHBOARD.totalTrainees}
              </span>
              <span className="block text-xs font-semibold text-primary-blue mt-0.5">Enrolled Learners</span>
              <p className="text-xs text-muted mt-1">Across 4 Trades • {SAMPLE_ADMIN_DASHBOARD.activeInstructors} Active Instructors</p>
            </div>
          </Card>

          {/* Card 2: Bench Submissions */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Bench Submissions</span>
              <span className="w-8 h-8 rounded-lg bg-cream text-primary-blue flex items-center justify-center font-bold">
                📹
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-display font-bold text-ink">
                {SAMPLE_ADMIN_DASHBOARD.kpiMetrics.totalSubmissions}
              </span>
              <span className="block text-xs font-semibold text-primary-blue mt-0.5">Submissions Logged</span>
              <p className="text-xs text-muted mt-1">
                {SAMPLE_ADMIN_DASHBOARD.kpiMetrics.pendingTrainerReviews} Pending Instructor Review
              </p>
            </div>
          </Card>

          {/* Card 3: Safety Incident Rate */}
          <Card className="p-4 flex flex-col justify-between border-l-4 border-l-status-flagged">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-status-flagged uppercase tracking-wider">Safety Incident Rate</span>
              <span className="w-8 h-8 rounded-lg bg-red-50 text-status-flagged flex items-center justify-center font-bold">
                ⚠️
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-display font-bold text-status-flagged">
                {SAMPLE_ADMIN_DASHBOARD.kpiMetrics.safetyIncidentRate}%
              </span>
              <span className="block text-xs font-semibold text-status-flagged mt-0.5">Bench Interventions</span>
              <p className="text-xs text-muted mt-1">Zero Live Energization Incidents</p>
            </div>
          </Card>

          {/* Card 4: First-Time Pass Rate */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">First-Time Pass Rate</span>
              <span className="w-8 h-8 rounded-lg bg-green-50 text-status-verified flex items-center justify-center font-bold">
                ✓
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-display font-bold text-status-verified">
                {SAMPLE_ADMIN_DASHBOARD.kpiMetrics.firstTimePassRate}%
              </span>
              <span className="block text-xs font-semibold text-status-verified mt-0.5">Certified on Initial Try</span>
              <p className="text-xs text-muted mt-1">88.5% Post-Retest Competency</p>
            </div>
          </Card>
        </div>

        {/* Analytics Section: Weekly Submissions Trend + Results by Procedure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Submissions Per Week (5 Cols) */}
          <Card className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-lg font-bold text-ink">
                  Submissions Per Day
                </h2>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-cream border border-card-border text-muted">
                  Current Week
                </span>
              </div>
              <p className="text-xs text-muted">
                Volume of recorded bench wiring attempts reviewed by instructors.
              </p>
            </div>

            {/* Visual Pure CSS Vertical Bar Chart */}
            <div className="bg-cream rounded-lg p-4 border border-card-border space-y-3">
              <div
                className="h-44 flex items-end justify-between gap-2 px-1 relative"
                aria-label="Daily submissions volume bar chart"
                role="img"
              >
                {SAMPLE_ADMIN_DASHBOARD.weeklyTrend.map((day) => {
                  const heightPercent = Math.round((day.submissionsCount / maxWeeklySubmissions) * 100);
                  return (
                    <div
                      key={day.label}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
                    >
                      <span className="text-2xs font-bold text-ink">{day.submissionsCount}</span>
                      <div
                        className="w-full bg-primary-blue hover:bg-primary-blue/80 rounded-t transition-all"
                        style={{ height: `${heightPercent}%` }}
                        title={`${day.label}: ${day.submissionsCount} submissions, ${day.safetyFlagsCount} safety flags`}
                      ></div>
                      <span className="text-2xs text-muted font-medium">{day.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Accessible Text Alternative for Screen Readers */}
              <div className="sr-only">
                <h3>Daily submissions breakdown table:</h3>
                <ul>
                  {SAMPLE_ADMIN_DASHBOARD.weeklyTrend.map((day) => (
                    <li key={day.label}>
                      {day.label}: {day.submissionsCount} submissions, {day.safetyFlagsCount} safety flags
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trajectory Summary */}
              <div className="bg-white p-2.5 rounded border border-card-border text-xs text-ink flex items-start gap-1.5">
                <span className="text-status-verified font-bold">↑</span>
                <span>
                  <strong>Weekly Trend:</strong> Peak throughput on Friday ({SAMPLE_ADMIN_DASHBOARD.weeklyTrend[4].submissionsCount} submissions) with 97% first-run camera visibility.
                </span>
              </div>
            </div>
          </Card>

          {/* Chart 2: Procedure Performance Breakdown (7 Cols) */}
          <Card className="lg:col-span-7 p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-display text-lg font-bold text-ink">
                  Results by Procedure
                </h2>
                <div className="flex items-center gap-3 text-2xs text-muted">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-status-verified"></span> Pass Rate
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-status-flagged"></span> Safety Flags
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted">
                Assessment outcomes breakdown across core NCVT electrical training exercises.
              </p>
            </div>

            {/* Segmented Horizontal Bars / Breakdown List */}
            <div className="space-y-3">
              {SAMPLE_ADMIN_DASHBOARD.procedureBreakdown.map((proc) => (
                <div key={proc.code} className="bg-cream rounded-lg p-3 border border-card-border space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{proc.code}</span>
                      <span className="text-muted hidden sm:inline">•</span>
                      <span className="text-muted truncate max-w-xs">{proc.title}</span>
                    </div>
                    <span className="font-bold text-ink shrink-0">{proc.firstTimePassRate}% Pass</span>
                  </div>

                  {/* Horizontal Segmented Bar */}
                  <div
                    className="w-full h-3 rounded-full flex overflow-hidden bg-card-border"
                    aria-label={`${proc.title}: ${proc.firstTimePassRate}% pass rate, ${proc.safetyIncidentCount} safety incidents`}
                    role="img"
                  >
                    <div
                      className="h-full bg-status-verified"
                      style={{ width: `${proc.firstTimePassRate}%` }}
                    ></div>
                    <div
                      className="h-full bg-status-flagged"
                      style={{ width: `${Math.min(proc.safetyIncidentCount * 5, 20)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-2xs text-muted pt-0.5">
                    <span>{proc.submissionsCount} submissions • Avg {proc.avgDurationMinutes} mins</span>
                    {proc.safetyIncidentCount > 0 ? (
                      <span className="text-status-flagged font-semibold">
                        {proc.safetyIncidentCount} safety incident{proc.safetyIncidentCount === 1 ? "" : "s"} flagged
                      </span>
                    ) : (
                      <span className="text-status-verified font-medium">Zero safety incidents</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-cream rounded-lg p-2.5 border border-card-border text-xs text-muted flex items-center justify-between">
              <span>Consumer Unit &amp; MCB modules exhibit the highest concentration of safety flags. Focused trainer supervision assigned.</span>
              <span className="text-status-flagged font-bold shrink-0 ml-2">⚠️ Review</span>
            </div>
          </Card>
        </div>

        {/* Critical Error Checkpoints: Steps Learners Miss Most */}
        <Card className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-status-flagged text-xs font-bold uppercase tracking-wider mb-0.5">
                <span className="w-2 h-2 rounded-full bg-status-flagged inline-block"></span>
                <span>Safety Compliance Audit</span>
              </div>
              <h2 className="font-display text-lg font-bold text-ink">
                Critical Error Checkpoints: Steps Learners Miss Most
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Flagged failure points across active benches requiring physical instructor re-verification.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-status-flagged border border-red-200 rounded self-start sm:self-auto">
              Mandatory Physical Verification Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_ADMIN_DASHBOARD.criticalCheckpoints.map((cp) => (
              <div
                key={cp.stepName}
                className="bg-cream rounded-xl p-4 border border-card-border space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <SafetyBadge size="sm" />
                    <span className="text-xs font-bold text-status-flagged">{cp.failureRate}% Fail</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-ink pt-1">
                    {cp.stepName}
                  </h3>
                  <p className="text-xs text-muted">
                    <strong className="text-ink">Procedure:</strong> {cp.procedure}
                  </p>
                </div>

                <div className="bg-white p-2.5 rounded border border-card-border text-xs text-ink space-y-1">
                  <span className="font-semibold text-status-flagged block">Identified Hazard:</span>
                  <p className="text-xs text-muted">{cp.risk}</p>
                </div>

                <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden">
                  <div className="bg-status-flagged h-full rounded-full" style={{ width: `${cp.failureRate * 2}%` }}></div>
                </div>

                <span className="text-2xs text-muted">
                  System Action: Automatic hold • Physical instructor sign-off
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
