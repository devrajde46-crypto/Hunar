"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const role = user.role?.toLowerCase();
    if (role === "trainer") {
      router.replace("/trainer");
    } else if (role === "institution_admin" || role === "super_admin") {
      router.replace("/admin");
    } else {
      router.replace("/home");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <h1 className="sr-only">Hunar: Vocational Skills Practice and Training</h1>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted font-medium">Redirecting to workspace...</p>
      </div>
    </div>
  );
}
