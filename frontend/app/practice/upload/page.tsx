"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import Button from "@/components/Button";
import PreviewBanner from "@/components/PreviewBanner";
import {
  SAMPLE_UPLOAD_PROCEDURE,
  SAMPLE_FILMING_CHECKLIST,
} from "@/lib/mock/sample-upload";

function PracticeUploadContent() {
  const searchParams = useSearchParams();
  const procedureQuery = searchParams.get("procedure");

  // Sample procedure details for preview
  const procedure = {
    ...SAMPLE_UPLOAD_PROCEDURE,
    code: procedureQuery || SAMPLE_UPLOAD_PROCEDURE.code,
  };

  // State for interactive filming checklist
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    "check-1": true,
    "check-2": true,
  });

  // File picker state (for UI display only - file is NEVER read, stored, or transmitted)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // NOTE: Strictly extract name and formatted size only.
      // Per AGENTS.md and Phase 3 rules, do NOT read, store, or transmit the file.
      setSelectedFileName(file.name);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setSelectedFileSize(`${sizeMB} MB`);
    } else {
      setSelectedFileName(null);
      setSelectedFileSize(null);
    }
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allChecked = SAMPLE_FILMING_CHECKLIST.every((item) => checkedItems[item.id]);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
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
        <Link href={`/procedures/${procedure.code}`} className="hover:text-ink font-mono">
          {procedure.code}
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">Upload Practice Recording</span>
      </nav>

      {/* Header Card */}
      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-bold text-ink bg-cream border border-card-border px-2.5 py-1 rounded-md">
            {procedure.code}
          </span>
          <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-link-blue border border-blue-200">
            {procedure.difficulty}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Submit Practice Recording
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          {procedure.title} • Record your workbench wiring on phone camera following the filming guidelines.
        </p>
      </div>

      {/* Safety Notice Callout */}
      <div
        role="alert"
        className="rounded-xl border border-safety-red bg-red-50 p-4 sm:p-5 flex items-start gap-3 shadow-2xs"
      >
        <div className="p-2 rounded-lg bg-safety-red text-white shrink-0 mt-0.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-bold text-sm sm:text-base text-safety-red">
            Mandatory Electrical Safety Rule
          </h3>
          <p className="text-xs sm:text-sm text-ink leading-relaxed">
            {procedure.safetyInstructions}
          </p>
        </div>
      </div>

      {/* Before You Start Filming Checklist */}
      <Card padding="md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Before You Start Checklist</CardTitle>
            <span className="text-xs font-semibold text-muted bg-cream border border-card-border px-2.5 py-0.5 rounded-full">
              {Object.values(checkedItems).filter(Boolean).length} / {SAMPLE_FILMING_CHECKLIST.length} Completed
            </span>
          </div>
          <CardDescription>
            Ensure optimal video evidence for clear AI step verification and trainer audit
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_FILMING_CHECKLIST.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
                    isChecked
                      ? "bg-cream/40 border-link-blue/40"
                      : "bg-white border-card-border hover:bg-cream/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCheck(item.id)}
                    className="mt-1 h-4 w-4 rounded border-card-border text-link-blue focus:ring-link-blue cursor-pointer"
                  />
                  <div className="flex flex-col text-xs">
                    <span className="font-bold text-ink">{item.title}</span>
                    <span className="text-muted mt-0.5 leading-relaxed">
                      {item.description}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Video File Selector Section */}
      <Card padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Video File Selection</CardTitle>
          <CardDescription>
            Select your continuous MP4 or WebM practice video (Recommended: 1080p, 5-8 minutes)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-card-border rounded-xl p-8 bg-cream/20 text-center hover:bg-cream/30 transition-colors relative">
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={handleFileChange}
              id="practice-video-input"
              aria-label="Choose video file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-cream border border-card-border flex items-center justify-center text-link-blue mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-bold text-ink">
              Tap to browse or drop practice video
            </p>
            <p className="text-xs text-muted mt-1">
              Supports MP4 or WebM format • Max recommended size: 250MB
            </p>
          </div>

          {/* Selected Video Preview Card */}
          {selectedFileName && (
            <div className="mt-4 rounded-xl border border-card-border bg-white p-4 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-link-blue">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink truncate max-w-xs sm:max-w-md">
                    {selectedFileName}
                  </p>
                  <p className="text-2xs text-muted font-mono">{selectedFileSize}</p>
                </div>
              </div>
              <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                File Selected
              </span>
            </div>
          )}

          {/* Notes for Instructor */}
          <div className="mt-4 space-y-1.5">
            <label htmlFor="upload-notes" className="text-xs font-semibold text-ink">
              Notes for Workshop Trainer (Optional)
            </label>
            <textarea
              id="upload-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Practiced on Bay B-04 bench. Tested continuity with multimeter."
              className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
            />
          </div>

          {/* Submission CTA - Strictly Disabled per Rule */}
          <div className="mt-6 pt-4 border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-2xs text-muted">
              {allChecked
                ? "Filming checklist satisfied."
                : "Check all filming requirements before recording."}
            </p>

            {/* MANDATORY: The submit button is strictly disabled with text: "Upload is coming in a later phase" */}
            <Button
              variant="primary"
              size="md"
              disabled={true}
              className="w-full sm:w-auto font-bold opacity-60 cursor-not-allowed"
              title="Upload functionality is coming in a later roadmap phase"
            >
              Upload is coming in a later phase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PracticeUploadPage() {
  return (
    <AppShell showPreviewBanner={true}>
      <PreviewBanner message="Preview: sample data, not saved" />
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto w-full px-4 py-16 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-muted">Loading upload interface...</p>
          </div>
        }
      >
        <PracticeUploadContent />
      </Suspense>
    </AppShell>
  );
}
