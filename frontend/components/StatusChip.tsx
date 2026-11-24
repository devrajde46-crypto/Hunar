import React from "react";

export type StatusType =
  | "Competent"
  | "Needs practice"
  | "Safety issue"
  | "Processing"
  | "Uploaded"
  | "Scored"
  | "Reviewed";

export interface StatusChipProps {
  status: StatusType | string;
  size?: "sm" | "md";
  className?: string;
}

export default function StatusChip({
  status,
  size = "md",
  className = "",
}: StatusChipProps) {
  // Normalize status string
  const normalized = status.toLowerCase().trim();

  let label: string = status;
  let config = {
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-300",
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <circle cx="10" cy="10" r="5" />
      </svg>
    ),
  };

  if (normalized === "competent" || normalized === "pass" || normalized === "passed") {
    label = "Competent";
    config = {
      bg: "bg-emerald-50",
      text: "text-emerald-900",
      border: "border-emerald-300",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
  } else if (
    normalized === "needs practice" ||
    normalized === "needs_practice" ||
    normalized === "fail" ||
    normalized === "failed"
  ) {
    label = "Needs practice";
    config = {
      bg: "bg-amber-50",
      text: "text-amber-900",
      border: "border-amber-300",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
  } else if (
    normalized === "safety issue" ||
    normalized === "safety_issue" ||
    normalized === "safety_violated" ||
    normalized === "safety alert"
  ) {
    label = "Safety issue";
    config = {
      bg: "bg-red-50",
      text: "text-safety-red font-semibold",
      border: "border-safety-red",
      icon: (
        <svg className="w-3.5 h-3.5 text-safety-red" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
  } else if (normalized === "processing") {
    label = "Processing";
    config = {
      bg: "bg-blue-50",
      text: "text-blue-900",
      border: "border-blue-300",
      icon: (
        <svg
          className="w-3.5 h-3.5 animate-spin text-link-blue"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ),
    };
  } else if (normalized === "uploaded") {
    label = "Uploaded";
    config = {
      bg: "bg-sky-50",
      text: "text-sky-900",
      border: "border-sky-300",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
  } else if (normalized === "scored") {
    label = "Scored";
    config = {
      bg: "bg-indigo-50",
      text: "text-indigo-900",
      border: "border-indigo-300",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
  } else if (normalized === "reviewed") {
    label = "Reviewed";
    config = {
      bg: "bg-violet-50",
      text: "text-violet-900",
      border: "border-violet-300",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs sm:text-sm gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      <span className="shrink-0" aria-hidden="true">
        {config.icon}
      </span>
      <span>{label}</span>
    </span>
  );
}
