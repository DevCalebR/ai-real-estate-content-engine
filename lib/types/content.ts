import { z } from "zod";

export const platformOptions = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "TikTok",
  "X / Twitter",
] as const;

export const contentTypeOptions = [
  "Single image",
  "Carousel",
  "Short-form video",
] as const;

export const contentPresetOptions = [
  "real-estate",
  "coach-consultant",
  "saas-productized-service",
  "e-commerce",
  "local-business",
  "creator-brand",
] as const;

export const marketingScriptFormatOptions = [
  "Traffic driver",
  "Offer push",
  "Customer story",
  "Objection handler",
  "Launch sequence",
] as const;

export const runtimeModeOptions = ["demo", "claude"] as const;

export const generationInputSchema = z.object({
  preset: z.enum(contentPresetOptions),
  businessName: z
    .string()
    .trim()
    .min(2, "Business or brand name is required.")
    .max(80, "Keep the business name under 80 characters."),
  niche: z
    .string()
    .trim()
    .min(2, "Describe the niche or industry.")
    .max(80, "Keep the niche under 80 characters."),
  targetAudience: z
    .string()
    .trim()
    .min(8, "Describe who the content should attract.")
    .max(220, "Keep the audience summary under 220 characters."),
  offer: z
    .string()
    .trim()
    .min(4, "Describe the offer, service, or product.")
    .max(140, "Keep the offer under 140 characters."),
  goals: z
    .string()
    .trim()
    .min(8, "Describe the campaign goals.")
    .max(220, "Keep the goals under 220 characters."),
  tone: z
    .string()
    .trim()
    .min(4, "Describe the tone or brand voice.")
    .max(120, "Keep the tone under 120 characters."),
  primaryCta: z
    .string()
    .trim()
    .min(4, "Primary call to action is required.")
    .max(120, "Keep the CTA under 120 characters."),
  keyThemes: z
    .string()
    .trim()
    .min(8, "List the key themes or campaign focus.")
    .max(320, "Keep the key themes under 320 characters."),
  extraContext: z
    .string()
    .trim()
    .max(500, "Keep the extra context under 500 characters.")
    .optional()
    .transform((value) => value ?? ""),
  platforms: z
    .array(z.enum(platformOptions))
    .min(1, "Select at least one platform.")
    .max(platformOptions.length),
});

export const rawCalendarPostSchema = z.object({
  day: z.number().int().min(1).max(30),
  contentType: z.enum(contentTypeOptions),
  theme: z.string().trim().min(3).max(120),
  angle: z.string().trim().min(8).max(220),
  caption: z.string().trim().min(30).max(1200),
  hashtags: z.array(z.string().trim().min(2).max(40)).min(5).max(12),
  cta: z.string().trim().min(4).max(120),
  platformFocus: z.array(z.enum(platformOptions)).min(1).max(platformOptions.length),
  imagePrompt: z.string().trim().min(12).max(320),
});

export const carouselSlideSchema = z.object({
  slide: z.number().int().min(1).max(10),
  title: z.string().trim().min(2).max(80),
  body: z.string().trim().min(8).max(180),
});

export const rawCarouselSchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().trim().min(4).max(100),
  theme: z.string().trim().min(3).max(120),
  cta: z.string().trim().min(4).max(120),
  slides: z.array(carouselSlideSchema).min(5).max(8),
});

export const rawVideoScriptSchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().trim().min(4).max(100),
  theme: z.string().trim().min(3).max(120),
  hook: z.string().trim().min(8).max(150),
  body: z.array(z.string().trim().min(8).max(180)).min(3).max(5),
  cta: z.string().trim().min(4).max(120),
});

export const rawMarketingScriptSchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().trim().min(4).max(100),
  theme: z.string().trim().min(3).max(120),
  format: z.enum(marketingScriptFormatOptions),
  hook: z.string().trim().min(8).max(150),
  body: z.array(z.string().trim().min(8).max(180)).min(3).max(5),
  cta: z.string().trim().min(4).max(120),
});

export const rawGenerationOutputSchema = z.object({
  strategySummary: z.object({
    campaignTitle: z.string().trim().min(3).max(120),
    positioning: z.string().trim().min(20).max(240),
    narrative: z.string().trim().min(30).max(340),
  }),
  monthlyCalendar: z.array(rawCalendarPostSchema).length(30),
  carousels: z.array(rawCarouselSchema).length(10),
  videoScripts: z.array(rawVideoScriptSchema).length(10),
  marketingScripts: z.array(rawMarketingScriptSchema).length(10),
});

export const finalCalendarPostSchema = rawCalendarPostSchema.extend({
  postId: z.string().trim().min(4).max(40),
  publishDate: z.string().trim().min(10).max(40),
});

export const captionEntrySchema = z.object({
  postId: z.string().trim().min(4).max(40),
  day: z.number().int().min(1).max(30),
  contentType: z.enum(contentTypeOptions),
  theme: z.string().trim().min(3).max(120),
  caption: z.string().trim().min(30).max(1200),
});

export const hashtagEntrySchema = z.object({
  postId: z.string().trim().min(4).max(40),
  day: z.number().int().min(1).max(30),
  theme: z.string().trim().min(3).max(120),
  hashtags: z.array(z.string().trim().min(2).max(40)).min(5).max(12),
});

export const imagePromptEntrySchema = z.object({
  postId: z.string().trim().min(4).max(40),
  day: z.number().int().min(1).max(30),
  theme: z.string().trim().min(3).max(120),
  prompt: z.string().trim().min(12).max(320),
});

export const generatedContentPlanSchema = z.object({
  id: z.string().trim().min(6).max(64),
  createdAt: z.string().trim().min(10).max(40),
  modeUsed: z.enum(runtimeModeOptions),
  input: generationInputSchema,
  summary: rawGenerationOutputSchema.shape.strategySummary,
  stats: z.object({
    totalPosts: z.number().int().min(30).max(30),
    carouselCount: z.number().int().min(10).max(10),
    videoCount: z.number().int().min(10).max(10),
    marketingScriptCount: z.number().int().min(10).max(10),
    primaryPlatforms: z.array(z.enum(platformOptions)).min(1).max(platformOptions.length),
  }),
  deliverables: z.object({
    monthlyContentCalendar: z.array(finalCalendarPostSchema).length(30),
    captions: z.array(captionEntrySchema).length(30),
    carouselText: z.array(rawCarouselSchema).length(10),
    videoScripts: z.array(rawVideoScriptSchema).length(10),
    marketingScripts: z.array(rawMarketingScriptSchema).length(10),
    hashtags: z.array(hashtagEntrySchema).length(30),
    imagePrompts: z.array(imagePromptEntrySchema).length(30),
  }),
});

export const runSummarySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  modeUsed: z.enum(runtimeModeOptions),
  businessName: z.string(),
  preset: z.enum(contentPresetOptions),
  niche: z.string(),
  offer: z.string(),
  campaignTitle: z.string(),
  totalPosts: z.number().int(),
  carouselCount: z.number().int(),
  videoCount: z.number().int(),
  marketingScriptCount: z.number().int(),
  primaryPlatforms: z.array(z.enum(platformOptions)),
});

export type Platform = (typeof platformOptions)[number];
export type ContentType = (typeof contentTypeOptions)[number];
export type ContentPresetKey = (typeof contentPresetOptions)[number];
export type MarketingScriptFormat = (typeof marketingScriptFormatOptions)[number];
export type RuntimeMode = (typeof runtimeModeOptions)[number];

export type GenerationInput = z.infer<typeof generationInputSchema>;
export type RawCalendarPost = z.infer<typeof rawCalendarPostSchema>;
export type RawCarousel = z.infer<typeof rawCarouselSchema>;
export type RawVideoScript = z.infer<typeof rawVideoScriptSchema>;
export type RawMarketingScript = z.infer<typeof rawMarketingScriptSchema>;
export type RawGenerationOutput = z.infer<typeof rawGenerationOutputSchema>;
export type FinalCalendarPost = z.infer<typeof finalCalendarPostSchema>;
export type GeneratedContentPlan = z.infer<typeof generatedContentPlanSchema>;
export type RunSummary = z.infer<typeof runSummarySchema>;

export function buildRunSummary(plan: GeneratedContentPlan): RunSummary {
  return {
    id: plan.id,
    createdAt: plan.createdAt,
    modeUsed: plan.modeUsed,
    businessName: plan.input.businessName,
    preset: plan.input.preset,
    niche: plan.input.niche,
    offer: plan.input.offer,
    campaignTitle: plan.summary.campaignTitle,
    totalPosts: plan.stats.totalPosts,
    carouselCount: plan.stats.carouselCount,
    videoCount: plan.stats.videoCount,
    marketingScriptCount: plan.stats.marketingScriptCount,
    primaryPlatforms: plan.stats.primaryPlatforms,
  };
}
