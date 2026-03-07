import { getContentPreset } from "@/lib/content-presets";
import {
  contentTypeOptions,
  marketingScriptFormatOptions,
  platformOptions,
  type GenerationInput,
} from "@/lib/types/content";

export function buildContentPlanPrompt(input: GenerationInput) {
  const preset = getContentPreset(input.preset);

  const system = [
    "You are an expert social content strategist who builds monthly content systems for businesses across multiple niches.",
    "Return only valid JSON.",
    "Do not use markdown fences.",
    "Match the requested platforms, voice, goals, and CTA on every relevant asset.",
    `The selected preset is ${preset.label}. ${preset.promptGuidance}`,
    "Make the output feel commercially useful, specific, and client-ready rather than generic AI filler.",
  ].join(" ");

  const user = `
Build a 30-day social media content plan from this brief:

- Product name: Monthly AI Content Engine
- Brand attribution: Product by RelayWorks
- Selected preset: ${preset.label}
- Business / brand name: ${input.businessName}
- Niche / industry: ${input.niche}
- Target audience: ${input.targetAudience}
- Offer / service / product: ${input.offer}
- Goals: ${input.goals}
- Tone / brand voice: ${input.tone}
- Primary call to action: ${input.primaryCta}
- Key themes / campaign focus: ${input.keyThemes}
- Extra context: ${input.extraContext || "None provided"}
- Preferred platforms: ${input.platforms.join(", ")}

Requirements:
- Create exactly 30 monthlyCalendar entries, one for each day 1-30.
- Use only these content types: ${contentTypeOptions.join(", ")}.
- Include exactly 10 carousel outlines, exactly 10 short-form video scripts, and exactly 10 marketing scripts.
- Monthly calendar entries must each include: day, contentType, theme, angle, caption, hashtags, cta, platformFocus, imagePrompt.
- Hashtags should be platform-appropriate and specific to the niche, business, and offer.
- Carousels must include 5-8 slides with concise headline/body copy.
- Video scripts must include a hook, 3-5 body beats, and a CTA.
- Marketing scripts must include: day, title, theme, format, hook, body, cta.
- Favor strategic social content that can realistically build awareness, trust, traffic, or conversions for the stated goals.
- When the preset is SaaS / Productized Service, make the content especially strong for promoting products, services, websites, demos, signups, and traffic generation.
- Use real business language, not prompt language.

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
  ],
  "marketingScripts": [
    {
      "day": 1,
      "title": "string",
      "theme": "string",
      "format": "${marketingScriptFormatOptions[0]}",
      "hook": "string",
      "body": ["string"],
      "cta": "string"
    }
  ]
}`.trim();

  return { system, user };
}
