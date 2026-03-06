import type { GenerationInput } from "@/lib/types/content";

export const tonePresets = [
  "Confident local advisor",
  "Luxury editorial",
  "Warm first-time buyer coach",
  "Investor-focused and data-driven",
  "Relocation concierge",
] as const;

export const nicheSuggestions = [
  "Luxury homes",
  "First-time buyers",
  "Relocation clients",
  "Investors",
  "Downsizers",
  "New construction",
] as const;

export const productFeatures = [
  {
    title: "Month-long campaign output",
    description:
      "Turn a compact agent brief into a full calendar of posts, scripts, outlines, and creative prompts.",
  },
  {
    title: "Credible AI systems design",
    description:
      "Provider abstraction, prompt modules, schema validation, and formatting layers keep the project legible and production-minded.",
  },
  {
    title: "Demo-safe without shortcuts",
    description:
      "The included demo mode still exercises the same orchestration, storage, and export pipeline, so the walkthrough feels real.",
  },
  {
    title: "Client-ready handoff",
    description:
      "Download markdown, JSON, and a polished HTML report, or open a clean print view for browser PDF export.",
  },
] as const;

export const architectureSteps = [
  {
    title: "Input Form",
    description:
      "Capture the agent brief, market, audience, tone, CTA, and platforms in one clean intake step.",
  },
  {
    title: "AI Orchestration",
    description:
      "Route the same brief through demo mode or Claude without changing the rest of the application.",
  },
  {
    title: "Structured Content Generation",
    description:
      "Generate a strict JSON content package instead of loose paragraphs so the output can be trusted and reused.",
  },
  {
    title: "Formatting Engine",
    description:
      "Normalize the raw output into polished day-by-day deliverables with dates, captions, hashtags, and prompts.",
  },
  {
    title: "Export Deliverables",
    description:
      "Package the final plan into handoff files a client, recruiter, or internal team can understand immediately.",
  },
] as const;

export const demoBrief: GenerationInput = {
  agentName: "Avery Nolan Properties",
  city: "Charleston, SC",
  niche: "Relocation clients and luxury coastal homes",
  targetAudience:
    "High-income professionals moving from the Northeast who want a polished local expert",
  tone: "Luxury editorial with warm concierge energy",
  primaryCta: "Book a relocation strategy call",
  listingHighlights:
    "Waterfront homes, walkable historic neighborhoods, turnkey interiors, private outdoor space",
  platforms: ["Instagram", "LinkedIn", "Facebook"],
};

export const sampleBriefJson = JSON.stringify(demoBrief, null, 2);
