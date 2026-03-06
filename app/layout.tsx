import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { getAiRuntimeStatus } from "@/lib/ai/config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Real Estate Content Engine",
  description:
    "Production-ready portfolio project that generates a month of polished real estate social content with demo mode and Claude-ready architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const runtime = getAiRuntimeStatus();
  const runtimeLabel =
    runtime.activeMode === "claude"
      ? "Live Claude Mode"
      : runtime.activeMode === "misconfigured"
        ? "Claude Config Needed"
        : "Demo Mode";

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cormorant.variable} antialiased`}>
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-x-0 top-[-22rem] h-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.24),transparent_58%)] blur-3xl" />
          <div className="absolute right-[-10rem] top-[16rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(24,32,51,0.16),transparent_62%)] blur-3xl" />
        </div>
        <SiteHeader
          runtimeLabel={runtimeLabel}
          runtimeTone={runtime.activeMode === "misconfigured" ? "warning" : "accent"}
        />
        <main className="mx-auto max-w-7xl px-6 pb-18 pt-8 sm:px-8 sm:pt-10">
          {children}
        </main>
        <footer className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-8 text-sm text-[var(--ink-soft)] sm:px-8">
          <p>Built for portfolio demos, local persistence, and Claude-ready orchestration.</p>
          <p>Next.js · TypeScript · Tailwind</p>
        </footer>
      </body>
    </html>
  );
}
