"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import Button from "@/components/Button";
import StatusChip from "@/components/StatusChip";
import SafetyBadge from "@/components/SafetyBadge";
import PreviewBanner from "@/components/PreviewBanner";
import { SAMPLE_SUBMISSION_FEEDBACK } from "@/lib/mock/sample-submissions";

/**
 * NOTE: Role-based UI visibility (/review/[id] for trainers) is provided
 * here as a client-side convenience for UI demonstration.
 * The backend security layer must enforce strict trainer role authorization
 * on all grading and score override APIs in later phases.
 */
function TrainerReviewDetailContent() {
  const params = useParams();
  const rawId = params?.id;
  const submissionId = Array.isArray(rawId) ? rawId[0] : rawId || "sub-2026-0889";

  const feedback = {
    ...SAMPLE_SUBMISSION_FEEDBACK,
    id: submissionId,
  };

  const [activeStep, setActiveStep] = useState<number>(3);
  const [playbackSpeed, setPlaybackSpeed] = useState<string>("1.0x");
  const [trainerOverrides, setTrainerOverrides] = useState<Record<number, string>>({
    3: "fail",
  });
  const [officialGrade, setOfficialGrade] = useState<string>("retest");
  const [trainerComments, setTrainerComments] = useState<string>(
    feedback.trainerReview?.comments || ""
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = () => {
    // Review and submit buttons do nothing except show a message "Not available in this preview"
    setToastMessage("Not available in this preview");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleOverride = (stepNumber: number, verdict: string) => {
    setTrainerOverrides((prev) => ({
      ...prev,
      [stepNumber]: verdict,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-16 right-4 z-50 bg-ink text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 border border-card-border animate-fade-in"
        >
          <svg className="w-4 h-4 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-muted">
        <Link href="/review" className="hover:text-ink font-semibold text-link-blue">
          ← Back to Review Queue
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink font-mono">{submissionId}</span>
        <span>/</span>
        <span className="text-muted">Instructor Evaluation</span>
      </nav>

      {/* Header Info Banner */}
      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-ink bg-cream border border-card-border px-2.5 py-1 rounded-md">
              {feedback.procedureCode}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-blue text-ink">
              Trainer Evaluation Session
            </span>
            <StatusChip status="Safety issue" size="sm" />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted font-mono">
            <span>Submitted: {feedback.submittedAt}</span>
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            {feedback.procedureTitle}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Trainee: <span className="font-semibold text-ink">{feedback.learnerName}</span> • Roll:{" "}
            <span className="font-mono text-ink">{feedback.traineeId}</span> • AI Pre-Score: {feedback.overallScore}%
          </p>
        </div>
      </div>

      {/* Dual-Pane Layout: Video Player + Step Rubric */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Video Evidence Mockup Player */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-card-border bg-ink text-white overflow-hidden shadow-xs relative aspect-video flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-xs text-white/80 z-10">
              <span className="font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                Active Step Bookmark: 0{activeStep}
              </span>
              <span className="text-2xs text-white/60">Trainee Video Evidence</span>
            </div>

            <div className="my-auto flex flex-col items-center justify-center text-center p-4">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-primary-blue mb-2">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-white">Workbench Recording Stream</p>
              <p className="text-xs text-white/70 max-w-sm mt-1">
                Playback speed, timeline seek, and defect zoom will connect to the video streaming service in Phase 3C.
              </p>
            </div>

            {/* Playback Controls & Speed Toggle */}
            <div className="space-y-2 z-10 bg-black/60 p-2.5 rounded-xl backdrop-blur-xs">
              <div className="flex items-center justify-between text-2xs text-white/80 font-mono">
                <span>02:15 / 05:45</span>
                <div className="flex items-center gap-1.5">
                  {["0.5x", "1.0x", "1.5x"].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-1.5 py-0.5 rounded text-2xs transition-colors ${
                        playbackSpeed === speed
                          ? "bg-primary-blue text-ink font-bold"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden relative">
                <div className="bg-primary-blue h-full w-[40%]" />
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-safety-red"
                  style={{ left: "38%" }}
                  title="Flagged defect moment at 02:15"
                />
              </div>
            </div>
          </div>

          {/* Jump to Bookmark Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Step bookmarks">
            <span className="text-xs font-semibold text-muted mr-1 shrink-0">Bookmarks:</span>
            {feedback.steps.map((step) => (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setActiveStep(step.stepNumber)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors select-none shrink-0 ${
                  activeStep === step.stepNumber
                    ? "bg-ink text-white"
                    : step.safetyViolated
                    ? "bg-red-100 text-safety-red border border-red-300"
                    : "bg-white border border-card-border text-muted hover:text-ink"
                }`}
              >
                Step {step.stepNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: Step Rubric & Trainer Override */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-1">
            <h2 className="font-display text-lg font-bold text-ink">
              Step-by-Step Scoring Rubric
            </h2>
            <span className="text-2xs text-muted">
              Click Pass/Fail to override AI verdict
            </span>
          </div>

          {feedback.steps.map((step) => {
            const currentOverride = trainerOverrides[step.stepNumber];
            return (
              <div
                key={step.stepNumber}
                className={`rounded-xl border bg-white p-4 shadow-2xs space-y-2.5 ${
                  activeStep === step.stepNumber ? "ring-2 ring-primary-blue" : "border-card-border"
                } ${step.safetyViolated ? "border-l-4 border-l-safety-red" : ""}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cream border border-card-border flex items-center justify-center font-bold text-xs text-ink font-mono">
                      {step.stepNumber}
                    </span>
                    <h3 className="font-display text-sm font-bold text-ink">
                      {step.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {step.isSafetyCritical && <SafetyBadge size="sm" />}
                    <StatusChip
                      status={step.safetyViolated ? "Safety issue" : step.passed ? "Competent" : "Needs practice"}
                      size="sm"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  {step.feedback}
                </p>

                {step.detectedErrorTag && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-safety-red font-mono font-bold text-2xs border border-red-200">
                    <span>Tag: {step.detectedErrorTag}</span>
                  </div>
                )}

                {/* Trainer Override Toggle Buttons */}
                <div className="pt-2 border-t border-card-border flex items-center justify-between gap-2">
                  <span className="text-2xs font-semibold text-muted">Trainer Verdict:</span>
                  <div className="flex items-center gap-1" role="group" aria-label="Trainer override">
                    <button
                      type="button"
                      onClick={() => toggleOverride(step.stepNumber, "pass")}
                      className={`px-2.5 py-1 rounded-md text-2xs font-bold transition-colors ${
                        currentOverride === "pass"
                          ? "bg-emerald-600 text-white"
                          : "bg-white border border-card-border text-muted hover:bg-cream"
                      }`}
                    >
                      Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleOverride(step.stepNumber, "fail")}
                      className={`px-2.5 py-1 rounded-md text-2xs font-bold transition-colors ${
                        currentOverride === "fail"
                          ? "bg-safety-red text-white"
                          : "bg-white border border-card-border text-muted hover:bg-cream"
                      }`}
                    >
                      Needs Practice
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleOverride(step.stepNumber, "inconclusive")}
                      className={`px-2.5 py-1 rounded-md text-2xs font-bold transition-colors ${
                        currentOverride === "inconclusive"
                          ? "bg-amber-600 text-white"
                          : "bg-white border border-card-border text-muted hover:bg-cream"
                      }`}
                    >
                      Inconclusive
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Assessment & Final Endorsement Form */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle>Official Assessment &amp; Final Grade Endorsement</CardTitle>
          <CardDescription>
            Certified vocational instructor verdict and logbook endorsement
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-bold text-ink block mb-2">
              Overall Practical Endorsement:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Competent (Passed)", value: "competent" },
                { label: "Needs Practice (Bay Re-test)", value: "retest" },
                { label: "Safety Violation Detected", value: "violation" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
                    officialGrade === opt.value
                      ? "bg-cream border-link-blue"
                      : "bg-white border-card-border hover:bg-cream/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="officialGrade"
                    value={opt.value}
                    checked={officialGrade === opt.value}
                    onChange={(e) => setOfficialGrade(e.target.value)}
                    className="h-4 w-4 text-link-blue focus:ring-link-blue cursor-pointer"
                  />
                  <span className="text-xs font-bold text-ink">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="trainer-comments" className="text-xs font-bold text-ink block">
              Official Instructor Feedback &amp; Trainee Guidance:
            </label>
            <textarea
              id="trainer-comments"
              rows={3}
              value={trainerComments}
              onChange={(e) => setTrainerComments(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
            />
          </div>

          {/* Audit Trail Note */}
          <div className="rounded-xl border border-card-border bg-cream/40 p-3.5 text-xs text-muted flex items-start gap-2.5">
            <svg className="w-4 h-4 text-link-blue shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p>
              <strong className="text-ink">Institutional Audit Record:</strong> Human instructor validation governs all practical certifications. Physical isolation testing is mandatory prior to live energization.
            </p>
          </div>

          {/* Action Button Group */}
          <div className="pt-4 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={handleAction}
              className="w-full sm:w-auto text-xs"
            >
              Request Bay Re-test
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="md"
                onClick={handleAction}
                className="w-full sm:w-auto text-xs"
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleAction}
                className="w-full sm:w-auto font-bold text-xs"
              >
                Submit Review &amp; Notify Trainee
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TrainerReviewDetailPage() {
  return (
    <AppShell showPreviewBanner={true}>
      <PreviewBanner message="Preview: sample data, not saved" />
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto w-full px-4 py-16 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-muted">Loading review session...</p>
          </div>
        }
      >
        <TrainerReviewDetailContent />
      </Suspense>
    </AppShell>
  );
}
