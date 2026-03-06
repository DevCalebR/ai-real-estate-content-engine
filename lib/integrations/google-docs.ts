import { google, type docs_v1 } from "googleapis";

import type { GeneratedContentPlan } from "@/lib/types/content";
import {
  googleDocsShareModes,
  type GoogleDocsExportResult,
  type GoogleDocsIntegrationStatus,
  type GoogleDocsShareMode,
} from "@/lib/types/integrations";
import { formatDate, formatDateTime } from "@/lib/utils";

const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

type StyledParagraph = {
  start: number;
  end: number;
  style: "TITLE" | "SUBTITLE" | "HEADING_1" | "HEADING_2";
};

function parsePrivateKey() {
  return process.env.GOOGLE_DOCS_PRIVATE_KEY?.replace(/\\n/g, "\n").trim() ?? "";
}

function parseShareMode(): GoogleDocsShareMode {
  const value = process.env.GOOGLE_DOCS_SHARE_MODE?.trim() ?? "anyone_with_link";

  return googleDocsShareModes.includes(value as GoogleDocsShareMode)
    ? (value as GoogleDocsShareMode)
    : "anyone_with_link";
}

function createGoogleAuth() {
  const status = getGoogleDocsIntegrationStatus();

  if (!status.configured) {
    throw new Error(status.reason ?? "Google Docs export is not configured.");
  }

  return new google.auth.JWT({
    email: process.env.GOOGLE_DOCS_CLIENT_EMAIL?.trim(),
    key: parsePrivateKey(),
    scopes: [DRIVE_SCOPE],
  });
}

export function getGoogleDocsIntegrationStatus(): GoogleDocsIntegrationStatus {
  const clientEmail = process.env.GOOGLE_DOCS_CLIENT_EMAIL?.trim() ?? "";
  const privateKey = parsePrivateKey();
  const shareMode = parseShareMode();
  const shareEmail = process.env.GOOGLE_DOCS_SHARE_EMAIL?.trim() ?? "";

  if (!clientEmail || !privateKey) {
    return {
      configured: false,
      shareMode,
      shareEmailConfigured: Boolean(shareEmail),
      canOpenCreatedDocs: false,
      reason:
        "Google Docs export is not configured. Add GOOGLE_DOCS_CLIENT_EMAIL and GOOGLE_DOCS_PRIVATE_KEY to enable it.",
      message:
        "Google Docs export is not configured in this environment. Markdown, HTML, and JSON exports still work normally.",
    };
  }

  if (shareMode === "share_with_email" && !shareEmail) {
    return {
      configured: false,
      shareMode,
      shareEmailConfigured: false,
      canOpenCreatedDocs: false,
      reason:
        "GOOGLE_DOCS_SHARE_EMAIL is required when GOOGLE_DOCS_SHARE_MODE=share_with_email.",
      message:
        "Google Docs export needs a share email before it can create an accessible document. Markdown, HTML, and JSON exports are still available.",
    };
  }

  if (shareMode === "private") {
    return {
      configured: true,
      shareMode,
      shareEmailConfigured: Boolean(shareEmail),
      canOpenCreatedDocs: false,
      reason: null,
      message:
        "Google Docs export is configured, but documents will stay in the service account Drive unless you change the share mode.",
    };
  }

  return {
    configured: true,
    shareMode,
    shareEmailConfigured: Boolean(shareEmail),
    canOpenCreatedDocs: true,
    reason: null,
    message:
      shareMode === "share_with_email"
        ? "Google Docs export is configured and new documents will be shared to the configured email."
        : "Google Docs export is configured and new documents will be available via an anyone-with-link URL.",
  };
}

function createDocumentTitle(plan: GeneratedContentPlan) {
  return `Content Plan - ${plan.input.agentName} - ${plan.createdAt.slice(0, 10)}`;
}

function appendParagraph(
  buffer: string[],
  styles: StyledParagraph[],
  text: string,
  style?: StyledParagraph["style"],
) {
  const currentLength = buffer.join("").length;
  const paragraph = `${text}\n`;
  buffer.push(paragraph);

  if (style) {
    styles.push({
      start: currentLength,
      end: currentLength + paragraph.length,
      style,
    });
  }
}

function appendBlankLine(buffer: string[], count = 1) {
  buffer.push("\n".repeat(count));
}

function buildGoogleDocBody(plan: GeneratedContentPlan) {
  const buffer: string[] = [];
  const styles: StyledParagraph[] = [];
  const title = createDocumentTitle(plan);

  appendParagraph(buffer, styles, title, "TITLE");
  appendParagraph(
    buffer,
    styles,
    `Generated ${formatDateTime(plan.createdAt)} • ${plan.modeUsed.toUpperCase()} mode`,
    "SUBTITLE",
  );
  appendBlankLine(buffer);

  appendParagraph(buffer, styles, "Project Summary / Brief", "HEADING_1");
  appendParagraph(buffer, styles, `Agent / business: ${plan.input.agentName}`);
  appendParagraph(buffer, styles, `Market: ${plan.input.city}`);
  appendParagraph(buffer, styles, `Niche: ${plan.input.niche}`);
  appendParagraph(buffer, styles, `Target audience: ${plan.input.targetAudience}`);
  appendParagraph(buffer, styles, `Tone / voice: ${plan.input.tone}`);
  appendParagraph(buffer, styles, `Primary CTA: ${plan.input.primaryCta}`);
  if (plan.input.listingHighlights) {
    appendParagraph(buffer, styles, `Listing highlights: ${plan.input.listingHighlights}`);
  }
  appendBlankLine(buffer);
  appendParagraph(buffer, styles, `Campaign title: ${plan.summary.campaignTitle}`);
  appendParagraph(buffer, styles, `Positioning: ${plan.summary.positioning}`);
  appendParagraph(buffer, styles, `Narrative: ${plan.summary.narrative}`);
  appendBlankLine(buffer, 2);

  appendParagraph(buffer, styles, "Monthly Content Calendar", "HEADING_1");
  for (const entry of plan.deliverables.monthlyContentCalendar) {
    appendParagraph(
      buffer,
      styles,
      `Day ${String(entry.day).padStart(2, "0")} • ${entry.contentType} • ${entry.theme}`,
      "HEADING_2",
    );
    appendParagraph(buffer, styles, `Publish date: ${formatDate(entry.publishDate)}`);
    appendParagraph(buffer, styles, `Platforms: ${entry.platformFocus.join(", ")}`);
    appendParagraph(buffer, styles, `CTA: ${entry.cta}`);
    appendParagraph(buffer, styles, `Angle: ${entry.angle}`);
    appendParagraph(buffer, styles, "Caption:");
    appendParagraph(buffer, styles, entry.caption);
    appendParagraph(buffer, styles, `Hashtags: ${entry.hashtags.join(" ")}`);
    appendParagraph(buffer, styles, `Image prompt: ${entry.imagePrompt}`);
    appendBlankLine(buffer);
  }
  appendBlankLine(buffer);

  appendParagraph(buffer, styles, "Captions Grouped By Day / Post", "HEADING_1");
  for (const entry of plan.deliverables.captions) {
    appendParagraph(
      buffer,
      styles,
      `Day ${String(entry.day).padStart(2, "0")} • ${entry.contentType} • ${entry.theme}`,
      "HEADING_2",
    );
    appendParagraph(buffer, styles, entry.caption);
    appendBlankLine(buffer);
  }
  appendBlankLine(buffer);

  appendParagraph(buffer, styles, "Carousel Outlines", "HEADING_1");
  for (const carousel of plan.deliverables.carouselText) {
    appendParagraph(
      buffer,
      styles,
      `Day ${String(carousel.day).padStart(2, "0")} • ${carousel.title}`,
      "HEADING_2",
    );
    for (const slide of carousel.slides) {
      appendParagraph(
        buffer,
        styles,
        `Slide ${slide.slide}: ${slide.title} — ${slide.body}`,
      );
    }
    appendParagraph(buffer, styles, `CTA: ${carousel.cta}`);
    appendBlankLine(buffer);
  }
  appendBlankLine(buffer);

  appendParagraph(buffer, styles, "Video Scripts", "HEADING_1");
  for (const script of plan.deliverables.videoScripts) {
    appendParagraph(
      buffer,
      styles,
      `Day ${String(script.day).padStart(2, "0")} • ${script.title}`,
      "HEADING_2",
    );
    appendParagraph(buffer, styles, `Hook: ${script.hook}`);
    appendParagraph(buffer, styles, "Body:");
    for (const beat of script.body) {
      appendParagraph(buffer, styles, `• ${beat}`);
    }
    appendParagraph(buffer, styles, `CTA: ${script.cta}`);
    appendBlankLine(buffer);
  }
  appendBlankLine(buffer);

  appendParagraph(buffer, styles, "Hashtag Recommendations", "HEADING_1");
  for (const entry of plan.deliverables.hashtags) {
    appendParagraph(
      buffer,
      styles,
      `Day ${String(entry.day).padStart(2, "0")} • ${entry.theme}`,
      "HEADING_2",
    );
    appendParagraph(buffer, styles, entry.hashtags.join(" "));
    appendBlankLine(buffer);
  }
  appendBlankLine(buffer);

  appendParagraph(buffer, styles, "Image Prompts", "HEADING_1");
  for (const entry of plan.deliverables.imagePrompts) {
    appendParagraph(
      buffer,
      styles,
      `Day ${String(entry.day).padStart(2, "0")} • ${entry.theme}`,
      "HEADING_2",
    );
    appendParagraph(buffer, styles, entry.prompt);
    appendBlankLine(buffer);
  }

  return {
    title,
    text: buffer.join(""),
    styles,
  };
}

function buildStyleRequests(styles: StyledParagraph[]): docs_v1.Schema$Request[] {
  return styles.map((style) => ({
    updateParagraphStyle: {
      range: {
        startIndex: style.start + 1,
        endIndex: style.end + 1,
      },
      paragraphStyle: {
        namedStyleType: style.style,
      },
      fields: "namedStyleType",
    },
  }));
}

async function applySharing(documentId: string, status: GoogleDocsIntegrationStatus) {
  if (status.shareMode === "private") {
    return;
  }

  const auth = createGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  if (status.shareMode === "share_with_email") {
    await drive.permissions.create({
      fileId: documentId,
      sendNotificationEmail: false,
      requestBody: {
        type: "user",
        role: "writer",
        emailAddress: process.env.GOOGLE_DOCS_SHARE_EMAIL?.trim(),
      },
    });
    return;
  }

  await drive.permissions.create({
    fileId: documentId,
    requestBody: {
      type: "anyone",
      role: "reader",
    },
  });
}

export async function exportContentPlanToGoogleDocs(
  plan: GeneratedContentPlan,
): Promise<GoogleDocsExportResult> {
  const status = getGoogleDocsIntegrationStatus();

  if (!status.configured) {
    throw new Error(status.reason ?? "Google Docs export is not configured.");
  }

  const auth = createGoogleAuth();
  const docs = google.docs({ version: "v1", auth });
  const body = buildGoogleDocBody(plan);

  const createResponse = await docs.documents.create({
    requestBody: {
      title: body.title,
    },
  });

  const documentId = createResponse.data.documentId;

  if (!documentId) {
    throw new Error("Google Docs did not return a document ID.");
  }

  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: {
              index: 1,
            },
            text: body.text,
          },
        },
        ...buildStyleRequests(body.styles),
      ],
    },
  });

  await applySharing(documentId, status);

  return {
    documentId,
    documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
    title: body.title,
    shareMode: status.shareMode,
  };
}
