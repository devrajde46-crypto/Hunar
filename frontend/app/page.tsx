"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [status, setStatus] = useState<string>("Checking backend connection...");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    axios
      .get(`${apiUrl}/api/health/`)
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
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          AI Vocational Skills Trainer
        </h1>
        <p className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
          {status}
        </p>
      </main>
    </div>
  );
}
