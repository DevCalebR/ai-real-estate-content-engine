import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintButton } from "@/components/results/print-button";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { productByline, productDescription, productName } from "@/lib/brand";
import { getContentPlan } from "@/lib/storage/runs";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const plan = await getContentPlan(id);

  return {
    title: plan ? `${plan.input.businessName} Print Report` : "Print Report",
    description: productDescription,
  };
}

export default async function PrintPage({
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
    <div className="space-y-8 pb-16">
      <div className="no-print flex flex-wrap gap-3">
        <Link href={`/results/${plan.id}`} className={buttonStyles({ variant: "secondary" })}>
          Back to results
        </Link>
        <PrintButton />
      </div>

      <section className="rounded-[32px] border border-[var(--line)] bg-white px-6 py-8 shadow-[0_18px_40px_rgba(24,32,51,0.06)]">
        <div className="space-y-4">
          <p className="eyebrow">{productName}</p>
          <p className="text-sm text-[var(--ink-soft)]">{productByline}</p>
          <h1 className="font-display text-5xl leading-none text-[var(--ink)]">
            {plan.summary.campaignTitle}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--ink-soft)]">
            {plan.summary.positioning}
          </p>
          <p className="text-sm text-[var(--ink-soft)]">
            Generated {formatDateTime(plan.createdAt)} in {plan.modeUsed} mode
          </p>
          <p className="text-sm text-[var(--ink-soft)]">
            {plan.input.businessName} · {plan.input.niche} · {plan.input.offer}
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          {plan.deliverables.monthlyContentCalendar.map((entry) => (
            <Card key={entry.postId} className="border border-[var(--line)] bg-white shadow-none">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">Day {entry.day}</p>
                  <h2 className="text-2xl font-semibold text-[var(--ink)]">{entry.theme}</h2>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  {entry.contentType}
                </span>
              </div>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--ink-soft)] sm:grid-cols-2">
                <div>
                  <strong className="text-[var(--ink)]">Publish date:</strong>{" "}
                  {formatDate(entry.publishDate)}
                </div>
                <div>
                  <strong className="text-[var(--ink)]">Platforms:</strong>{" "}
                  {entry.platformFocus.join(", ")}
                </div>
                <div>
                  <strong className="text-[var(--ink)]">CTA:</strong> {entry.cta}
                </div>
                <div>
                  <strong className="text-[var(--ink)]">Hashtags:</strong>{" "}
                  {entry.hashtags.join(" ")}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{entry.caption}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
                <strong className="text-[var(--ink)]">Image prompt:</strong> {entry.imagePrompt}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
