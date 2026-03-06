import type { GeneratedContentPlan } from "@/lib/types/content";
import { formatDate } from "@/lib/utils";

export function buildMarkdownReport(plan: GeneratedContentPlan) {
  const lines = [
    `# ${plan.summary.campaignTitle}`,
    "",
    `Generated for **${plan.input.agentName}** on ${formatDate(plan.createdAt)} (${plan.modeUsed} mode).`,
    "",
    "## Strategy Summary",
    "",
    `- Market: ${plan.input.city}`,
    `- Niche: ${plan.input.niche}`,
    `- Audience: ${plan.input.targetAudience}`,
    `- Tone: ${plan.input.tone}`,
    `- CTA: ${plan.input.primaryCta}`,
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

  lines.push("## Carousel Text");
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

  return lines.join("\n");
}
