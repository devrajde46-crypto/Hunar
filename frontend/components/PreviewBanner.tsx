import React from "react";

export interface PreviewBannerProps {
  message?: string;
  className?: string;
}

export default function PreviewBanner({
  message = "Preview: sample data, not saved",
  className = "",
}: PreviewBannerProps) {
  return (
    <div
      role="note"
      className={`w-full bg-[#FFF9EC] border-b border-card-border px-4 py-2 text-xs sm:text-sm text-ink flex items-center justify-between shadow-2xs ${className}`}
    >
      <div className="mx-auto flex max-w-5xl w-full items-center justify-center gap-2">
        <svg
          className="w-4 h-4 text-link-blue shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium tracking-tight">{message}</span>
      </div>
    </div>
  );
}
