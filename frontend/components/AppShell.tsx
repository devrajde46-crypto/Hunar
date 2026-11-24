"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import PreviewBanner from "@/components/PreviewBanner";
import { useAuth } from "@/lib/auth-context";

export interface AppShellProps {
  children: React.ReactNode;
  showPreviewBanner?: boolean;
}

function DesktopNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();
  const showStatus =
    role === "TRAINER" || role === "INSTITUTION_ADMIN" || role === "SUPER_ADMIN";

  return (
    <nav className="hidden sm:flex items-center gap-5 text-sm font-medium">
      <Link
        href="/home"
        className={`transition-colors ${
          pathname === "/home"
            ? "text-link-blue font-bold"
            : "text-muted hover:text-ink"
        }`}
      >
        Home
      </Link>
      <Link
        href="/procedures"
        className={`transition-colors ${
          pathname?.startsWith("/procedures")
            ? "text-link-blue font-bold"
            : "text-muted hover:text-ink"
        }`}
      >
        Procedures
      </Link>
      {showStatus && (
        <Link
          href="/status"
          className={`transition-colors ${
            pathname === "/status"
              ? "text-link-blue font-bold"
              : "text-muted hover:text-ink"
          }`}
        >
          Status
        </Link>
      )}
    </nav>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role?.toUpperCase();
  const showStatus =
    role === "TRAINER" || role === "INSTITUTION_ADMIN" || role === "SUPER_ADMIN";

  const navItems = [
    {
      label: "Home",
      href: "/home",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: "Procedures",
      href: "/procedures",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    ...(showStatus
      ? [
          {
            label: "Status",
            href: "/status",
            icon: (
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-card-border py-2 px-3 flex justify-around items-center z-40 shadow-xs"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/procedures" && pathname?.startsWith("/procedures"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 text-xs py-1 px-3 rounded-lg min-h-[44px] min-w-[44px] transition-colors ${
              isActive
                ? "text-link-blue font-bold"
                : "text-muted hover:text-ink"
            }`}
          >
            <span className="shrink-0" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppShell({
  children,
  showPreviewBanner = false,
}: AppShellProps) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">
      {showPreviewBanner && <PreviewBanner />}

      {/* Top Application Header */}
      <header className="w-full bg-white border-b border-card-border sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo href="/home" size="md" />

          {/* Desktop Nav & User profile */}
          <div className="flex items-center gap-6">
            <Suspense fallback={<div className="hidden sm:block w-32 h-6" />}>
              <DesktopNav />
            </Suspense>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-sm font-semibold text-ink leading-tight">
                    {user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user.username}
                  </span>
                  <span className="text-2xs font-bold uppercase tracking-wider text-muted">
                    {user.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3 py-1.5 rounded-lg border border-card-border bg-white text-xs sm:text-sm font-medium text-ink hover:bg-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-link-blue"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-lg border border-card-border bg-white text-xs sm:text-sm font-medium text-ink hover:bg-cream transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 rounded-lg bg-primary-blue text-ink text-xs sm:text-sm font-semibold hover:bg-[#7ea5d8] transition-colors shadow-2xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col pb-16 md:pb-6">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </div>
  );
}
