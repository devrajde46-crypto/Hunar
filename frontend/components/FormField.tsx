import React, { useId } from "react";

export interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function FormField({
  label,
  hint,
  error,
  required = false,
  id: customId,
  className = "",
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const id = customId || generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  let content = children;
  if (React.isValidElement(children)) {
    content = React.cloneElement(
      children as React.ReactElement<{
        id?: string;
        "aria-describedby"?: string;
        "aria-invalid"?: boolean;
        className?: string;
      }>,
      {
        id: (children.props as { id?: string }).id || id,
        "aria-describedby": describedBy,
        "aria-invalid": !!error,
      }
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs sm:text-sm font-semibold text-ink flex items-center gap-1 select-none"
      >
        <span>{label}</span>
        {required && (
          <span className="text-safety-red" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {content}

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="text-xs font-medium text-safety-red flex items-center gap-1 mt-0.5"
          role="alert"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
