import Link from "next/link";
import { FileCode2, FileJson2, FileText, Printer } from "lucide-react";

import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";

const exportOptions = [
  {
    href: (id: string) => `/api/runs/${id}/export?format=markdown`,
    label: "Download Markdown",
    description: "Readable delivery file for notes, internal handoff, or documentation.",
    icon: FileText,
  },
  {
    href: (id: string) => `/api/runs/${id}/export?format=json`,
    label: "Download JSON",
    description: "Structured output for QA, reuse, or future workflow automation.",
    icon: FileJson2,
  },
  {
    href: (id: string) => `/api/runs/${id}/export?format=html`,
    label: "Download HTML Report",
    description: "Standalone presentation artifact with premium styling and clean layout.",
    icon: FileCode2,
  },
  {
    href: (id: string) => `/results/${id}/print`,
    label: "Open Print View",
    description: "Browser-ready report for saving a polished PDF during a live walkthrough.",
    icon: Printer,
  },
] as const;

export function ExportButtons({ id }: { id: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {exportOptions.map((option) => {
        const Icon = option.icon;

        return (
          <Card key={option.label} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--ink)]">{option.label}</h3>
                <p className="text-sm text-[var(--ink-soft)]">{option.description}</p>
              </div>
            </div>
            <Link
              href={option.href(id)}
              target={option.label === "Open Print View" ? "_blank" : undefined}
              className={buttonStyles({ variant: "primary" })}
            >
              {option.label}
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
