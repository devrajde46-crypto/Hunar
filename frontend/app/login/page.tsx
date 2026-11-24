"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import FormField from "@/components/FormField";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Email or password is incorrect");
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await login({ username: username.trim(), password });
      const role = user.role?.toLowerCase();
      if (role === "trainer") {
        router.push("/trainer");
      } else if (role === "institution_admin" || role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/home");
      }
    } catch {
      // Must return generic message on authentication failure
      setError("Email or password is incorrect");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cream">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" showWordmark={true} />
          <p className="mt-2 text-sm font-semibold text-muted tracking-wide">
            Practice. Get feedback. Get job-ready.
          </p>
        </div>

        <Card padding="lg">
          <CardHeader className="text-center">
            <CardTitle as="h1">Sign in to your workshop portal</CardTitle>
            <CardDescription>
              Enter your username or email and password to access practical exercises.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-safety-red bg-red-50 p-3 text-xs sm:text-sm font-medium text-safety-red flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 shrink-0 text-safety-red"
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
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <FormField label="Username or Email" required id="login-username">
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. trainee@demo-iti.edu"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                />
              </FormField>

              <FormField label="Password" required id="login-password">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </FormField>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                  isLoading={isSubmitting}
                >
                  Sign in to Workshop
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-card-border text-center text-xs text-muted">
              <span>Don&apos;t have an account? </span>
              <Link
                href="/register"
                className="font-semibold text-link-blue hover:underline"
              >
                Register with Institution Code
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
