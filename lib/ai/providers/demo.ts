import { getContentPreset } from "@/lib/content-presets";
import {
  marketingScriptFormatOptions,
  rawGenerationOutputSchema,
  type ContentType,
  type GenerationInput,
  type Platform,
  type RawCalendarPost,
  type RawCarousel,
  type RawGenerationOutput,
  type RawMarketingScript,
  type RawVideoScript,
} from "@/lib/types/content";
import { clampText } from "@/lib/utils";

const contentTypeSequence: ContentType[] = [
  "Single image",
  "Carousel",
  "Short-form video",
];

function compactPhrase(value: string, maxWords: number) {
  return value
    .split(/[\s,;/]+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .join(" ");
}

function splitPhrases(value: string) {
  return value
    .split(/[,|\n]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function summarizeAudience(value: string) {
  const trimmed = value.toLowerCase().split(/\bwho\b|\bthat\b/)[0]?.trim() ?? value.toLowerCase();
  return compactPhrase(trimmed, 9);
}

function summarizeGoals(value: string) {
  return compactPhrase(value.toLowerCase(), 5);
}

function summarizeThemes(value: string) {
  const phrases = splitPhrases(value.toLowerCase()).slice(0, 2);
  return phrases.join(", ") || compactPhrase(value.toLowerCase(), 5);
}

function summarizeOffer(value: string) {
  return compactPhrase(value.toLowerCase(), 8);
}

function uniqueHashtags(input: GenerationInput, day: number) {
  const preset = getContentPreset(input.preset);
  const brandToken = input.businessName.split(" ")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "Brand";
  const nicheToken = input.niche.split(" ")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "Niche";
  const offerToken = input.offer.split(" ")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "Offer";

  return [
    `#${brandToken}Content`,
    `#${nicheToken}Marketing`,
    `#${offerToken}Growth`,
    `#${preset.hashtagSeeds[0]}`,
    `#${preset.hashtagSeeds[1]}`,
    `#${preset.hashtagSeeds[2]}`,
    `#Day${String(day).padStart(2, "0")}Plan`,
  ];
}

function rotatePlatforms(platforms: Platform[], index: number) {
  return platforms
    .slice(index)
    .concat(platforms.slice(0, index))
    .slice(0, Math.min(2, platforms.length));
}

function buildTheme(input: GenerationInput, dayIndex: number) {
  const preset = getContentPreset(input.preset);
  const themeFocus = splitPhrases(input.keyThemes);
  const focus = themeFocus[dayIndex % Math.max(themeFocus.length, 1)] ?? input.offer;

  return `${preset.themePool[dayIndex % preset.themePool.length]} · ${focus}`;
}

function buildAngle(input: GenerationInput, dayIndex: number) {
  const preset = getContentPreset(input.preset);
  const campaignGoal = summarizeGoals(input.goals);
  const focus = summarizeThemes(input.keyThemes);

  return clampText(
    `${preset.anglePool[dayIndex % preset.anglePool.length]} Keep it anchored in ${focus} and move the audience toward ${campaignGoal}.`,
    220,
  );
}

function buildCaption(
  input: GenerationInput,
  day: number,
  theme: string,
  angle: string,
  contentType: ContentType,
) {
  const audienceHandle = summarizeAudience(input.targetAudience);
  const goalHandle = summarizeGoals(input.goals);
  const focusHandle = summarizeThemes(input.keyThemes);

  const hook =
    contentType === "Short-form video"
      ? "Here is the social angle that can turn attention into intent."
      : contentType === "Carousel"
        ? "Save this if you want a clearer content-to-conversion play."
        : "This is the kind of post that makes the offer easier to understand fast.";

  return clampText(
    `${hook} Day ${day} focuses on ${theme.toLowerCase()}. Show how ${summarizeOffer(input.offer)} helps ${audienceHandle}. Keep the message anchored in ${focusHandle}, make the next step obvious, and use the post to support ${goalHandle}. ${input.primaryCta}.`,
    1200,
  );
}

function buildImagePrompt(input: GenerationInput, theme: string, contentType: ContentType) {
  const preset = getContentPreset(input.preset);
  const audienceHandle = summarizeAudience(input.targetAudience);
  const artDirection =
    contentType === "Carousel"
      ? "social carousel layout, premium editorial grid, layered typography, polished storytelling sequence"
      : contentType === "Short-form video"
        ? "vertical video storyboard frame, motion-ready composition, social-first pacing, branded visual hook"
        : "hero social visual, clean composition, premium branded still, campaign-ready framing";

  return clampText(
    `${theme} for ${input.businessName}, a ${input.niche.toLowerCase()} brand. Show ${summarizeOffer(input.offer)} with ${preset.imageStyle}; ${artDirection}; tone is ${input.tone.toLowerCase()}; cues for ${audienceHandle}.`,
    320,
  );
}

function buildCalendar(input: GenerationInput): RawCalendarPost[] {
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const contentType = contentTypeSequence[index % contentTypeSequence.length];
    const theme = buildTheme(input, index);
    const angle = buildAngle(input, index);

    return {
      day,
      contentType,
      theme,
      angle,
      caption: buildCaption(input, day, theme, angle, contentType),
      hashtags: uniqueHashtags(input, day),
      cta: input.primaryCta,
      platformFocus: rotatePlatforms(input.platforms, index % input.platforms.length),
      imagePrompt: buildImagePrompt(input, theme, contentType),
    };
  });
}

function buildCarousels(calendar: RawCalendarPost[], input: GenerationInput): RawCarousel[] {
  return calendar
    .filter((entry) => entry.contentType === "Carousel")
    .map((entry, index) => ({
      day: entry.day,
      title: `${entry.theme} Playbook`,
      theme: entry.theme,
      cta: input.primaryCta,
      slides: [
        {
          slide: 1,
          title: "Why this matters now",
          body: `${input.businessName} is using this angle to support ${summarizeGoals(input.goals)}.`,
        },
        {
          slide: 2,
          title: "What the audience needs",
          body: `${summarizeAudience(input.targetAudience)} want a faster path from awareness to confidence.`,
        },
        {
          slide: 3,
          title: "What the offer solves",
          body: `${input.offer} becomes easier to understand when the value is shown through specific use cases.`,
        },
        {
          slide: 4,
          title: "Where the content should go",
          body: `Use ${summarizeThemes(input.keyThemes)} to keep the message focused and repeatable.`,
        },
        {
          slide: 5,
          title: "How to turn interest into action",
          body: `Make the CTA direct, useful, and consistent with the next commercial step.`,
        },
        {
          slide: 6,
          title: "Next step",
          body: input.primaryCta,
        },
      ].slice(0, index % 2 === 0 ? 6 : 5),
    }));
}

function buildVideoScripts(calendar: RawCalendarPost[], input: GenerationInput): RawVideoScript[] {
  return calendar
    .filter((entry) => entry.contentType === "Short-form video")
    .map((entry) => ({
      day: entry.day,
      title: `${entry.theme} Video`,
      theme: entry.theme,
      hook: `If you want social content that actually moves people toward ${input.offer.toLowerCase()}, start here.`,
      body: [
        `Open with the pressure point the audience already feels around ${compactPhrase(input.niche.toLowerCase(), 7)}.`,
        `Show how ${input.businessName} approaches it differently through ${summarizeThemes(input.keyThemes)}.`,
        `End with one concrete next move that supports ${summarizeGoals(input.goals)}.`,
      ],
      cta: input.primaryCta,
    }));
}

function buildMarketingScripts(calendar: RawCalendarPost[], input: GenerationInput): RawMarketingScript[] {
  return calendar
    .filter((_, index) => index % 3 === 0)
    .slice(0, 10)
    .map((entry, index) => {
      const format = marketingScriptFormatOptions[index % marketingScriptFormatOptions.length];

      return {
        day: entry.day,
        title: `${entry.theme} ${format}`,
        theme: entry.theme,
        format,
        hook: `This is the message that connects ${input.offer.toLowerCase()} to a real audience need in one pass.`,
        body: [
          `Lead with the friction or missed opportunity around ${compactPhrase(input.niche.toLowerCase(), 7)}.`,
          `Translate the offer into a concrete outcome for ${summarizeAudience(input.targetAudience)}.`,
          `Use proof, specificity, or workflow detail so the message feels commercially real.`,
          `Point the audience toward the website, signup, consultation, or next action tied to the goal.`,
        ].slice(0, format === "Customer story" ? 4 : 3),
        cta: input.primaryCta,
      };
    });
}

export async function generateDemoContentPlan(
  input: GenerationInput,
): Promise<RawGenerationOutput> {
  const preset = getContentPreset(input.preset);
  const monthlyCalendar = buildCalendar(input);
  const nicheHandle = compactPhrase(input.niche.toLowerCase(), 6);

  return rawGenerationOutputSchema.parse({
    strategySummary: {
      campaignTitle: `${input.businessName} Monthly Social Engine`,
      positioning: clampText(
        `${input.businessName} is positioned as the ${nicheHandle} brand for ${summarizeAudience(input.targetAudience)}, using ${summarizeOffer(input.offer)} and focused social content to support ${summarizeGoals(input.goals)}.`,
        240,
      ),
      narrative: clampText(
        `This month balances authority, education, offer clarity, and conversion-focused storytelling so every post reinforces ${input.tone.toLowerCase()} while building momentum around ${summarizeThemes(input.keyThemes)}. The preset bias stays tuned to ${preset.label.toLowerCase()} content patterns without locking the output into a single industry voice.`,
        340,
      ),
    },
    monthlyCalendar,
    carousels: buildCarousels(monthlyCalendar, input),
    videoScripts: buildVideoScripts(monthlyCalendar, input),
    marketingScripts: buildMarketingScripts(monthlyCalendar, input),
  });
}
