"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900 hover:text-blue-600 dark:text-white">
          Hunar
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/status"
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Status
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-zinc-700 dark:text-zinc-300">
                {user.first_name ? `${user.first_name} ${user.last_name}` : user.username}
              </span>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                {user.role}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded border border-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded border border-zinc-300 px-3 py-1 font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded bg-blue-600 px-3 py-1 font-medium text-white transition hover:bg-blue-700"
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
