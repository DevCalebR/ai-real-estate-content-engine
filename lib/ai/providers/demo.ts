import {
  rawGenerationOutputSchema,
  type ContentType,
  type GenerationInput,
  type Platform,
  type RawCalendarPost,
  type RawCarousel,
  type RawGenerationOutput,
  type RawVideoScript,
} from "@/lib/types/content";
import { clampText } from "@/lib/utils";

const contentTypeSequence: ContentType[] = [
  "Single image",
  "Carousel",
  "Short-form video",
];

const angleTemplates = [
  "Translate the local market into a calm, trusted takeaway for buyers.",
  "Show behind-the-scenes expertise that reinforces advisory authority.",
  "Use neighborhood lifestyle cues to make the market feel tangible.",
  "Turn a common client question into practical guidance with momentum.",
  "Anchor the content in current decision-making, not generic inspiration.",
] as const;

const themeTemplates = [
  "Market shift insight",
  "Client win",
  "Neighborhood spotlight",
  "Listing story",
  "Buyer myth reset",
  "Seller strategy",
  "Relocation guide",
  "Lifestyle cue",
  "Pricing perspective",
  "Home prep tip",
] as const;

function compactPhrase(value: string, maxWords: number) {
  return value
    .split(/[\s,;/]+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .join(" ");
}

function summarizeAudience(value: string) {
  const trimmed = value.toLowerCase().split(/\bwho\b|\bthat\b/)[0]?.trim() ?? value.toLowerCase();
  return compactPhrase(trimmed, 8);
}

function summarizeHighlights(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");
}

function rotatePlatforms(platforms: Platform[], index: number) {
  return platforms
    .slice(index)
    .concat(platforms.slice(0, index))
    .slice(0, Math.min(2, platforms.length));
}

function uniqueHashtags(input: GenerationInput, day: number) {
  const cityToken = input.city.split(",")[0].replace(/[^a-zA-Z0-9]/g, "");
  const nicheToken = input.niche.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "");

  return [
    `#${cityToken}RealEstate`,
    `#${nicheToken || "Local"}Homes`,
    "#AgentMarketing",
    "#HomeSearchTips",
    "#MoveWithConfidence",
    `#${input.agentName.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "")}Advises`,
    `#Day${String(day).padStart(2, "0")}Content`,
  ];
}

function buildCaption(
  input: GenerationInput,
  day: number,
  theme: string,
  angle: string,
  contentType: ContentType,
) {
  const audienceHandle = summarizeAudience(input.targetAudience);
  const listingHandle = input.listingHighlights
    ? summarizeHighlights(input.listingHighlights)
    : "";

  const hook =
    contentType === "Short-form video"
      ? "Stop scrolling if you want the clearer read on this market."
      : contentType === "Carousel"
        ? "Save this for the point when the search needs sharper strategy."
        : "If you want the local signal, start here.";

  const listingLine = listingHandle
    ? ` Buyer attention is leaning toward homes with ${listingHandle}.`
    : "";

  return `${hook} Day ${day} focuses on ${theme.toLowerCase()} in ${input.city}. ${angle} I’m framing this for ${audienceHandle}, with clear next steps instead of generic market chatter.${listingLine} ${input.primaryCta}.`;
}

function buildImagePrompt(input: GenerationInput, theme: string, contentType: ContentType) {
  const audienceHandle = summarizeAudience(input.targetAudience);
  const nicheHandle = compactPhrase(input.niche.toLowerCase(), 6);
  const artDirection =
    contentType === "Carousel"
      ? "editorial social carousel, refined grid layout, muted luxury palette"
      : contentType === "Short-form video"
        ? "vertical video storyboard frame, cinematic natural light, polished real estate branding"
        : "high-end property marketing still, natural textures, tasteful composition";

  return clampText(
    `${theme} for a ${nicheHandle} real estate brand in ${input.city}; ${artDirection}; tone is ${input.tone.toLowerCase()}; subtle cues for ${audienceHandle}.`,
    280,
  );
}

function buildCalendar(input: GenerationInput): RawCalendarPost[] {
  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const contentType = contentTypeSequence[index % contentTypeSequence.length];
    const theme = `${themeTemplates[index % themeTemplates.length]}: ${input.city}`;
    const nicheHandle = compactPhrase(input.niche.toLowerCase(), 5);
    const angle = clampText(
      `${angleTemplates[index % angleTemplates.length]} Keep the advice grounded in ${nicheHandle} decisions for this market.`,
      180,
    );

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
          body: `${input.city} clients are reacting to timing, confidence, and clarity more than noise.`,
        },
        {
          slide: 2,
          title: "What buyers are asking",
          body: `The dominant question is how ${compactPhrase(input.niche.toLowerCase(), 6)} decisions align with timing, location, and budget.`,
        },
        {
          slide: 3,
          title: "My client lens",
          body: `I frame this for ${summarizeAudience(input.targetAudience)} so the next move feels practical, not overwhelming.`,
        },
        {
          slide: 4,
          title: "Where the opportunity sits",
          body: "The strongest advantage is usually hiding in preparation, positioning, and neighborhood fit.",
        },
        {
          slide: 5,
          title: "Action to take",
          body: "Use this angle to shortlist options, sharpen timing, and protect negotiation leverage.",
        },
        {
          slide: 6,
          title: "Next step",
          body: `${input.primaryCta} so we can turn the market read into a concrete plan.`,
        },
      ].slice(0, index % 2 === 0 ? 6 : 5),
    }));
}

function buildVideoScripts(calendar: RawCalendarPost[], input: GenerationInput): RawVideoScript[] {
  return calendar
    .filter((entry) => entry.contentType === "Short-form video")
    .map((entry) => ({
      day: entry.day,
      title: `${entry.theme} Reel`,
      theme: entry.theme,
      hook: `Here’s the local signal I do not want ${summarizeAudience(input.targetAudience)} to miss this week.`,
      body: [
        `Start with what has changed in ${input.city} and why it affects the pace of decision-making.`,
        `Show how ${compactPhrase(input.niche.toLowerCase(), 6)} clients can interpret that shift without overreacting.`,
        "Give one concrete next move that makes the next conversation or showing more productive.",
      ],
      cta: input.primaryCta,
    }));
}

export async function generateDemoContentPlan(
  input: GenerationInput,
): Promise<RawGenerationOutput> {
  const monthlyCalendar = buildCalendar(input);
  const nicheHandle = compactPhrase(input.niche.toLowerCase(), 5);
  const audienceHandle = summarizeAudience(input.targetAudience);

  return rawGenerationOutputSchema.parse({
    strategySummary: {
      campaignTitle: `${input.agentName} Monthly Growth Engine`,
      positioning: clampText(
        `${input.agentName} is positioned as the ${input.city} advisor who turns ${nicheHandle} questions into clear next steps for ${audienceHandle}.`,
        220,
      ),
      narrative: `The month balances trust-building education, local market fluency, and polished lifestyle storytelling so every post reinforces ${input.tone.toLowerCase()} while moving prospects toward "${input.primaryCta}".`,
    },
    monthlyCalendar,
    carousels: buildCarousels(monthlyCalendar, input),
    videoScripts: buildVideoScripts(monthlyCalendar, input),
  });
}
