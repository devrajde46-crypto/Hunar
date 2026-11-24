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
import { SampleSubmissionStep } from "@/lib/mock/types";

function SubmissionFeedbackContent() {
  const params = useParams();
  const rawId = params?.id;
  const submissionId = Array.isArray(rawId) ? rawId[0] : rawId || "sub-2026-0889";

  const feedback = {
    ...SAMPLE_SUBMISSION_FEEDBACK,
    id: submissionId,
  };

  const [activeStep, setActiveStep] = useState<number>(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = () => {
    // Action buttons do nothing except show a message "Not available in this preview"
    setToastMessage("Not available in this preview");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
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
        <Link href="/home" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/procedures" className="hover:text-ink">
          Procedures
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink font-mono">{feedback.procedureCode}</span>
        <span>/</span>
        <span className="text-muted">Feedback</span>
      </nav>

      {/* Trainee & Submission Meta Card */}
      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-ink bg-cream border border-card-border px-2.5 py-1 rounded-md">
              {feedback.procedureCode}
            </span>
            <StatusChip status={feedback.status} />
          </div>

          <span className="text-xs text-muted font-medium">
            Submitted: {feedback.submittedAt}
          </span>
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Practice Evaluation &amp; Feedback
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            {feedback.procedureTitle} • Trainee: <span className="font-semibold text-ink">{feedback.learnerName}</span> ({feedback.traineeId})
          </p>
        </div>

        {/* Ethical AI & Safety Disclaimer Callout */}
        <div
          role="note"
          className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 flex items-start gap-3"
        >
          <svg className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-1">
            <span className="font-bold block text-amber-900">
              Automated Guidance Notice
            </span>
            <p className="leading-relaxed">
              {feedback.aiGuidanceDisclaimer}
            </p>
          </div>
        </div>
      </div>

      {/* Video Evidence Mockup & Step Scrubber Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Frame Mockup */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-2xl border border-card-border bg-ink text-white overflow-hidden shadow-xs relative aspect-video flex flex-col justify-between p-4">
            {/* Top Video Header */}
            <div className="flex items-center justify-between text-xs text-white/80 z-10">
              <span className="font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                Footage Bookmark: Step 0{activeStep}
              </span>
              <span className="text-2xs text-white/60">Sample Video Preview</span>
            </div>

            {/* Video Frame Placeholder Visual */}
            <div className="my-auto flex flex-col items-center justify-center text-center p-4">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-primary-blue mb-3 backdrop-blur-xs">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-white">Workbench Practice Recording</p>
              <p className="text-xs text-white/70 max-w-sm mt-1">
                Video playback and defect snapshot inspection will stream from the processing service in Phase 3C/4.
              </p>
            </div>

            {/* Bottom Scrubber Timeline */}
            <div className="space-y-1.5 z-10 bg-black/60 p-2.5 rounded-xl backdrop-blur-xs">
              <div className="flex items-center justify-between text-2xs text-white/70 font-mono">
                <span>02:15 / 05:45</span>
                <span>Speed: 1.0x</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden relative">
                <div className="bg-primary-blue h-full w-[40%]" />
                {/* Defect Flag Marker */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-safety-red"
                  style={{ left: "38%" }}
                  title="Safety issue bookmark at 02:15"
                />
              </div>
            </div>
          </div>

          {/* Jump to Step Bookmarks */}
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
                Step {step.stepNumber} ({Math.floor(step.timestampSeconds / 60)}:{(step.timestampSeconds % 60).toString().padStart(2, "0")})
              </button>
            ))}
          </div>
        </div>

        {/* Trainer Sign-off & Overall Score Summary */}
        <div className="space-y-4">
          <Card padding="md">
            <CardHeader>
              <CardTitle className="text-base">Trainer Sign-off</CardTitle>
              <CardDescription>Official review by vocational instructor</CardDescription>
            </CardHeader>

            <CardContent>
              {feedback.trainerReview ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-cream/40 border border-card-border space-y-1.5">
                    <span className="font-bold text-ink block">
                      {feedback.trainerReview.trainerName}
                    </span>
                    <p className="text-ink leading-relaxed">
                      &ldquo;{feedback.trainerReview.comments}&rdquo;
                    </p>
                    <span className="text-2xs text-muted block pt-1 font-mono">
                      Reviewed: {feedback.trainerReview.reviewedAt}
                    </span>
                  </div>

                  {feedback.trainerReview.needsRetest && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-safety-red text-safety-red font-semibold text-xs flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Workbench Re-attempt Required</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted">Awaiting instructor sign-off.</p>
              )}

              <div className="mt-4 pt-4 border-t border-card-border space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAction}
                  className="w-full text-xs"
                >
                  Request Retest Review
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAction}
                  className="w-full text-xs"
                >
                  Export Evaluation Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Step-by-Step Evaluation Breakdown List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              Step-by-Step Evaluation Breakdown
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Pre-scoring guidance grounded in procedural rubric criteria
            </p>
          </div>
          <span className="text-xs font-semibold text-muted bg-white border border-card-border px-3 py-1 rounded-lg">
            {feedback.passedStepsCount} / {feedback.totalStepsCount} Steps Satisfied
          </span>
        </div>

        {feedback.steps.map((step: SampleSubmissionStep) => {
          const isCurrentActive = activeStep === step.stepNumber;
          return (
            <div
              key={step.stepNumber}
              className={`rounded-xl border bg-white p-5 shadow-2xs space-y-3 transition-colors ${
                isCurrentActive
                  ? "ring-2 ring-primary-blue"
                  : ""
              } ${
                step.safetyViolated
                  ? "border-l-4 border-l-safety-red border-card-border"
                  : step.passed
                  ? "border-l-4 border-l-emerald-600 border-card-border"
                  : "border-card-border"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-cream border border-card-border flex items-center justify-center font-bold text-xs text-ink font-mono">
                    {step.stepNumber}
                  </span>
                  <h3 className="font-display text-base font-bold text-ink">
                    {step.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {step.isSafetyCritical && <SafetyBadge size="sm" />}
                  <StatusChip
                    status={step.safetyViolated ? "Safety issue" : step.passed ? "Competent" : "Needs practice"}
                    size="sm"
                  />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-ink leading-relaxed">
                {step.feedback}
              </p>

              {step.detectedErrorTag && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-safety-red font-mono font-bold text-2xs border border-red-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Detected Error Tag: {step.detectedErrorTag}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-2xs text-muted border-t border-card-border">
                <span className="font-mono">
                  Timestamp: {Math.floor(step.timestampSeconds / 60)}:{(step.timestampSeconds % 60).toString().padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStep(step.stepNumber)}
                  className="font-bold text-link-blue hover:underline"
                >
                  Review Bookmark in Player →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SubmissionFeedbackPage() {
  return (
    <AppShell showPreviewBanner={true}>
      <PreviewBanner message="Preview: sample data, not saved" />
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto w-full px-4 py-16 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-muted">Loading evaluation...</p>
          </div>
        }
      >
        <SubmissionFeedbackContent />
      </Suspense>
    </AppShell>
  );
}
