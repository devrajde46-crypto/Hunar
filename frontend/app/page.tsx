"use client";

import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-zinc-500 dark:text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.first_name
    ? `${user.first_name} ${user.last_name}`.trim()
    : user.username;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col p-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Welcome, {displayName}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Logged in as <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.username}</span> ({user.email})
            </p>
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              Role: {user.role}
            </span>
          </div>
        </div>

        <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Institution
            </h2>
            <p className="mt-1 text-base font-medium text-zinc-900 dark:text-zinc-100">
              {user.institution?.name || "Unassigned"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Code: {user.institution?.code || "N/A"}
            </p>
          </div>

          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Trainee ID / Identifier
            </h2>
            <p className="mt-1 text-base font-medium text-zinc-900 dark:text-zinc-100">
              {user.trainee_id_number || "None"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Account Status: {user.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
          <p className="font-semibold">Core Backend & Auth Session Connected</p>
          <p className="mt-1 text-xs">
            Your JWT access tokens and refresh tokens are managed securely in httpOnly SameSite=Lax cookies with automatic rotation.
          </p>
        </div>
      </div>
    </div>
  );
}
