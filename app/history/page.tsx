import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { productDescription } from "@/lib/brand";
import { getContentPreset } from "@/lib/content-presets";
import { listRunSummaries } from "@/lib/storage/runs";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "History",
  description: productDescription,
};

export default async function HistoryPage() {
  const runs = await listRunSummaries();
  const totalPosts = runs.reduce((total, run) => total + run.totalPosts, 0);

  return (
    <div className="space-y-10 pb-12">
      <SectionHeading
        eyebrow="History"
        title="Saved content plans and reusable demo history"
        description="Each run is written to lightweight local storage so the app can reopen previous plans instantly, compare briefs, and export handoff files without a database."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="space-y-2">
          <p className="eyebrow">Saved Runs</p>
          <p className="text-4xl font-semibold text-[var(--ink)]">{runs.length}</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            Reopen past plans during demos instead of regenerating from scratch.
          </p>
        </Card>
        <Card className="space-y-2">
          <p className="eyebrow">Posts Generated</p>
          <p className="text-4xl font-semibold text-[var(--ink)]">{totalPosts}</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            Every saved run retains its calendar, scripts, prompts, and export assets.
          </p>
        </Card>
        <Card className="space-y-2">
          <p className="eyebrow">Demo Value</p>
          <p className="text-2xl font-semibold text-[var(--ink)]">Fast comparison</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            Useful for showing how different presets and briefs change the resulting strategy.
          </p>
        </Card>
      </div>

      {runs.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {runs.map((run) => {
            const preset = getContentPreset(run.preset);

            return (
              <Card key={run.id} className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{run.modeUsed} mode</p>
                    <h2 className="text-3xl font-semibold text-[var(--ink)]">{run.businessName}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                      {run.campaignTitle}
                    </p>
                  </div>
                  <Badge tone={run.modeUsed === "claude" ? "accent" : "neutral"}>
                    {run.totalPosts} posts
                  </Badge>
                </div>

                <div className="grid gap-3 rounded-[24px] bg-white/80 p-4 text-sm text-[var(--ink-soft)] sm:grid-cols-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                      Preset
                    </div>
                    <div className="mt-1 font-medium text-[var(--ink)]">{preset.label}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                      Niche
                    </div>
                    <div className="mt-1 font-medium text-[var(--ink)]">{run.niche}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                      Offer
                    </div>
                    <div className="mt-1 font-medium text-[var(--ink)]">{run.offer}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                      Saved
                    </div>
                    <div className="mt-1 font-medium text-[var(--ink)]">
                      {formatDateTime(run.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                      Platforms
                    </div>
                    <div className="mt-1 font-medium text-[var(--ink)]">
                      {run.primaryPlatforms.join(", ")}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                      Extra assets
                    </div>
                    <div className="mt-1 font-medium text-[var(--ink)]">
                      {run.carouselCount} carousels · {run.videoCount} videos · {run.marketingScriptCount} marketing scripts
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={`/results/${run.id}`} className={buttonStyles({ variant: "primary" })}>
                    Open results workspace
                  </Link>
                  <Link
                    href={`/api/runs/${run.id}/export?format=html`}
                    className={buttonStyles({ variant: "secondary" })}
                  >
                    Download handoff HTML
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="space-y-4">
          <h2 className="text-3xl font-semibold text-[var(--ink)]">No saved runs yet</h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
            History populates automatically after the first generation run. Use a preset sample on the generate page for a fast end-to-end walkthrough, then return here to show persistence and export continuity.
          </p>
          <Link href="/generate" className={buttonStyles({ variant: "primary" })}>
            Generate a run
          </Link>
        </Card>
      )}
    </div>
  );
}
