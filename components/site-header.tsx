"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/generate", label: "Generate" },
  { href: "/history", label: "History" },
  { href: "/architecture", label: "Architecture" },
] as const;

export function SiteHeader({
  runtimeLabel,
  runtimeTone,
}: {
  runtimeLabel: string;
  runtimeTone: "accent" | "warning";
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(247,242,234,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--ink),var(--brand))] text-white shadow-[0_12px_30px_rgba(24,32,51,0.18)]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-2xl leading-none text-[var(--ink)]">
              AI Real Estate
            </div>
            <div className="text-sm text-[var(--ink-soft)]">Content Engine</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  active
                    ? "bg-white text-[var(--ink)] shadow-[0_10px_24px_rgba(24,32,51,0.08)]"
                    : "text-[var(--ink-soft)] hover:bg-white/60 hover:text-[var(--ink)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Badge tone={runtimeTone}>{runtimeLabel}</Badge>
          <Link href="/generate" className={buttonStyles({ variant: "primary", size: "sm" })}>
            Generate
          </Link>
        </div>
      </div>
    </header>
  );
}
