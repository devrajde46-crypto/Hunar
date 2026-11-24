"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";
import FormField from "@/components/FormField";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [traineeId, setTraineeId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [institutionCode, setInstitutionCode] = useState("DEMO-ITI");
  const [consentGranted, setConsentGranted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = "Username is required";
    if (!email.trim() || !email.includes("@")) errors.email = "Valid institutional email is required";
    if (!password || password.length < 8) errors.password = "Password must be at least 8 characters";
    if (!institutionCode.trim()) errors.institutionCode = "Institution code is required";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);

    const validationErrors = validate();
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!consentGranted) {
      setGeneralError("You must acknowledge the Video Recording & Evaluation consent to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      // NOTE: Per AGENTS.md and user guidelines, do NOT send role in registration payload.
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        trainee_id_number: traineeId.trim(),
        phone_number: phoneNumber.trim(),
        institution_code: institutionCode.trim().toUpperCase(),
        consent: {
          consent_version: "v1.0-2026",
          is_granted: true,
        },
      });

      router.push("/home");
    } catch {
      // Generic registration failure message to prevent user enumeration
      setGeneralError("Unable to complete registration. Please check your credentials and password strength.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cream">
      <div className="w-full max-w-xl py-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Logo size="lg" showWordmark={true} />
          <p className="mt-2 text-sm font-semibold text-muted tracking-wide">
            Practice. Get feedback. Get job-ready.
          </p>
        </div>

        <Card padding="lg">
          <CardHeader className="text-center">
            <CardTitle as="h1">Create Learner Account</CardTitle>
            <CardDescription>
              Join your technical institute&apos;s electrical craftsmanship portal.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {generalError && (
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
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Username"
                  required
                  error={fieldErrors.username}
                  id="reg-username"
                >
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. ramesh_k"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                  />
                </FormField>

                <FormField
                  label="Institutional Email"
                  required
                  error={fieldErrors.email}
                  id="reg-email"
                >
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trainee@demo-iti.edu"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                  />
                </FormField>
              </div>

              <FormField
                label="Password"
                required
                hint="Minimum 8 characters with at least one letter and number"
                error={fieldErrors.password}
                id="reg-password"
              >
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                />
              </FormField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="First Name" id="reg-firstname">
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ramesh"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                  />
                </FormField>

                <FormField label="Last Name" id="reg-lastname">
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Kumar"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Institution Code"
                  required
                  hint="Official code provided by workshop trainer"
                  error={fieldErrors.institutionCode}
                  id="reg-institution-code"
                >
                  <input
                    type="text"
                    required
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value.toUpperCase())}
                    placeholder="DEMO-ITI"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink font-mono text-sm uppercase shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                  />
                </FormField>

                <FormField label="Trainee Roll / ID" id="reg-trainee-id">
                  <input
                    type="text"
                    value={traineeId}
                    onChange={(e) => setTraineeId(e.target.value)}
                    placeholder="EL-2024-889"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Phone Number (Optional)" id="reg-phone">
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-card-border bg-white text-ink text-sm shadow-2xs focus:border-link-blue focus:ring-1 focus:ring-link-blue focus:outline-none"
                />
              </FormField>

              {/* Consent Card */}
              <div className="rounded-xl border border-card-border bg-cream/50 p-4 mt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-card-border text-link-blue focus:ring-link-blue cursor-pointer"
                  />
                  <div className="flex flex-col text-xs text-ink leading-relaxed">
                    <span className="font-bold text-ink">
                      Video Recording &amp; Practice Evaluation Consent Policy
                    </span>
                    <span className="text-muted mt-0.5">
                      I agree to record workbench practice videos for AI step verification and certified trainer assessment under workshop supervision. All live circuits must remain de-energized during uncertified practice.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-bold"
                  isLoading={isSubmitting}
                  disabled={!consentGranted || isSubmitting}
                >
                  Create Learner Account
                </Button>
                {!consentGranted && (
                  <p className="text-center text-2xs text-muted mt-1.5">
                    Check the consent policy above to enable account creation.
                  </p>
                )}
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-card-border text-center text-xs text-muted">
              <span>Already registered? </span>
              <Link
                href="/login"
                className="font-semibold text-link-blue hover:underline"
              >
                Sign in to your account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
