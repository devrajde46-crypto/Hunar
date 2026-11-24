"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import Button from "@/components/Button";
import SafetyBadge from "@/components/SafetyBadge";
import DraftNotice from "@/components/DraftNotice";
import { courseApi } from "@/lib/api";
import { Procedure, ProcedureStep } from "@/lib/types";

function ProcedureDetailContent() {
  const params = useParams();
  const rawCode = params?.code;
  const code = Array.isArray(rawCode) ? rawCode[0] : rawCode || "";

  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!code) return;

    courseApi
      .getProcedure(code)
      .then((data) => {
        if (isMounted) {
          setProcedure(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (err?.response?.status === 404) {
            setError("Procedure not found. Please check the procedure code.");
          } else {
            setError("Failed to load procedure details from the workshop catalog.");
          }
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [code]);

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
        <span className="font-semibold text-ink truncate max-w-xs font-mono">
          {code}
        </span>
      </nav>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-xl border border-card-border bg-white p-16 text-center flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-muted">Loading procedure specification...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-xl border border-safety-red bg-red-50 p-8 text-center">
          <p className="text-base font-bold text-safety-red">{error}</p>
          <p className="text-xs text-muted mt-1">
            The procedure may be deactivated or restricted to another training institution.
          </p>
          <Link href="/procedures" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              ← Back to Procedure Catalog
            </Button>
          </Link>
        </div>
      )}

      {/* Procedure Details */}
      {!isLoading && !error && procedure && (
        <>
          {/* Header Hero Card */}
          <div className="rounded-2xl border border-card-border bg-white p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ink bg-cream border border-card-border px-2.5 py-1 rounded-md">
                  {procedure.procedure_code}
                </span>
                <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-link-blue border border-blue-200">
                  {procedure.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted font-medium flex-wrap">
                {procedure.estimated_duration_minutes ? (
                  <>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{procedure.estimated_duration_minutes} minutes</span>
                    </span>
                    <span>•</span>
                  </>
                ) : null}
                <span>{procedure.steps?.length || 0} sequential steps</span>
              </div>
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                {procedure.title}
              </h1>
              {procedure.description && (
                <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                  {procedure.description}
                </p>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-card-border">
              <p className="text-2xs sm:text-xs text-muted">
                Read every step carefully before assembling components at your workbench.
              </p>
              <Link
                href={`/practice/upload?procedure=${encodeURIComponent(
                  procedure.procedure_code || procedure.id
                )}`}
              >
                <Button variant="primary" size="md" className="font-bold w-full sm:w-auto">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Record &amp; Upload Practice</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* DraftNotice must stay until a trainer-approved flag exists in the data */}
          <DraftNotice className="my-6" />

          {/* Safety Warning Banner */}
          {procedure.safety_instructions && (
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
                  Mandatory Electrical Safety Notice
                </h3>
                <p className="text-xs sm:text-sm text-ink leading-relaxed">
                  {procedure.safety_instructions}
                </p>
              </div>
            </div>
          )}

          {/* Required Tools Section (Real data only) */}
          {procedure.required_tools && Array.isArray(procedure.required_tools) && procedure.required_tools.length > 0 && (
            <Card padding="md">
              <CardHeader>
                <CardTitle className="text-base">Required Tools &amp; Equipment</CardTitle>
                <CardDescription>Assemble these tools before initiating practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {procedure.required_tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-cream border border-card-border text-ink inline-flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{String(tool)}</span>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step-by-Step Procedure Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-ink">
                  Sequential Step Instructions
                </h2>
                <p className="text-xs sm:text-sm text-muted">
                  Execution steps must follow this exact order to prevent electrical hazards
                </p>
              </div>
              <span className="text-xs font-semibold text-muted bg-white border border-card-border px-3 py-1 rounded-lg">
                {procedure.steps?.length || 0} Steps
              </span>
            </div>

            {(!procedure.steps || procedure.steps.length === 0) && (
              <div className="rounded-xl border border-card-border bg-white p-8 text-center text-muted text-sm">
                No active steps recorded for this procedure.
              </div>
            )}

            {procedure.steps &&
              procedure.steps.map((step: ProcedureStep) => (
                <div
                  key={step.id || step.step_number}
                  className={`rounded-xl border bg-white p-5 shadow-2xs space-y-3 transition-colors ${
                    step.is_safety_critical
                      ? "border-l-4 border-l-safety-red border-card-border"
                      : "border-card-border"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-cream border border-card-border flex items-center justify-center font-bold text-xs text-ink font-mono">
                        {step.step_number}
                      </span>
                      <h3 className="font-display text-base font-bold text-ink">
                        {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {step.step_code && (
                        <span className="font-mono text-2xs text-muted bg-cream px-2 py-0.5 rounded border border-card-border">
                          {step.step_code}
                        </span>
                      )}
                      {step.is_safety_critical && <SafetyBadge size="sm" />}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink leading-relaxed">
                    {step.description}
                  </p>

                  {/* Step Cues & Guidance Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {step.expected_tool && (
                      <div className="rounded-lg bg-cream/40 border border-card-border p-2.5">
                        <span className="font-semibold text-muted block mb-0.5">Tool / Instrument:</span>
                        <span className="font-medium text-ink">{step.expected_tool}</span>
                      </div>
                    )}

                    {step.visual_evidence_cue && (
                      <div className="rounded-lg bg-blue-50/50 border border-blue-200/60 p-2.5">
                        <span className="font-semibold text-link-blue block mb-0.5">Camera Framing Cue:</span>
                        <span className="text-ink">{step.visual_evidence_cue}</span>
                      </div>
                    )}
                  </div>

                  {step.common_mistakes && (
                    <div className="rounded-lg bg-amber-50/60 border border-amber-200 p-2.5 text-xs">
                      <span className="font-bold text-amber-900 block mb-0.5">Common Defect to Avoid:</span>
                      <span className="text-amber-950">{step.common_mistakes}</span>
                    </div>
                  )}

                  {step.hold_duration_seconds > 0 && (
                    <div className="text-2xs text-muted flex items-center gap-1 pt-1 font-mono">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Hold evidence in camera view for at least {step.hold_duration_seconds}s</span>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Bottom CTA Card */}
          <div className="rounded-xl border border-card-border bg-white p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-base text-ink">Ready to Practice?</h3>
              <p className="text-xs text-muted">
                Record your workbench wiring on phone camera following the guidelines and upload for verification.
              </p>
            </div>

            <Link
              href={`/practice/upload?procedure=${encodeURIComponent(
                procedure.procedure_code || procedure.id
              )}`}
            >
              <Button variant="primary" size="md" className="font-bold shrink-0">
                <span>Record &amp; Upload Practice</span>
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ProcedureDetailPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto w-full px-4 py-16 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-muted">Loading procedure...</p>
          </div>
        }
      >
        <ProcedureDetailContent />
      </Suspense>
    </AppShell>
  );
}
