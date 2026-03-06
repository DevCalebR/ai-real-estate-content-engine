import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { listRunSummaries } from "@/lib/storage/runs";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

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
            Every saved run retains its calendar, captions, scripts, and export assets.
          </p>
        </Card>
        <Card className="space-y-2">
          <p className="eyebrow">Demo Value</p>
          <p className="text-2xl font-semibold text-[var(--ink)]">Fast comparison</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            Useful for showing how different briefs change the output and strategy.
          </p>
        </Card>
      </div>

      {runs.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {runs.map((run) => (
            <Card key={run.id} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">{run.modeUsed} mode</p>
                  <h2 className="text-3xl font-semibold text-[var(--ink)]">{run.agentName}</h2>
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
                    Market
                  </div>
                  <div className="mt-1 font-medium text-[var(--ink)]">{run.city}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                    Niche
                  </div>
                  <div className="mt-1 font-medium text-[var(--ink)]">{run.niche}</div>
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
                    Saved
                  </div>
                  <div className="mt-1 font-medium text-[var(--ink)]">
                    {formatDateTime(run.createdAt)}
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
          ))}
        </div>
      ) : (
        <Card className="space-y-4">
          <h2 className="text-3xl font-semibold text-[var(--ink)]">No saved runs yet</h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
            History populates automatically after the first generation run. Use the sample
            brief on the generate page for a fast end-to-end walkthrough, then return here
            to show persistence and export continuity.
          </p>
          <Link href="/generate" className={buttonStyles({ variant: "primary" })}>
            Generate a run
          </Link>
        </Card>
      )}
    </div>
  );
}
