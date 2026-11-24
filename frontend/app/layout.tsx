import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { inter, freudianVariable } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Hunar",
  description: "Hunar: practice, feedback, and trainer review for vocational skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${freudianVariable}`}>
      <body className="min-h-full flex flex-col font-sans bg-cream text-ink">
        <AuthProvider>
          <div className="flex-1 flex flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
