import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    // Primary: light blue #91B5E5 with DARK text (#1B2430)
    primary:
      "bg-primary-blue text-ink hover:bg-[#7fa5d8] active:bg-[#6e96cc] shadow-xs focus-visible:ring-link-blue focus-visible:ring-offset-cream",
    // Danger: safety red #D1120A for destructive actions
    danger:
      "bg-safety-red text-white hover:bg-[#b50f08] active:bg-[#9c0c06] shadow-xs focus-visible:ring-safety-red focus-visible:ring-offset-cream",
    // Ghost: transparent with subtle hover
    ghost:
      "bg-transparent text-ink hover:bg-black/5 active:bg-black/10 focus-visible:ring-link-blue focus-visible:ring-offset-cream",
    // Outline: white card border style
    outline:
      "bg-white border border-card-border text-ink hover:bg-[#f5ecda] active:bg-[#ede0c5] shadow-2xs focus-visible:ring-link-blue focus-visible:ring-offset-cream",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-2 rounded-lg gap-1.5 min-h-[44px]",
    md: "text-sm px-4 py-2 rounded-xl gap-2 min-h-[44px]",
    lg: "text-base px-6 py-3 rounded-xl gap-2.5 min-h-[48px]",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
