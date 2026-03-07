import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, FileOutput, Layers3, Sparkles, Workflow } from "lucide-react";

import { ArchitectureFlow } from "@/components/sections/architecture-flow";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { productByline, productDescription, productName } from "@/lib/brand";
import { getContentPreset } from "@/lib/content-presets";
import { productFeatures } from "@/lib/constants";
import { getAiRuntimeStatus } from "@/lib/ai/config";
import { listRunSummaries } from "@/lib/storage/runs";
import { contentPresetOptions } from "@/lib/types/content";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: productDescription,
};

export default async function HomePage() {
  const [runs, runtime] = await Promise.all([listRunSummaries(), getAiRuntimeStatus()]);
  const recentRuns = runs.slice(0, 3);
  const totalPosts = runs.reduce((total, run) => total + run.totalPosts, 0);

  return (
    <div className="space-y-20 pb-12">
      <section className="hero-grid relative overflow-hidden rounded-[40px] border border-white/70 bg-[rgba(255,253,248,0.82)] px-6 py-8 shadow-[0_28px_80px_rgba(24,32,51,0.1)] backdrop-blur sm:px-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone={runtime.activeMode === "misconfigured" ? "warning" : "accent"}>
                  {runtime.activeMode === "claude"
                    ? "Live Claude generation"
                    : runtime.activeMode === "misconfigured"
                      ? "Claude configuration needed"
                      : "Demo-safe generation"}
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-strong)]">
                  {productByline}
                </span>
              </div>
              <h1 className="max-w-4xl font-display text-6xl leading-none text-[var(--ink)] sm:text-7xl">
                {productName}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[var(--ink-soft)]">
                Plan, generate, and organize a full month of social content for any niche from one structured workflow.
              </p>
              <p className="max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
                This is a productized content operations system for businesses, brands, agencies, founders, and creators. One structured brief becomes a month-long content plan with strategic outputs, saved history, exportable reports, and a verified Google Docs delivery path.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/generate" className={buttonStyles({ variant: "primary", size: "lg" })}>
                Build a monthly plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/architecture" className={buttonStyles({ variant: "secondary", size: "lg" })}>
                See the workflow
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="space-y-2 bg-white/75">
                <p className="eyebrow">Output Mix</p>
                <p className="text-3xl font-semibold text-[var(--ink)]">30 + 10 + 10 + 10</p>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  Calendar posts, carousels, short-form videos, and marketing scripts in one run.
                </p>
              </Card>
              <Card className="space-y-2 bg-white/75">
                <p className="eyebrow">Preset Coverage</p>
                <p className="text-3xl font-semibold text-[var(--ink)]">6 niches</p>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  Real Estate, SaaS, coaches, e-commerce, local business, and creator brands.
                </p>
              </Card>
              <Card className="space-y-2 bg-white/75">
                <p className="eyebrow">Export Paths</p>
                <p className="text-3xl font-semibold text-[var(--ink)]">MD / JSON / HTML / Docs</p>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  Includes print view and Google Docs export for clean client-ready delivery.
                </p>
              </Card>
            </div>
          </div>

          <Card className="flex flex-col justify-between gap-6 bg-[linear-gradient(180deg,rgba(25,34,53,0.98),rgba(17,94,89,0.94))] text-white">
            <div className="space-y-3">
              <p className="eyebrow !text-teal-200">Why it feels credible</p>
              <h2 className="font-display text-4xl leading-none">
                A content operations product, not a one-off prompt box.
              </h2>
              <p className="text-sm leading-7 text-white/80">
                The app exposes its orchestration, storage, formatting, and export layers so a client or recruiter can understand the system quickly and trust that the workflow is real.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  icon: Workflow,
                  title: "Structured brief to deliverable pipeline",
                  body: "Preset-aware generation, schema validation, and formatting turn a brief into reusable campaign assets instead of loose AI paragraphs.",
                },
                {
                  icon: Bot,
                  title: "Demo mode with real product behavior",
                  body: "No API key required. Demo mode still exercises the same orchestration, storage, exports, and Google Docs path.",
                },
                {
                  icon: FileOutput,
                  title: "Delivery formats built in",
                  body: "Every run can be reopened, reviewed, exported, and handed off as markdown, JSON, HTML, print, or Google Docs.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/80">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      <section className="page-section space-y-8">
        <SectionHeading
          eyebrow="Feature Set"
          title="Built for monthly social content across industries"
          description="The interface sells the workflow fast, while the implementation stays grounded in reusable TypeScript, prompt modules, local persistence, and delivery-ready exports."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {productFeatures.map((feature) => (
            <Card key={feature.title} className="space-y-3">
              <h3 className="text-xl font-semibold text-[var(--ink)]">{feature.title}</h3>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-section space-y-8">
        <SectionHeading
          eyebrow="Supported Presets"
          title="Start with a preset, then tune the strategy to the business"
          description="Presets shape the planning logic without locking the product into one vertical. The SaaS / Productized Service path is optimized for traffic, signups, demos, and website clicks."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {contentPresetOptions.map((key) => {
              const preset = getContentPreset(key);

              return (
                <Card key={preset.key} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Layers3 className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--ink)]">{preset.label}</h3>
                  </div>
                  <p className="text-sm leading-7 text-[var(--ink-soft)]">{preset.description}</p>
                </Card>
              );
            })}
        </div>
      </section>

      <section className="page-section space-y-8">
        <SectionHeading
          eyebrow="Business Impact"
          title="Why this matters beyond a polished UI"
          description="The product demonstrates a practical AI workflow for marketing operations: faster planning, sharper positioning, and cleaner delivery across many kinds of businesses."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Cuts content planning time",
              body: "A brief that would normally lead to hours of manual ideation becomes a reusable monthly content engine in one workflow.",
            },
            {
              icon: Workflow,
              title: "Keeps strategy visible",
              body: "Preset, audience, offer, goals, tone, and CTA stay visible from intake through export so the content does not drift across the month.",
            },
            {
              icon: FileOutput,
              title: "Improves client handoff quality",
              body: "The outputs are organized for review inside the app and clean enough to hand directly to clients, designers, operators, or internal teams.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold text-[var(--ink)]">{item.title}</h3>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">{item.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="page-section space-y-8">
        <SectionHeading
          eyebrow="Recent Runs"
          title="Local history for repeat demos, proof, and comparison"
          description="Generated plans are stored in lightweight local JSON files so you can reopen them instantly, compare different briefs, and prove that the workflow persists useful work."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="space-y-2">
            <p className="eyebrow">Saved Runs</p>
            <p className="text-4xl font-semibold text-[var(--ink)]">{runs.length}</p>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Local history makes the product easy to demo without extra infrastructure.
            </p>
          </Card>
          <Card className="space-y-2">
            <p className="eyebrow">Posts Generated</p>
            <p className="text-4xl font-semibold text-[var(--ink)]">{totalPosts}</p>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Stored runs include captions, scripts, prompts, exports, and reusable brief context.
            </p>
          </Card>
          <Card className="space-y-2">
            <p className="eyebrow">Demo Strength</p>
            <p className="text-2xl font-semibold text-[var(--ink)]">Zero-key walkthrough</p>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Demo mode still exercises the real workflow instead of swapping in static placeholder screens.
            </p>
          </Card>
        </div>
        {recentRuns.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {recentRuns.map((run) => {
              const preset = getContentPreset(run.preset);

              return (
                <Card key={run.id} className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow">{run.modeUsed} mode</p>
                      <h3 className="text-2xl font-semibold text-[var(--ink)]">
                        {run.businessName}
                      </h3>
                    </div>
                    <Badge tone={run.modeUsed === "claude" ? "accent" : "neutral"}>
                      {run.totalPosts} posts
                    </Badge>
                  </div>
                  <p className="text-sm leading-7 text-[var(--ink-soft)]">{run.campaignTitle}</p>
                  <div className="grid gap-2 text-sm text-[var(--ink-soft)]">
                    <div>Preset: {preset.label}</div>
                    <div>Niche: {run.niche}</div>
                    <div>Offer: {run.offer}</div>
                    <div>Saved: {formatDateTime(run.createdAt)}</div>
                  </div>
                  <Link href={`/results/${run.id}`} className={buttonStyles({ variant: "outline" })}>
                    Open results
                  </Link>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="flex flex-col items-start gap-4">
            <h3 className="text-2xl font-semibold text-[var(--ink)]">No generated runs yet</h3>
            <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Create the first plan to populate the history view. The app stores each run locally so you can return to the same results during demos instead of starting over.
            </p>
            <Link href="/generate" className={buttonStyles({ variant: "primary" })}>
              Generate your first run
            </Link>
          </Card>
        )}
      </section>

      <section className="page-section">
        <ArchitectureFlow />
      </section>
    </div>
  );
}
