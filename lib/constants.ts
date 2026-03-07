import { contentPresets } from "@/lib/content-presets";
import type { ContentPresetKey, GenerationInput } from "@/lib/types/content";

export const tonePresets = [
  "Smart operator energy with commercial clarity",
  "Warm authority with sharp clarity",
  "Modern, polished, and direct",
  "Helpful educator with calm confidence",
  "Bold brand voice with practical substance",
] as const;

export const nicheSuggestions = [
  "AI automation systems",
  "Revenue strategy consulting",
  "Luxury coastal real estate",
  "E-commerce product launches",
  "Local wellness services",
  "Creator education products",
] as const;

export const productFeatures = [
  {
    title: "Full-month strategic output",
    description:
      "Turn one structured brief into a calendar, captions, carousels, short-form videos, marketing scripts, hashtags, and image prompts.",
  },
  {
    title: "Preset-aware content planning",
    description:
      "Real Estate, Coach / Consultant, SaaS / Productized Service, E-commerce, Local Business, and Creator Brand presets keep the workflow reusable across niches.",
  },
  {
    title: "Automation architecture you can explain",
    description:
      "Provider abstraction, prompt modules, schema validation, formatting layers, and exports make the product credible as an AI automation system.",
  },
  {
    title: "Client-ready delivery",
    description:
      "Download markdown, JSON, HTML, and print-friendly reports, or export directly into Google Docs through the verified OAuth flow.",
  },
] as const;

export const architectureSteps = [
  {
    title: "Input Form",
    description:
      "Capture the business context, preset, offer, audience, goals, brand voice, platforms, and campaign themes in one structured intake.",
  },
  {
    title: "AI Orchestration",
    description:
      "Route the same brief through demo mode or Claude behind a shared service layer so the product contract stays stable.",
  },
  {
    title: "Structured Content Generation",
    description:
      "Generate a strict JSON content package for the calendar, captions, carousels, videos, marketing scripts, hashtags, and image prompts.",
  },
  {
    title: "Formatting Engine",
    description:
      "Normalize the raw output into day-by-day deliverables with publish dates, grouped assets, and consistent metadata for review and export.",
  },
  {
    title: "Export Deliverables",
    description:
      "Package the final plan into markdown, JSON, HTML, print, and Google Docs handoff formats without changing the saved run structure.",
  },
] as const;

export const sampleBriefs: Record<ContentPresetKey, GenerationInput> = Object.fromEntries(
  Object.entries(contentPresets).map(([key, preset]) => [key, preset.sample]),
) as Record<ContentPresetKey, GenerationInput>;

export const demoBrief = sampleBriefs["saas-productized-service"];

export const sampleBriefJson = JSON.stringify(demoBrief, null, 2);
