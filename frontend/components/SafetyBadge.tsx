import React from "react";

export interface SafetyBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export default function SafetyBadge({
  className = "",
  size = "md",
}: SafetyBadgeProps) {
  const sizeClasses = {
    sm: "text-2xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      role="status"
      aria-label="Safety-critical step"
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full bg-red-100 text-safety-red border border-red-300 shadow-2xs ${sizeClasses[size]} ${className}`}
    >
      <svg
        className="w-3.5 h-3.5 shrink-0 text-safety-red"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>Safety-critical</span>
    </span>
  );
}
