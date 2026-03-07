"use client";

import Link from "next/link";
import { FileCode2, FileJson2, FileText, LoaderCircle, NotebookPen, Printer } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import type {
  GoogleAuthNotice,
  GoogleDocsExportResult,
  GoogleDocsIntegrationStatus,
} from "@/lib/types/integrations";

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

export function ExportButtons({
  id,
  googleDocsStatus,
  googleAuthNotice,
}: {
  id: string;
  googleDocsStatus: GoogleDocsIntegrationStatus;
  googleAuthNotice: GoogleAuthNotice | null;
}) {
  const [isExportingGoogleDoc, setIsExportingGoogleDoc] = useState(false);
  const [googleDocsError, setGoogleDocsError] = useState<string | null>(null);
  const [googleDocsResult, setGoogleDocsResult] =
    useState<GoogleDocsExportResult | null>(null);

  async function handleGoogleDocsExport() {
    setGoogleDocsError(null);
    setGoogleDocsResult(null);
    setIsExportingGoogleDoc(true);

    try {
      const response = await fetch(`/api/runs/${id}/export/google-docs`, {
        method: "POST",
      });

      const payload = (await response.json()) as
        | { error?: string; result?: GoogleDocsExportResult }
        | undefined;

      if (!response.ok || !payload?.result) {
        throw new Error(
          payload?.error ?? "Google Docs export could not be completed.",
        );
      }

      setGoogleDocsResult(payload.result);
    } catch (error) {
      setGoogleDocsError(
        error instanceof Error
          ? error.message
          : "Google Docs export could not be completed.",
      );
    } finally {
      setIsExportingGoogleDoc(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <Card className="flex flex-col gap-4 md:col-span-2 xl:col-span-1">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <NotebookPen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--ink)]">Export to Google Docs</h3>
            <p className="text-sm text-[var(--ink-soft)]">
              Create a new Google Doc with clean headings, sections, and an openable document URL.
            </p>
          </div>
        </div>

        <div className="rounded-[22px] bg-white/80 p-4 text-sm leading-7 text-[var(--ink-soft)]">
          <p>{googleDocsStatus.message}</p>
          {googleDocsStatus.connected && googleDocsStatus.connectedEmail ? (
            <p className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs leading-6 text-emerald-900">
              Connected account: {googleDocsStatus.connectedEmail}
            </p>
          ) : null}
          {!googleDocsStatus.configured && googleDocsStatus.reason ? (
            <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-900">
              Configuration detail: {googleDocsStatus.reason}
            </p>
          ) : null}
        </div>

        {googleAuthNotice ? (
          <div
            className={
              googleAuthNotice.tone === "success"
                ? "rounded-[22px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
                : "rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            }
          >
            {googleAuthNotice.message}
          </div>
        ) : null}

        {!googleDocsStatus.connected && googleDocsStatus.canConnect ? (
          <Link
            href={`/api/auth/google/start?returnTo=${encodeURIComponent(`/results/${id}`)}`}
            className={buttonStyles({ variant: "primary", className: "w-full" })}
          >
            Connect Google
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleGoogleDocsExport}
            disabled={!googleDocsStatus.configured || isExportingGoogleDoc}
            className={buttonStyles({
              variant: googleDocsStatus.configured ? "primary" : "secondary",
              className: "w-full disabled:opacity-60",
            })}
          >
            {isExportingGoogleDoc ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Creating Google Doc
              </>
            ) : (
              "Export to Google Docs"
            )}
          </button>
        )}

        {googleDocsResult ? (
          <div className="space-y-3 rounded-[22px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Google Doc created successfully.</p>
            <p>{googleDocsResult.title}</p>
            <Link
              href={googleDocsResult.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: "outline", className: "w-full" })}
            >
              Open Doc
            </Link>
          </div>
        ) : null}

        {googleDocsError ? (
          <div className="rounded-[22px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {googleDocsError}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
