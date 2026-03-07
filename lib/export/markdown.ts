import { productByline, productName } from "@/lib/brand";
import { getContentPreset } from "@/lib/content-presets";
import type { GeneratedContentPlan } from "@/lib/types/content";
import { formatDate } from "@/lib/utils";

export function buildMarkdownReport(plan: GeneratedContentPlan) {
  const preset = getContentPreset(plan.input.preset);
  const lines = [
    `# ${plan.summary.campaignTitle}`,
    "",
    `> ${productName}`,
    `> ${productByline}`,
    "",
    `Generated for **${plan.input.businessName}** on ${formatDate(plan.createdAt)} (${plan.modeUsed} mode).`,
    "",
    "## Strategy Summary",
    "",
    `- Preset: ${preset.label}`,
    `- Business: ${plan.input.businessName}`,
    `- Niche: ${plan.input.niche}`,
    `- Audience: ${plan.input.targetAudience}`,
    `- Offer: ${plan.input.offer}`,
    `- Goals: ${plan.input.goals}`,
    `- Tone: ${plan.input.tone}`,
    `- CTA: ${plan.input.primaryCta}`,
    `- Key themes: ${plan.input.keyThemes}`,
    ...(plan.input.extraContext ? [`- Extra context: ${plan.input.extraContext}`] : []),
    "",
    `**Positioning**: ${plan.summary.positioning}`,
    "",
    `**Narrative**: ${plan.summary.narrative}`,
    "",
    "## Monthly Content Calendar",
    "",
  ];

  for (const entry of plan.deliverables.monthlyContentCalendar) {
    lines.push(`### Day ${entry.day} · ${entry.contentType}`);
    lines.push(`- Publish date: ${formatDate(entry.publishDate)}`);
    lines.push(`- Theme: ${entry.theme}`);
    lines.push(`- Angle: ${entry.angle}`);
    lines.push(`- Platforms: ${entry.platformFocus.join(", ")}`);
    lines.push(`- CTA: ${entry.cta}`);
    lines.push(`- Caption: ${entry.caption}`);
    lines.push(`- Hashtags: ${entry.hashtags.join(" ")}`);
    lines.push(`- Image prompt: ${entry.imagePrompt}`);
    lines.push("");
  }

  lines.push("## Captions");
  lines.push("");

  for (const entry of plan.deliverables.captions) {
    lines.push(`### Day ${entry.day} · ${entry.theme}`);
    lines.push(entry.caption);
    lines.push("");
  }

  lines.push("## Carousel Outlines");
  lines.push("");

  for (const carousel of plan.deliverables.carouselText) {
    lines.push(`### Day ${carousel.day} · ${carousel.title}`);
    for (const slide of carousel.slides) {
      lines.push(`- Slide ${slide.slide}: ${slide.title} — ${slide.body}`);
    }
    lines.push(`- CTA: ${carousel.cta}`);
    lines.push("");
  }

  lines.push("## Video Scripts");
  lines.push("");

  for (const script of plan.deliverables.videoScripts) {
    lines.push(`### Day ${script.day} · ${script.title}`);
    lines.push(`- Hook: ${script.hook}`);
    for (const beat of script.body) {
      lines.push(`- Body beat: ${beat}`);
    }
    lines.push(`- CTA: ${script.cta}`);
    lines.push("");
  }

  lines.push("## Marketing Scripts");
  lines.push("");

  for (const script of plan.deliverables.marketingScripts) {
    lines.push(`### Day ${script.day} · ${script.title}`);
    lines.push(`- Format: ${script.format}`);
    lines.push(`- Hook: ${script.hook}`);
    for (const beat of script.body) {
      lines.push(`- Script beat: ${beat}`);
    }
    lines.push(`- CTA: ${script.cta}`);
    lines.push("");
  }

  lines.push("## Hashtag Recommendations");
  lines.push("");

  for (const entry of plan.deliverables.hashtags) {
    lines.push(`### Day ${entry.day} · ${entry.theme}`);
    lines.push(entry.hashtags.join(" "));
    lines.push("");
  }

  lines.push("## Image Prompts");
  lines.push("");

  for (const entry of plan.deliverables.imagePrompts) {
    lines.push(`### Day ${entry.day} · ${entry.theme}`);
    lines.push(entry.prompt);
    lines.push("");
  }

  return lines.join("\n");
}
