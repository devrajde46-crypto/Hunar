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
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full ${
                      isConnected ? "bg-emerald-500 shadow-xs" : "bg-safety-red shadow-xs"
                    }`}
                  />
                  <p className="text-base font-bold text-ink">{status}</p>
                </div>
                <p className="text-2xs font-mono text-muted break-all">
                  API Target: {endpoint}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
