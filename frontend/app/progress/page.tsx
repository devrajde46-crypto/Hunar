"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusChip from "@/components/StatusChip";
import SafetyBadge from "@/components/SafetyBadge";
import PreviewBanner from "@/components/PreviewBanner";
import { SAMPLE_LEARNER_PROGRESS } from "@/lib/mock/sample-progress";

/**
 * NOTE: Role-based UI visibility (/progress for learners) is provided
 * here as a client-side routing convenience for UI testing.
 * The backend security layer must enforce strict role authorization on
 * all learner endpoints in later phases.
 */
export default function LearnerProgressPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showPreviewToast = (actionName: string) => {
    setToastMessage(`Not available in this preview (${actionName})`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const filteredProcedures = SAMPLE_LEARNER_PROGRESS.procedures.filter((proc) => {
    if (filter === "COMPETENT") return proc.status === "Competent";
    if (filter === "NEEDS_PRACTICE") return proc.status === "Needs practice";
    if (filter === "IN_PROGRESS") return proc.status === "Processing";
    return true;
  });

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

      <div className="max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Top Trainee Meta Context Bar */}
        <div className="bg-cream rounded-xl p-4 sm:p-5 border border-card-border shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-primary-blue text-ink text-2xs font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                CTS Apprenticeship
              </span>
              <span className="text-xs text-muted font-medium">
                {SAMPLE_LEARNER_PROGRESS.tradeName}
              </span>
              <span className="text-muted text-xs hidden sm:inline">•</span>
              <span className="text-xs text-ink font-semibold">
                Trainee ID: {SAMPLE_LEARNER_PROGRESS.traineeId}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted text-xs">
              <svg className="w-4 h-4 text-primary-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{SAMPLE_LEARNER_PROGRESS.institutionName} • NCVT Craftsmen Training Scheme Curriculum</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => showPreviewToast("NCVT Summary PDF")}
              className="text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>NCVT Summary (PDF)</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => showPreviewToast("Logbook Export")}
              className="text-xs flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>Logbook Export</span>
            </Button>
          </div>
        </div>

        {/* Page Title & Active Cycle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-card-border pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-muted text-xs uppercase tracking-wider mb-1">
              <span>Trainee Assessment</span>
              <span>/</span>
              <span className="text-primary-blue font-semibold">Practical Logbook</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Learner Progress &amp; Competency Log
            </h1>
          </div>
          <div className="bg-cream px-3 py-1.5 rounded-lg border border-card-border flex items-center gap-2 self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-status-verified inline-block"></span>
            <span className="text-xs font-semibold text-ink">Active Cycle: Term 1 Domestic Wiring</span>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Competent */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Trainer Verified</span>
              <span className="w-8 h-8 rounded-lg bg-green-50 text-status-verified flex items-center justify-center font-bold">
                ✓
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-display font-bold text-ink">
                  {SAMPLE_LEARNER_PROGRESS.summaryStats.competentCount}
                </span>
                <span className="text-xs text-muted font-medium">/ {SAMPLE_LEARNER_PROGRESS.summaryStats.totalProcedures} Procedures</span>
              </div>
              <p className="text-xs text-muted mt-1">Ready for Physical Practical Test</p>
            </div>
            <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-status-verified h-full rounded-full transition-all"
                style={{
                  width: `${(SAMPLE_LEARNER_PROGRESS.summaryStats.competentCount / SAMPLE_LEARNER_PROGRESS.summaryStats.totalProcedures) * 100}%`,
                }}
              ></div>
            </div>
          </Card>

          {/* Card 2: Needs Practice */}
          <Card className="p-4 flex flex-col justify-between border-l-4 border-l-status-flagged">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-status-flagged uppercase tracking-wider">Needs Practice</span>
              <span className="w-8 h-8 rounded-lg bg-red-50 text-status-flagged flex items-center justify-center font-bold">
                !
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-display font-bold text-status-flagged">
                  {SAMPLE_LEARNER_PROGRESS.summaryStats.needsPracticeCount}
                </span>
                <span className="text-xs text-muted font-medium">Active Retries</span>
              </div>
              <p className="text-xs text-status-flagged mt-1 font-medium">1 Critical Safety Termination Flag</p>
            </div>
            <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-status-flagged h-full rounded-full"
                style={{
                  width: `${(SAMPLE_LEARNER_PROGRESS.summaryStats.needsPracticeCount / SAMPLE_LEARNER_PROGRESS.summaryStats.totalProcedures) * 100}%`,
                }}
              ></div>
            </div>
          </Card>

          {/* Card 3: In Progress */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">In Progress</span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-primary-blue flex items-center justify-center font-bold">
                ⏳
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-display font-bold text-ink">
                  {SAMPLE_LEARNER_PROGRESS.summaryStats.inProgressCount}
                </span>
                <span className="text-xs text-muted font-medium">Under Review</span>
              </div>
              <p className="text-xs text-muted mt-1">AI pre-scored, awaiting trainer physical check</p>
            </div>
            <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-primary-blue h-full rounded-full"
                style={{
                  width: `${(SAMPLE_LEARNER_PROGRESS.summaryStats.inProgressCount / SAMPLE_LEARNER_PROGRESS.summaryStats.totalProcedures) * 100}%`,
                }}
              ></div>
            </div>
          </Card>

          {/* Card 4: Overall Pass Rate */}
          <Card className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Pass Velocity</span>
              <span className="w-8 h-8 rounded-lg bg-cream text-ink flex items-center justify-center font-bold">
                📈
              </span>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-display font-bold text-ink">
                  {SAMPLE_LEARNER_PROGRESS.summaryStats.overallPassRate}%
                </span>
                <span className="text-xs text-muted font-medium">First-Time</span>
              </div>
              <p className="text-xs text-muted mt-1">80% Post-Retest Pass Velocity</p>
            </div>
            <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className="bg-primary-blue h-full rounded-full"
                style={{ width: `${SAMPLE_LEARNER_PROGRESS.summaryStats.overallPassRate}%` }}
              ></div>
            </div>
          </Card>
        </div>

        {/* Diagnostic Split Grid: Weakest Steps + Evaluation History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Diagnostic Alert: Weakest Steps (7 cols) */}
          <Card className="lg:col-span-7 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-card-border pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-status-flagged text-xs font-bold uppercase tracking-wider mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-status-flagged inline-block"></span>
                  <span>Diagnostic Attention Required</span>
                </div>
                <h2 className="font-display text-lg font-bold text-ink">
                  Weakest Steps &amp; Common Failure Points
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Aggregated from AI initial detection and verified workshop instructor reviews.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 text-status-flagged border border-red-200 rounded shrink-0">
                {SAMPLE_LEARNER_PROGRESS.weakestSteps.length} Critical Checkpoints
              </span>
            </div>

            <div className="space-y-3">
              {SAMPLE_LEARNER_PROGRESS.weakestSteps.map((weakStep) => (
                <div
                  key={weakStep.stepCode}
                  className={`rounded-lg p-3.5 space-y-2 border ${
                    weakStep.isSafetyCritical
                      ? "border-l-4 border-l-status-flagged border-red-200 bg-red-50/30"
                      : "border-card-border bg-cream"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {weakStep.isSafetyCritical ? (
                        <SafetyBadge size="sm" />
                      ) : (
                        <span className="text-2xs font-bold uppercase px-2 py-0.5 bg-card-border text-ink rounded">
                          Mechanical Quality
                        </span>
                      )}
                      <span className="text-xs font-bold text-ink">
                        {weakStep.stepTitle}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-status-flagged">
                      {weakStep.failureRatePercentage}% Failure Rate
                    </span>
                  </div>

                  <div className="text-xs text-muted">
                    <span className="font-semibold text-ink">Procedure:</span> {weakStep.procedureTitle} ({weakStep.stepCode})
                  </div>

                  <div className="bg-white p-2.5 rounded border border-card-border text-xs text-ink">
                    <span className="font-semibold text-status-flagged">Common Mistake:</span>{" "}
                    {weakStep.commonMistake}
                  </div>

                  <div className="flex justify-end pt-1">
                    <Link
                      href="/practice/upload"
                      className="text-xs font-bold text-primary-blue hover:underline inline-flex items-center gap-1"
                    >
                      <span>Practice This Procedure</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trend Chart: Evaluation History (5 cols) */}
          <Card className="lg:col-span-5 p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-card-border pb-3">
              <div>
                <span className="text-2xs font-bold text-muted uppercase tracking-wider">Evaluation History</span>
                <h2 className="font-display text-lg font-bold text-ink">
                  Reviewed Results Over Time
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Bi-weekly practical checks across past 8 weeks.
                </p>
              </div>
              <span className="text-xs font-semibold text-muted bg-cream px-2 py-1 rounded border border-card-border">
                Past 5 Sessions
              </span>
            </div>

            {/* Pure CSS Accessible Bar Chart */}
            <div className="bg-cream rounded-lg p-4 border border-card-border space-y-3">
              <div className="h-44 w-full flex items-end justify-between px-2 pt-6 pb-2 relative" aria-label="Bi-weekly review pass scores chart" role="img">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-x-2 top-6 h-px bg-card-border/60"></div>
                <div className="absolute inset-x-2 top-20 h-px bg-card-border/60"></div>
                <div className="absolute inset-x-2 top-34 h-px bg-card-border/60"></div>

                {/* Session 1 */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-1/5">
                  <span className="text-2xs font-semibold text-muted">50%</span>
                  <div className="w-8 bg-card-border/40 rounded-t flex flex-col justify-end items-center h-24">
                    <div className="w-full bg-primary-blue/60 h-12 rounded-t"></div>
                  </div>
                  <span className="text-2xs text-muted font-medium">28 Jun</span>
                </div>

                {/* Session 2 */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-1/5">
                  <span className="text-2xs font-bold text-status-flagged">Safety!</span>
                  <div className="w-8 bg-card-border/40 rounded-t flex flex-col justify-end items-center h-24">
                    <div className="w-full bg-status-flagged h-14 rounded-t"></div>
                  </div>
                  <span className="text-2xs text-muted font-medium">12 Jul</span>
                </div>

                {/* Session 3 */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-1/5">
                  <span className="text-2xs font-semibold text-muted">70%</span>
                  <div className="w-8 bg-card-border/40 rounded-t flex flex-col justify-end items-center h-24">
                    <div className="w-full bg-primary-blue/70 h-16 rounded-t"></div>
                  </div>
                  <span className="text-2xs text-muted font-medium">26 Jul</span>
                </div>

                {/* Session 4 */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-1/5">
                  <span className="text-2xs font-semibold text-muted">85%</span>
                  <div className="w-8 bg-card-border/40 rounded-t flex flex-col justify-end items-center h-24">
                    <div className="w-full bg-primary-blue h-20 rounded-t"></div>
                  </div>
                  <span className="text-2xs text-muted font-medium">09 Aug</span>
                </div>

                {/* Session 5 */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-1/5">
                  <span className="text-2xs font-bold text-status-verified">100%</span>
                  <div className="w-8 bg-card-border/40 rounded-t flex flex-col justify-end items-center h-24">
                    <div className="w-full bg-status-verified h-24 rounded-t"></div>
                  </div>
                  <span className="text-2xs text-ink font-bold">14 Aug</span>
                </div>
              </div>

              {/* Accessible Text Alternative for Screen Readers */}
              <div className="sr-only">
                <h3>Bi-weekly Evaluation Scores Table:</h3>
                <ul>
                  <li>28 Jun: 50% score (Initial attempt)</li>
                  <li>12 Jul: Terminated due to safety flag on phase conductor</li>
                  <li>26 Jul: 70% score (Post-remediation)</li>
                  <li>09 Aug: 85% score (Competent)</li>
                  <li>14 Aug: 100% score (Trainer verified sign-off)</li>
                </ul>
              </div>

              {/* Trajectory description */}
              <div className="bg-white p-3 rounded border border-card-border text-xs text-ink">
                <span className="font-semibold text-primary-blue">Trajectory:</span> Steady progression across conduit &amp; domestic modules with 1 active safety alert on bare conductor exposure.
              </div>
            </div>

            {/* Quick Legend */}
            <div className="space-y-1.5 text-xs text-muted border-t border-card-border pt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-status-verified"></span>
                  <span>Fully Competent (Sign-off)</span>
                </div>
                <span className="font-semibold text-ink">4 Sessions</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary-blue"></span>
                  <span>Needs Retest / Practice</span>
                </div>
                <span className="font-semibold text-ink">1 Session</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-status-flagged"></span>
                  <span>Critical Safety Flag</span>
                </div>
                <span className="font-semibold text-ink">1 Session</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Procedures Competency Catalog */}
        <Card className="p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-4">
            <div>
              <span className="text-2xs font-bold text-muted uppercase tracking-wider">CTS Curriculum Module 03</span>
              <h2 className="font-display text-xl font-bold text-ink">
                Practical Procedure Competency Log
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter procedures">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`text-xs font-semibold px-3 py-2 min-h-[44px] rounded-lg border transition-colors whitespace-nowrap ${
                  filter === "ALL"
                    ? "bg-primary-blue text-ink border-primary-blue font-bold"
                    : "bg-cream text-muted border-card-border hover:text-ink"
                }`}
              >
                All ({SAMPLE_LEARNER_PROGRESS.procedures.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("COMPETENT")}
                className={`text-xs font-semibold px-3 py-2 min-h-[44px] rounded-lg border transition-colors whitespace-nowrap ${
                  filter === "COMPETENT"
                    ? "bg-primary-blue text-ink border-primary-blue font-bold"
                    : "bg-cream text-muted border-card-border hover:text-ink"
                }`}
              >
                Competent ({SAMPLE_LEARNER_PROGRESS.summaryStats.competentCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("NEEDS_PRACTICE")}
                className={`text-xs font-semibold px-3 py-2 min-h-[44px] rounded-lg border transition-colors whitespace-nowrap ${
                  filter === "NEEDS_PRACTICE"
                    ? "bg-primary-blue text-ink border-primary-blue font-bold"
                    : "bg-cream text-muted border-card-border hover:text-ink"
                }`}
              >
                Needs Practice ({SAMPLE_LEARNER_PROGRESS.summaryStats.needsPracticeCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("IN_PROGRESS")}
                className={`text-xs font-semibold px-3 py-2 min-h-[44px] rounded-lg border transition-colors whitespace-nowrap ${
                  filter === "IN_PROGRESS"
                    ? "bg-primary-blue text-ink border-primary-blue font-bold"
                    : "bg-cream text-muted border-card-border hover:text-ink"
                }`}
              >
                In Progress ({SAMPLE_LEARNER_PROGRESS.summaryStats.inProgressCount})
              </button>
            </div>
          </div>

          {/* Procedures List */}
          <div className="space-y-3">
            {filteredProcedures.map((proc) => (
              <div
                key={proc.procedureCode}
                className="bg-cream rounded-xl p-4 border border-card-border shadow-2xs hover:border-muted transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xs font-bold text-muted bg-white border border-card-border px-2 py-0.5 rounded">
                        {proc.procedureCode}
                      </span>
                      <span className="text-muted text-xs">•</span>
                      <span className="text-2xs font-semibold text-muted bg-white border border-card-border px-2 py-0.5 rounded uppercase">
                        {proc.difficulty}
                      </span>
                      <span className="text-muted text-xs">•</span>
                      <span className="text-xs text-muted">
                        {proc.attemptsCount} {proc.attemptsCount === 1 ? "attempt" : "attempts"}
                      </span>
                      {proc.hasSafetyCriticalSteps && (
                        <>
                          <span className="text-muted text-xs">•</span>
                          <SafetyBadge size="sm" />
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-ink">
                      {proc.procedureTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusChip status={proc.status} size="sm" />
                    {proc.bestScorePercentage > 0 && (
                      <span className="text-xs font-bold text-ink bg-white border border-card-border px-2.5 py-1 rounded">
                        {proc.bestScorePercentage}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-card-border/60 text-xs">
                  <span className="text-muted">
                    Last practiced on {proc.lastPracticedDate}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/submissions/sub-001"
                      className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded border border-card-border bg-white hover:bg-cream transition-colors"
                    >
                      View Feedback Card
                    </Link>
                    <Link
                      href={`/practice/upload?procedure=${proc.procedureCode}`}
                      className="text-xs font-semibold text-ink bg-primary-blue hover:bg-[#7fa5d8] px-3 py-2 min-h-[44px] rounded transition-colors inline-flex items-center gap-1"
                    >
                      <span>Practice Again</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {filteredProcedures.length === 0 && (
              <div className="py-8 text-center text-muted text-sm bg-cream rounded-lg border border-card-border">
                No procedures found for this status filter.
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
