"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AppShell from "@/components/AppShell";
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/Card";

export default function StatusPage() {
  const [status, setStatus] = useState<string>("Checking backend connection...");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const endpoint = `${apiUrl}/api/health/`;

  useEffect(() => {
    axios
      .get(endpoint)
      .then((res) => {
        if (res.data?.status === "ok") {
          setStatus("Backend connected");
        } else {
          setStatus("Backend unreachable");
        }
      })
      .catch(() => {
        setStatus("Backend unreachable");
      });
  }, [endpoint]);

  const isConnected = status === "Backend connected";

  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card padding="lg" className="text-center">
            <CardHeader>
              <CardTitle as="h1">System &amp; Service Status</CardTitle>
              <CardDescription>Direct API health verification</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-xl border border-card-border bg-cream/40 p-6 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  {isConnected ? (
                    <svg
                      className="w-5 h-5 text-emerald-600 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-safety-red shrink-0"
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
                  )}
                  <p className="text-base font-bold text-ink">{status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
