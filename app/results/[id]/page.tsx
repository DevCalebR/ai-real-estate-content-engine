import Link from "next/link";
import { notFound } from "next/navigation";

import { ResultsTabs } from "@/components/results/results-tabs";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getContentPlan } from "@/lib/storage/runs";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getContentPlan(id);

  if (!plan) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone={plan.modeUsed === "claude" ? "accent" : "neutral"}>
              {plan.modeUsed} mode
            </Badge>
            <span className="text-sm text-[var(--ink-soft)]">
              Saved {formatDateTime(plan.createdAt)}
            </span>
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-5xl leading-none text-[var(--ink)]">
              {plan.summary.campaignTitle}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--ink-soft)]">
              {plan.summary.positioning}
            </p>
            <p className="max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
              {plan.summary.narrative}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Calendar Days" value={String(plan.stats.totalPosts)} />
            <Metric label="Carousel Outlines" value={String(plan.stats.carouselCount)} />
            <Metric label="Video Scripts" value={String(plan.stats.videoCount)} />
            <Metric label="Primary Platforms" value={String(plan.stats.primaryPlatforms.length)} />
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="eyebrow">Campaign Snapshot</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            This panel keeps the original brief visible so a reviewer can quickly verify that
            the output matches the agent, market, audience, and CTA.
          </p>
          <div className="grid gap-3 text-sm leading-7 text-[var(--ink-soft)]">
            <div>
              <strong className="text-[var(--ink)]">Agent:</strong> {plan.input.agentName}
            </div>
            <div>
              <strong className="text-[var(--ink)]">Market:</strong> {plan.input.city}
            </div>
            <div>
              <strong className="text-[var(--ink)]">Niche:</strong> {plan.input.niche}
            </div>
            <div>
              <strong className="text-[var(--ink)]">Audience:</strong>{" "}
              {plan.input.targetAudience}
            </div>
            <div>
              <strong className="text-[var(--ink)]">Tone:</strong> {plan.input.tone}
            </div>
            <div>
              <strong className="text-[var(--ink)]">CTA:</strong> {plan.input.primaryCta}
            </div>
            {plan.input.listingHighlights ? (
              <div>
                <strong className="text-[var(--ink)]">Listing highlights:</strong>{" "}
                {plan.input.listingHighlights}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/generate" className={buttonStyles({ variant: "secondary" })}>
              Generate another plan
            </Link>
            <Link href={`/results/${plan.id}/print`} className={buttonStyles({ variant: "outline" })}>
              Open print view
            </Link>
          </div>
        </Card>
      </section>

      <ResultsTabs plan={plan} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white/80 p-4">
      <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-[var(--ink)]">{value}</div>
    </div>
  );
}
