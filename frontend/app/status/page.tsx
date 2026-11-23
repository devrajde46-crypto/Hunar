"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Backend Service Status
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className={`inline-block h-3 w-3 rounded-full ${
              status === "Backend connected" ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            {status}
          </p>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          Endpoint: {endpoint}
        </p>
      </div>
    </div>
  );
}
