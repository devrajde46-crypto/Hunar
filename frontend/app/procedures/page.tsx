"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import Card from "@/components/Card";
import SafetyBadge from "@/components/SafetyBadge";
import { courseApi } from "@/lib/api";
import { Procedure } from "@/lib/types";

export default function ProcedureListPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let isMounted = true;
    const params: { difficulty?: string; search?: string } = {};
    if (selectedDifficulty !== "ALL") params.difficulty = selectedDifficulty;
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

    courseApi
      .getProcedures(params)
      .then((res) => {
        if (isMounted) {
          setProcedures(res.results || []);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Failed to load procedures from the workshop catalog.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDifficulty, debouncedSearch]);

  const difficultyFilters: { label: string; value: string }[] = [
    { label: "All Difficulties", value: "ALL" },
    { label: "Beginner", value: "BEGINNER" },
    { label: "Intermediate", value: "INTERMEDIATE" },
    { label: "Advanced", value: "ADVANCED" },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="border-b border-card-border pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-muted bg-cream border border-card-border px-2 py-0.5 rounded">
              Curriculum Catalog
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Practical Wiring Procedures
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Select an electrical wiring procedure to review instructions, tools, and camera framing before recording.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Search Input Form */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search procedures by title or code..."
              aria-label="Search procedures"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
            />
            <svg
              className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Difficulty Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="group" aria-label="Filter by difficulty">
            {difficultyFilters.map((df) => {
              const isSelected = selectedDifficulty === df.value;
              return (
                <button
                  key={df.value}
                  type="button"
                  onClick={() => setSelectedDifficulty(df.value)}
                  className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold whitespace-nowrap transition-colors select-none ${
                    isSelected
                      ? "bg-primary-blue text-ink shadow-2xs"
                      : "bg-white border border-card-border text-muted hover:text-ink hover:bg-cream"
                  }`}
                >
                  {df.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="rounded-xl border border-card-border bg-white p-16 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium text-muted">Loading procedure catalog...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-xl border border-safety-red bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-safety-red">{error}</p>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                setDebouncedSearch((prev) => prev + " ");
              }}
              className="mt-3 px-4 py-1.5 text-xs font-semibold rounded-lg bg-white border border-card-border text-ink hover:bg-cream"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && procedures.length === 0 && (
          <div className="rounded-xl border border-card-border bg-white p-16 text-center">
            <div className="w-12 h-12 rounded-full bg-cream border border-card-border flex items-center justify-center text-muted mx-auto mb-3">
              <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-ink">No matching procedures found</p>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1">
              Try adjusting your search terms or clearing the difficulty filter to find procedures.
            </p>
            {(selectedDifficulty !== "ALL" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDifficulty("ALL");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-cream border border-card-border text-ink hover:bg-white"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Procedure Grid */}
        {!isLoading && !error && procedures.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procedures.map((proc) => {
              const code = proc.procedure_code || proc.id;
              const hasSafety =
                typeof proc.safety_critical_steps_count === "number"
                  ? proc.safety_critical_steps_count > 0
                  : true;

              return (
                <Card
                  key={proc.id}
                  padding="md"
                  className="hover:border-link-blue/50 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-2xs font-bold text-muted bg-cream border border-card-border px-2 py-0.5 rounded">
                        {proc.procedure_code || "PROC"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-link-blue border border-blue-200">
                          {proc.difficulty}
                        </span>
                        {hasSafety && <SafetyBadge size="sm" />}
                      </div>
                    </div>

                    <h2 className="font-display text-lg font-bold text-ink leading-snug">
                      <Link href={`/procedures/${code}`} className="hover:text-link-blue">
                        {proc.title}
                      </Link>
                    </h2>

                    {proc.description && (
                      <p className="text-xs text-muted line-clamp-2 mt-1.5 leading-relaxed">
                        {proc.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between text-xs text-muted">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{proc.estimated_duration_minutes || 25} mins</span>
                      </span>

                      {typeof proc.total_steps === "number" && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{proc.total_steps} steps</span>
                        </span>
                      )}

                      {typeof proc.safety_critical_steps_count === "number" &&
                        proc.safety_critical_steps_count > 0 && (
                          <span className="text-safety-red font-semibold text-2xs">
                            ({proc.safety_critical_steps_count} safety)
                          </span>
                        )}
                    </div>

                    <Link
                      href={`/procedures/${code}`}
                      className="font-bold text-link-blue hover:underline inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-cream transition-colors"
                    >
                      <span>View Steps</span>
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
    </AppShell>
  );
}
