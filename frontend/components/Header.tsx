"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import Logo from '@/components/Logo';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b border-card-border bg-white px-4 py-3 shadow-2xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Logo href="/" size="md" />

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/status"
            className="text-muted hover:text-ink transition-colors"
          >
            Status
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-ink font-medium">
                {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
              </span>
              <span className="rounded-full bg-cream border border-card-border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-muted">
                {user.role}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg border border-card-border px-3 py-1 text-sm font-medium text-ink transition hover:bg-cream"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-card-border px-3 py-1.5 font-medium text-ink transition hover:bg-cream"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary-blue px-3.5 py-1.5 font-semibold text-ink transition hover:bg-[#7fa5d8] shadow-2xs"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
