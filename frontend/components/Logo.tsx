import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showWordmark?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  href = "/",
  showWordmark = true,
}: LogoProps) {
  const iconSizeClasses = {
    sm: "w-7 h-7 text-sm rounded-md",
    md: "w-9 h-9 text-base rounded-lg",
    lg: "w-11 h-11 text-xl rounded-xl",
  };

  const wordmarkSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Primary light blue rounded square with "H" */}
      <div
        className={`flex items-center justify-center font-display font-bold bg-primary-blue text-ink shadow-xs shrink-0 select-none ${iconSizeClasses[size]}`}
        aria-hidden="true"
      >
        H
      </div>
      {showWordmark && (
        <span
          className={`font-display font-bold tracking-tight text-ink select-none ${wordmarkSizeClasses[size]}`}
        >
          Hunar
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-link-blue rounded-lg"
        aria-label="Hunar Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
