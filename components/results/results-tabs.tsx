"use client";

import { useState } from "react";

import { CopyButton } from "@/components/ui/copy-button";
import { Card } from "@/components/ui/card";
import { ExportButtons } from "@/components/results/export-buttons";
import type { ContentType, GeneratedContentPlan } from "@/lib/types/content";
import type { GoogleDocsIntegrationStatus } from "@/lib/types/integrations";
import { cn, formatDate } from "@/lib/utils";

const tabs = [
  { key: "calendar", label: "Calendar" },
  { key: "captions", label: "Captions" },
  { key: "carousels", label: "Carousels" },
  { key: "videos", label: "Video Scripts" },
  { key: "hashtags", label: "Hashtags" },
  { key: "images", label: "Image Prompts" },
  { key: "exports", label: "Exports" },
] as const;

const calendarFilters: Array<ContentType | "All"> = [
  "All",
  "Single image",
  "Carousel",
  "Short-form video",
];

type TabKey = (typeof tabs)[number]["key"];

export function ResultsTabs({
  plan,
  googleDocsStatus,
}: {
  plan: GeneratedContentPlan;
  googleDocsStatus: GoogleDocsIntegrationStatus;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("calendar");
  const [calendarFilter, setCalendarFilter] = useState<ContentType | "All">("All");
  const tabCounts: Record<TabKey, number> = {
    calendar: plan.deliverables.monthlyContentCalendar.length,
    captions: plan.deliverables.captions.length,
    carousels: plan.deliverables.carouselText.length,
    videos: plan.deliverables.videoScripts.length,
    hashtags: plan.deliverables.hashtags.length,
    images: plan.deliverables.imagePrompts.length,
    exports: 4,
  };

  const filteredCalendar = plan.deliverables.monthlyContentCalendar.filter((entry) =>
    calendarFilter === "All" ? true : entry.contentType === calendarFilter,
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Deliverable Workspace</p>
            <h2 className="text-3xl font-semibold text-[var(--ink)]">
              Review the plan by deliverable type, then export the final handoff
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
              The calendar is optimized for day-by-day review, while the other tabs break
              the same run into captions, carousel copy, video scripts, hashtags, and image prompts.
            </p>
          </div>
          <div className="grid min-w-[220px] gap-3 rounded-[24px] bg-white/80 p-4 text-sm text-[var(--ink-soft)]">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Primary CTA
              </div>
              <div className="mt-1 font-medium text-[var(--ink)]">{plan.input.primaryCta}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Primary platforms
              </div>
              <div className="mt-1 font-medium text-[var(--ink)]">
                {plan.stats.primaryPlatforms.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              activeTab === tab.key
                ? "bg-[var(--ink)] text-white shadow-[0_12px_30px_rgba(24,32,51,0.18)]"
                : "bg-white/70 text-[var(--ink-soft)] ring-1 ring-[rgba(25,34,53,0.1)] hover:text-[var(--ink)]",
            )}
          >
            {tab.label} ({tabCounts[tab.key]})
          </button>
        ))}
      </div>

      {activeTab === "calendar" ? (
        <section className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {calendarFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setCalendarFilter(filter)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  calendarFilter === filter
                    ? "bg-teal-700 text-white"
                    : "bg-white/70 text-[var(--ink-soft)] ring-1 ring-[rgba(25,34,53,0.1)]",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredCalendar.length > 0 ? (
              filteredCalendar.map((entry) => (
                <Card key={entry.postId} className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">Day {entry.day}</p>
                      <h3 className="text-2xl font-semibold text-[var(--ink)]">{entry.theme}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{entry.angle}</p>
                    </div>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                      {entry.contentType}
                    </span>
                  </div>
                  <div className="grid gap-3 rounded-[24px] bg-white/80 p-4 text-sm text-[var(--ink-soft)] sm:grid-cols-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                        Publish date
                      </div>
                      <div className="mt-1 font-medium text-[var(--ink)]">
                        {formatDate(entry.publishDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                        Platforms
                      </div>
                      <div className="mt-1 font-medium text-[var(--ink)]">
                        {entry.platformFocus.join(", ")}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                        CTA
                      </div>
                      <div className="mt-1 font-medium text-[var(--ink)]">{entry.cta}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-[var(--ink)]">Caption</h4>
                      <CopyButton value={entry.caption} label="Copy caption" />
                    </div>
                    <p className="text-sm leading-7 text-[var(--ink-soft)]">{entry.caption}</p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[var(--ink)]">Hashtags</h4>
                      <p className="text-sm leading-7 text-[var(--ink-soft)]">
                        {entry.hashtags.join(" ")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[var(--ink)]">Image prompt</h4>
                      <p className="text-sm leading-7 text-[var(--ink-soft)]">
                        {entry.imagePrompt}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="xl:col-span-2">
                <p className="text-sm leading-7 text-[var(--ink-soft)]">
                  No posts match that filter. Switch back to <strong>All</strong> to review the full calendar.
                </p>
              </Card>
            )}
          </div>
        </section>
      ) : null}

      {activeTab === "captions" ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {plan.deliverables.captions.map((entry) => (
            <Card key={entry.postId} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Day {entry.day}</p>
                  <h3 className="text-xl font-semibold text-[var(--ink)]">{entry.theme}</h3>
                </div>
                <CopyButton value={entry.caption} label="Copy" />
              </div>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{entry.caption}</p>
            </Card>
          ))}
        </section>
      ) : null}

      {activeTab === "carousels" ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {plan.deliverables.carouselText.map((carousel) => (
            <Card key={`${carousel.day}-${carousel.title}`} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Day {carousel.day} · Carousel</p>
                  <h3 className="text-2xl font-semibold text-[var(--ink)]">{carousel.title}</h3>
                </div>
                <CopyButton
                  value={carousel.slides
                    .map((slide) => `Slide ${slide.slide}: ${slide.title} — ${slide.body}`)
                    .join("\n")}
                  label="Copy outline"
                />
              </div>
              <div className="space-y-3">
                {carousel.slides.map((slide) => (
                  <div
                    key={`${carousel.day}-${slide.slide}`}
                    className="rounded-[22px] bg-white/80 p-4"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                      Slide {slide.slide}
                    </div>
                    <div className="mt-2 text-base font-semibold text-[var(--ink)]">
                      {slide.title}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{slide.body}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-[var(--ink)]">CTA: {carousel.cta}</p>
            </Card>
          ))}
        </section>
      ) : null}

      {activeTab === "videos" ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {plan.deliverables.videoScripts.map((script) => (
            <Card key={`${script.day}-${script.title}`} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Day {script.day} · Short-form video</p>
                  <h3 className="text-2xl font-semibold text-[var(--ink)]">{script.title}</h3>
                </div>
                <CopyButton
                  value={[script.hook, ...script.body, script.cta].join("\n")}
                  label="Copy script"
                />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--ink)]">Hook</h4>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{script.hook}</p>
              </div>
              <div>
                <h4 className="font-semibold text-[var(--ink)]">Body</h4>
                <ul className="mt-2 space-y-2 text-sm leading-7 text-[var(--ink-soft)]">
                  {script.body.map((beat) => (
                    <li key={beat} className="rounded-[18px] bg-white/70 px-4 py-3">
                      {beat}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm font-semibold text-[var(--ink)]">CTA: {script.cta}</p>
            </Card>
          ))}
        </section>
      ) : null}

      {activeTab === "hashtags" ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plan.deliverables.hashtags.map((entry) => (
            <Card key={`${entry.postId}-hashtags`} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Day {entry.day}</p>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">{entry.theme}</h3>
                </div>
                <CopyButton value={entry.hashtags.join(" ")} label="Copy" />
              </div>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{entry.hashtags.join(" ")}</p>
            </Card>
          ))}
        </section>
      ) : null}

      {activeTab === "images" ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {plan.deliverables.imagePrompts.map((entry) => (
            <Card key={`${entry.postId}-prompt`} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">Day {entry.day}</p>
                  <h3 className="text-lg font-semibold text-[var(--ink)]">{entry.theme}</h3>
                </div>
                <CopyButton value={entry.prompt} label="Copy prompt" />
              </div>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{entry.prompt}</p>
            </Card>
          ))}
        </section>
      ) : null}

      {activeTab === "exports" ? (
        <section className="space-y-5">
          <Card className="space-y-3">
            <p className="eyebrow">Export Deliverables</p>
            <h3 className="text-2xl font-semibold text-[var(--ink)]">
              Download clean handoff files or open the print-ready client report
            </h3>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">
              Use markdown for documentation, JSON for structured reuse, HTML for a polished
              standalone report, and the print view when you want to save a browser PDF during a demo.
            </p>
          </Card>
          <ExportButtons id={plan.id} googleDocsStatus={googleDocsStatus} />
        </section>
      ) : null}
    </div>
  );
}
