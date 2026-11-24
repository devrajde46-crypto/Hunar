// Note: DraftNotice must stay until a trainer-approved flag exists in the data.
import React from "react";

export interface DraftNoticeProps {
  className?: string;
}

export default function DraftNotice({ className = "" }: DraftNoticeProps) {
  return (
    <div
      role="note"
      className={`bg-white rounded-xl border border-card-border border-l-4 border-l-safety-red p-4 shadow-2xs text-xs sm:text-sm text-ink flex items-start gap-3 ${className}`}
    >
      <svg
        className="w-5 h-5 text-safety-red shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <span className="font-bold text-ink block sm:inline mr-1">Draft content:</span>
        <span>
          these steps are being reviewed by a qualified trainer. Follow your trainer&apos;s instructions and your workshop&apos;s safety rules.
        </span>
      </div>
    </div>
  );
}
