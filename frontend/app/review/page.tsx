"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusChip from "@/components/StatusChip";
import SafetyBadge from "@/components/SafetyBadge";
import PreviewBanner from "@/components/PreviewBanner";
import { SAMPLE_REVIEW_QUEUE } from "@/lib/mock/sample-review";
import { SampleReviewQueueItem } from "@/lib/mock/types";

/**
 * NOTE: Role-based visibility in the UI (/review for trainers) is provided
 * here as a client-side routing convenience for UI testing.
 * The backend security layer must enforce strict role authorization on
 * all instructor endpoints in later phases.
 */
export default function TrainerReviewQueuePage() {
  const [filter, setFilter] = useState<"ALL" | "NEEDS_REVIEW" | "REVIEWED" | "SAFETY_FLAGGED">("NEEDS_REVIEW");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const queueItems: SampleReviewQueueItem[] = SAMPLE_REVIEW_QUEUE.filter((item) => {
    // Filter condition
    if (filter === "NEEDS_REVIEW" && item.status !== "Needs review" && item.status !== "Safety issue") return false;
    if (filter === "REVIEWED" && item.status !== "Reviewed") return false;
    if (filter === "SAFETY_FLAGGED" && !item.hasSafetyFlag) return false;

    // Search condition
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.learnerName.toLowerCase().includes(q) ||
        item.traineeId.toLowerCase().includes(q) ||
        item.procedureTitle.toLowerCase().includes(q) ||
        item.procedureCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const needsReviewCount = SAMPLE_REVIEW_QUEUE.filter(
    (i) => i.status === "Needs review" || i.status === "Safety issue"
  ).length;
  const reviewedCount = SAMPLE_REVIEW_QUEUE.filter((i) => i.status === "Reviewed").length;
  const safetyFlaggedCount = SAMPLE_REVIEW_QUEUE.filter((i) => i.hasSafetyFlag).length;

  return (
    <AppShell showPreviewBanner={true}>
      <PreviewBanner message="Preview: sample data, not saved" />
      <div className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-card-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xs font-bold uppercase tracking-wider text-muted bg-cream border border-card-border px-2 py-0.5 rounded">
                Trainer Portal
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Submissions to Review
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Instructor triage queue prioritized by safety tags and pending practical submissions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-muted bg-white border border-card-border px-3 py-1.5 rounded-lg shadow-2xs">
              Queue: <span className="text-ink font-bold">{needsReviewCount}</span> Pending
            </span>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter queue">
            <button
              type="button"
              onClick={() => setFilter("NEEDS_REVIEW")}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === "NEEDS_REVIEW"
                  ? "bg-primary-blue text-ink shadow-2xs"
                  : "bg-white border border-card-border text-muted hover:text-ink hover:bg-cream"
              }`}
            >
              Needs Review ({needsReviewCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("SAFETY_FLAGGED")}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === "SAFETY_FLAGGED"
                  ? "bg-red-100 text-safety-red border border-red-300 shadow-2xs"
                  : "bg-white border border-card-border text-muted hover:text-ink hover:bg-cream"
              }`}
            >
              Safety Flagged ({safetyFlaggedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("REVIEWED")}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === "REVIEWED"
                  ? "bg-primary-blue text-ink shadow-2xs"
                  : "bg-white border border-card-border text-muted hover:text-ink hover:bg-cream"
              }`}
            >
              Reviewed ({reviewedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === "ALL"
                  ? "bg-primary-blue text-ink shadow-2xs"
                  : "bg-white border border-card-border text-muted hover:text-ink hover:bg-cream"
              }`}
            >
              All ({SAMPLE_REVIEW_QUEUE.length})
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trainee or procedure..."
              aria-label="Search submissions"
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-card-border bg-white text-ink text-xs shadow-2xs focus:border-link-blue focus:outline-none"
            />
            <svg
              className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Submissions List */}
        {queueItems.length === 0 ? (
          <div className="rounded-xl border border-card-border bg-white p-16 text-center">
            <p className="text-base font-semibold text-ink">No submissions matching filter</p>
            <p className="text-xs text-muted mt-1">
              All submissions for this filter criteria have been addressed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {queueItems.map((item) => (
              <Card
                key={item.id}
                padding="md"
                className={`transition-all hover:border-link-blue/50 ${
                  item.hasSafetyFlag ? "border-l-4 border-l-safety-red" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-ink">{item.learnerName}</span>
                      <span className="font-mono text-2xs text-muted bg-cream border border-card-border px-2 py-0.5 rounded">
                        {item.traineeId}
                      </span>
                      <StatusChip status={item.status} size="sm" />
                      {item.hasSafetyFlag && <SafetyBadge size="sm" />}
                    </div>

                    <h3 className="font-display text-base font-bold text-ink">
                      {item.procedureTitle}
                    </h3>

                    {item.flaggedErrorSnippet && (
                      <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-safety-red font-medium flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{item.flaggedErrorSnippet}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-2xs text-muted font-mono pt-1">
                      <span>Submitted: {item.submittedAt}</span>
                      <span>•</span>
                      <span>Video: {Math.floor(item.videoDurationSeconds / 60)}m {item.videoDurationSeconds % 60}s</span>
                      <span>•</span>
                      <span>AI Pre-Score: {item.aiScore}%</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <Link href={`/review/${item.id}`}>
                      <Button variant="primary" size="sm" className="font-bold text-xs">
                        <span>Open Review &amp; Grade</span>
                        <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
