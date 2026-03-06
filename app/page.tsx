import Link from "next/link";
import { ArrowRight, Bot, BriefcaseBusiness, FileOutput, Workflow } from "lucide-react";

import { ArchitectureFlow } from "@/components/sections/architecture-flow";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { productFeatures } from "@/lib/constants";
import { getAiRuntimeStatus } from "@/lib/ai/config";
import { listRunSummaries } from "@/lib/storage/runs";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

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
              <Badge tone={runtime.activeMode === "misconfigured" ? "warning" : "accent"}>
                {runtime.activeMode === "claude"
                  ? "Live Claude generation"
                  : runtime.activeMode === "misconfigured"
                    ? "Claude configuration needed"
                    : "Demo-safe generation"}
              </Badge>
              <h1 className="max-w-4xl font-display text-6xl leading-none text-[var(--ink)] sm:text-7xl">
                Turn a compact agent brief into a polished month of social content.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--ink-soft)]">
                AI Real Estate Content Engine transforms a few business inputs into a
                structured 30-day campaign with captions, carousel outlines, video
                scripts, hashtags, image prompts, and exportable deliverables.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/generate" className={buttonStyles({ variant: "primary", size: "lg" })}>
                Start a content plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/architecture" className={buttonStyles({ variant: "secondary", size: "lg" })}>
                See the system
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="space-y-2 bg-white/75">
                <p className="eyebrow">Campaign Output</p>
                <p className="text-3xl font-semibold text-[var(--ink)]">30 + 10 + 10</p>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  Daily posts, carousel outlines, and short-form video scripts in one run.
                </p>
              </Card>
              <Card className="space-y-2 bg-white/75">
                <p className="eyebrow">Model Modes</p>
                <p className="text-3xl font-semibold text-[var(--ink)]">Demo / Claude</p>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  Swap providers without changing the UI or the application contract.
                </p>
              </Card>
              <Card className="space-y-2 bg-white/75">
                <p className="eyebrow">Export Paths</p>
                <p className="text-3xl font-semibold text-[var(--ink)]">MD / JSON / HTML</p>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  Includes a print-ready report flow for polished demos and handoffs.
                </p>
              </Card>
            </div>
          </div>

          <Card className="flex flex-col justify-between gap-6 bg-[linear-gradient(180deg,rgba(25,34,53,0.98),rgba(17,94,89,0.94))] text-white">
            <div className="space-y-3">
              <p className="eyebrow !text-teal-200">Why it feels credible</p>
              <h2 className="font-display text-4xl leading-none">Automation system first, prompt wrapper second.</h2>
              <p className="text-sm leading-7 text-white/80">
                The app exposes its orchestration, storage, formatting, and export
                layers so a recruiter or client can understand the system in one pass.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                {
                  icon: Workflow,
                  title: "Brief to deliverable pipeline",
                  body: "Provider calls sit behind a service layer and feed a strict content-plan schema.",
                },
                {
                  icon: Bot,
                  title: "Demo mode with real structure",
                  body: "No API key required. The same orchestration, formatting, storage, and export layers still run.",
                },
                {
                  icon: FileOutput,
                  title: "Handoff-ready outputs",
                  body: "Every run can be reopened, reviewed, and delivered as markdown, JSON, HTML, or PDF via print view.",
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
          title="Designed to impress quickly and still hold up under inspection"
          description="The interface is polished enough for a portfolio walkthrough, while the implementation stays grounded in reusable TypeScript, typed schemas, local persistence, and deliberate separation of concerns."
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
          eyebrow="Business Impact"
          title="Why this matters beyond the UI"
          description="The project demonstrates a practical AI workflow for marketing operations: faster planning, more consistent positioning, and cleaner delivery."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: BriefcaseBusiness,
              title: "Cuts planning time dramatically",
              body: "A brief that would normally lead to hours of manual content planning becomes a reusable campaign system in one generation flow.",
            },
            {
              icon: Workflow,
              title: "Keeps the message consistent",
              body: "Tone, niche, audience, and CTA stay visible from intake through export, which reduces drift across the month.",
            },
            {
              icon: FileOutput,
              title: "Improves handoff quality",
              body: "The deliverables are organized for review inside the app and clean enough to hand directly to clients, coordinators, or designers.",
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
          title="Local history for repeat demos and side-by-side brief comparison"
          description="Generated plans are stored in lightweight local JSON files so you can reopen them instantly, compare different briefs, and prove that the system persists useful work."
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="space-y-2">
            <p className="eyebrow">Saved Runs</p>
            <p className="text-4xl font-semibold text-[var(--ink)]">{runs.length}</p>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Local history makes the project easy to demo without extra infrastructure.
            </p>
          </Card>
          <Card className="space-y-2">
            <p className="eyebrow">Posts Generated</p>
            <p className="text-4xl font-semibold text-[var(--ink)]">{totalPosts}</p>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Stored runs include all captions, scripts, prompts, and exportable assets.
            </p>
          </Card>
          <Card className="space-y-2">
            <p className="eyebrow">Demo Strength</p>
            <p className="text-2xl font-semibold text-[var(--ink)]">Zero-key walkthrough</p>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Demo mode still exercises the real workflow, not a dead-end mock screen.
            </p>
          </Card>
        </div>
        {recentRuns.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {recentRuns.map((run) => (
              <Card key={run.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{run.modeUsed} mode</p>
                    <h3 className="text-2xl font-semibold text-[var(--ink)]">
                      {run.agentName}
                    </h3>
                  </div>
                  <Badge tone={run.modeUsed === "claude" ? "accent" : "neutral"}>
                    {run.totalPosts} posts
                  </Badge>
                </div>
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  {run.campaignTitle}
                </p>
                <div className="grid gap-2 text-sm text-[var(--ink-soft)]">
                  <div>Market: {run.city}</div>
                  <div>Niche: {run.niche}</div>
                  <div>Saved: {formatDateTime(run.createdAt)}</div>
                </div>
                <Link href={`/results/${run.id}`} className={buttonStyles({ variant: "outline" })}>
                  Open results
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-start gap-4">
            <h3 className="text-2xl font-semibold text-[var(--ink)]">No generated runs yet</h3>
            <p className="max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Create the first plan to populate the history view. The app stores each run
              locally so you can return to the same results during demos instead of starting over.
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
