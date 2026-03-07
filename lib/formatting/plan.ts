import { randomUUID } from "node:crypto";

import {
  generatedContentPlanSchema,
  type FinalCalendarPost,
  type GenerationInput,
  type GeneratedContentPlan,
  type RawMarketingScript,
  type RawGenerationOutput,
  type RuntimeMode,
} from "@/lib/types/content";
import { clampText, slugify } from "@/lib/utils";

function buildPublishDate(day: number, createdAt: string) {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + (day - 1));
  return date.toISOString();
}

export function formatContentPlan({
  rawOutput,
  input,
  modeUsed,
  createdAt = new Date().toISOString(),
  id,
}: {
  rawOutput: RawGenerationOutput;
  input: GenerationInput;
  modeUsed: RuntimeMode;
  createdAt?: string;
  id?: string;
}): GeneratedContentPlan {
  const calendar = rawOutput.monthlyCalendar
    .slice()
    .sort((left, right) => left.day - right.day)
    .map<FinalCalendarPost>((entry) => ({
      ...entry,
      theme: clampText(entry.theme, 100),
      angle: clampText(entry.angle, 220),
      caption: clampText(entry.caption, 1200),
      hashtags: entry.hashtags.map((tag) => clampText(tag, 40)).slice(0, 12),
      cta: clampText(entry.cta, 120),
      imagePrompt: clampText(entry.imagePrompt, 320),
      postId: `d${String(entry.day).padStart(2, "0")}-${slugify(entry.theme).slice(0, 20)}`,
      publishDate: buildPublishDate(entry.day, createdAt),
    }));

  const marketingScripts = rawOutput.marketingScripts
    .slice()
    .sort((left, right) => left.day - right.day)
    .map<RawMarketingScript>((script) => ({
      ...script,
      title: clampText(script.title, 100),
      theme: clampText(script.theme, 120),
      hook: clampText(script.hook, 150),
      body: script.body.map((beat) => clampText(beat, 180)).slice(0, 5),
      cta: clampText(script.cta, 120),
    }))
    .slice(0, 10);

  const plan: GeneratedContentPlan = {
    id: id ?? `run-${createdAt.slice(0, 10)}-${randomUUID().slice(0, 8)}`,
    createdAt,
    modeUsed,
    input,
    summary: {
      campaignTitle: clampText(rawOutput.strategySummary.campaignTitle, 120),
      positioning: clampText(rawOutput.strategySummary.positioning, 220),
      narrative: clampText(rawOutput.strategySummary.narrative, 320),
    },
    stats: {
      totalPosts: calendar.length,
      carouselCount: rawOutput.carousels.length,
      videoCount: rawOutput.videoScripts.length,
      marketingScriptCount: marketingScripts.length,
      primaryPlatforms: input.platforms,
    },
    deliverables: {
      monthlyContentCalendar: calendar,
      captions: calendar.map((entry) => ({
        postId: entry.postId,
        day: entry.day,
        contentType: entry.contentType,
        theme: entry.theme,
        caption: entry.caption,
      })),
      carouselText: rawOutput.carousels
        .slice()
        .sort((left, right) => left.day - right.day)
        .map((carousel) => ({
          ...carousel,
          title: clampText(carousel.title, 100),
          theme: clampText(carousel.theme, 100),
          cta: clampText(carousel.cta, 120),
          slides: carousel.slides.map((slide) => ({
            ...slide,
            title: clampText(slide.title, 80),
            body: clampText(slide.body, 180),
          })),
        }))
        .slice(0, 10),
      videoScripts: rawOutput.videoScripts
        .slice()
        .sort((left, right) => left.day - right.day)
        .map((script) => ({
          ...script,
          title: clampText(script.title, 100),
          theme: clampText(script.theme, 100),
          hook: clampText(script.hook, 150),
          body: script.body.map((beat) => clampText(beat, 180)).slice(0, 5),
          cta: clampText(script.cta, 120),
        }))
        .slice(0, 10),
      marketingScripts,
      hashtags: calendar.map((entry) => ({
        postId: entry.postId,
        day: entry.day,
        theme: entry.theme,
        hashtags: entry.hashtags,
      })),
      imagePrompts: calendar.map((entry) => ({
        postId: entry.postId,
        day: entry.day,
        theme: entry.theme,
        prompt: entry.imagePrompt,
      })),
    },
  };

  return generatedContentPlanSchema.parse(plan);
}
