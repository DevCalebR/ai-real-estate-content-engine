import {
  contentTypeOptions,
  platformOptions,
  type GenerationInput,
} from "@/lib/types/content";

export function buildContentPlanPrompt(input: GenerationInput) {
  const system = [
    "You are an expert real estate marketing strategist and social content planner.",
    "Return only valid JSON.",
    "Do not use markdown fences.",
    "Match the requested platforms, voice, and CTA on every relevant asset.",
    "Create realistic, specific, high-value content for a real estate agent.",
  ].join(" ");

  const user = `
Build a 30-day real estate social media content plan from this brief:

- Agent/business name: ${input.agentName}
- City/location: ${input.city}
- Niche: ${input.niche}
- Target audience: ${input.targetAudience}
- Tone/brand voice: ${input.tone}
- Primary call to action: ${input.primaryCta}
- Listing/property highlights: ${input.listingHighlights || "None provided"}
- Preferred platforms: ${input.platforms.join(", ")}

Requirements:
- Create exactly 30 monthlyCalendar entries, one for each day 1-30.
- Use only these content types: ${contentTypeOptions.join(", ")}.
- Include exactly 10 carousel outlines and exactly 10 short-form video scripts.
- Monthly calendar entries must each include: day, contentType, theme, angle, caption, hashtags, cta, platformFocus, imagePrompt.
- Hashtags should be platform-appropriate and unique enough to feel tailored.
- Carousels must include 5-8 slides with concise headline/body copy.
- Video scripts must include a hook, 3-5 body beats, and a CTA.
- Favor specificity about the local market, buyer psychology, and agent positioning.
- Keep captions polished and client-facing, not generic prompt output.

Return this JSON shape exactly:
{
  "strategySummary": {
    "campaignTitle": "string",
    "positioning": "string",
    "narrative": "string"
  },
  "monthlyCalendar": [
    {
      "day": 1,
      "contentType": "${contentTypeOptions[0]}",
      "theme": "string",
      "angle": "string",
      "caption": "string",
      "hashtags": ["#example"],
      "cta": "string",
      "platformFocus": ["${platformOptions[0]}"],
      "imagePrompt": "string"
    }
  ],
  "carousels": [
    {
      "day": 1,
      "title": "string",
      "theme": "string",
      "cta": "string",
      "slides": [
        { "slide": 1, "title": "string", "body": "string" }
      ]
    }
  ],
  "videoScripts": [
    {
      "day": 1,
      "title": "string",
      "theme": "string",
      "hook": "string",
      "body": ["string"],
      "cta": "string"
    }
  ]
}`.trim();

  return { system, user };
}
