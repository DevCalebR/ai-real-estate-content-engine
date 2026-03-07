import { google, type docs_v1 } from "googleapis";

import { productByline, productName } from "@/lib/brand";
import { getContentPreset } from "@/lib/content-presets";
import {
  createConnectedGoogleOAuthClient,
  getGoogleOAuthConfigError,
} from "@/lib/integrations/google-oauth";
import { getGoogleOAuthSession } from "@/lib/storage/google-oauth";
import type { GeneratedContentPlan } from "@/lib/types/content";
import {
  googleDocsShareModes,
  type GoogleDocsExportResult,
  type GoogleDocsIntegrationStatus,
  type GoogleDocsShareMode,
} from "@/lib/types/integrations";
import { formatDate, formatDateTime } from "@/lib/utils";

type StyledParagraph = {
  start: number;
  end: number;
  style: "TITLE" | "SUBTITLE" | "HEADING_1" | "HEADING_2";
};

function normalizeEnvValue(value?: string | null) {
  const raw = value?.trim() ?? "";

  if (!raw) {
    return "";
  }

  return (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  )
    ? raw.slice(1, -1)
    : raw;
}

function parseShareEmail() {
  return normalizeEnvValue(process.env.GOOGLE_DOCS_SHARE_EMAIL);
}

function parseShareMode(): GoogleDocsShareMode {
  const value = normalizeEnvValue(process.env.GOOGLE_DOCS_SHARE_MODE) || "anyone_with_link";

  return googleDocsShareModes.includes(value as GoogleDocsShareMode)
    ? (value as GoogleDocsShareMode)
    : "anyone_with_link";
}

async function createGoogleAuth() {
  const status = await getGoogleDocsIntegrationStatus();

  if (!status.configured) {
    throw new Error(status.reason ?? "Google Docs export is not configured.");
  }

  const { oauthClient } = await createConnectedGoogleOAuthClient();
  return oauthClient;
}

export async function getGoogleDocsIntegrationStatus(): Promise<GoogleDocsIntegrationStatus> {
  const shareMode = parseShareMode();
  const shareEmail = parseShareEmail();
  const oauthConfigError = getGoogleOAuthConfigError();
  const session = oauthConfigError ? null : await getGoogleOAuthSession();
  const connected = Boolean(session?.tokens.refresh_token);

  if (oauthConfigError) {
    return {
      canConnect: false,
      connected: false,
      connectedEmail: null,
      configured: false,
      shareMode,
      shareEmailConfigured: Boolean(shareEmail),
      canOpenCreatedDocs: false,
      reason: oauthConfigError,
      message:
        "Google OAuth is not configured in this environment. Markdown, HTML, and JSON exports still work normally.",
    };
  }

  if (!connected) {
    return {
      canConnect: true,
      connected: false,
      connectedEmail: session?.connectedEmail ?? null,
      configured: false,
      shareMode,
      shareEmailConfigured: Boolean(shareEmail),
      canOpenCreatedDocs: false,
      reason: "Connect Google to create documents in your Drive.",
      message:
        "Google OAuth is configured. Connect your Google account once, then export this run directly into your Drive.",
    };
  }

  if (shareMode === "share_with_email" && !shareEmail) {
    return {
      canConnect: true,
      connected: true,
      connectedEmail: session?.connectedEmail ?? null,
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
      canConnect: true,
      connected: true,
      connectedEmail: session?.connectedEmail ?? null,
      configured: true,
      shareMode,
      shareEmailConfigured: Boolean(shareEmail),
      canOpenCreatedDocs: false,
      reason: null,
      message:
        `Connected${session?.connectedEmail ? ` as ${session.connectedEmail}` : ""}. New documents will stay private in your Drive unless you change the share mode.`,
    };
  }

  return {
    canConnect: true,
    connected: true,
    connectedEmail: session?.connectedEmail ?? null,
    configured: true,
    shareMode,
    shareEmailConfigured: Boolean(shareEmail),
    canOpenCreatedDocs: true,
    reason: null,
    message:
      shareMode === "share_with_email"
        ? `Connected${session?.connectedEmail ? ` as ${session.connectedEmail}` : ""}. New documents will be shared to the configured email.`
        : `Connected${session?.connectedEmail ? ` as ${session.connectedEmail}` : ""}. New documents will be available via an anyone-with-link URL.`,
  };
}

function createDocumentTitle(plan: GeneratedContentPlan) {
  return `${productName} - ${plan.input.businessName} - ${plan.createdAt.slice(0, 10)}`;
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
  const preset = getContentPreset(plan.input.preset);

  appendParagraph(buffer, styles, title, "TITLE");
  appendParagraph(buffer, styles, `${productName} • ${productByline}`, "SUBTITLE");
  appendParagraph(
    buffer,
    styles,
    `Generated ${formatDateTime(plan.createdAt)} • ${plan.modeUsed.toUpperCase()} mode`,
    "SUBTITLE",
  );
  appendBlankLine(buffer);

  appendParagraph(buffer, styles, "Project Summary / Brief", "HEADING_1");
  appendParagraph(buffer, styles, `Business / brand: ${plan.input.businessName}`);
  appendParagraph(buffer, styles, `Preset: ${preset.label}`);
  appendParagraph(buffer, styles, `Niche: ${plan.input.niche}`);
  appendParagraph(buffer, styles, `Target audience: ${plan.input.targetAudience}`);
  appendParagraph(buffer, styles, `Offer: ${plan.input.offer}`);
  appendParagraph(buffer, styles, `Goals: ${plan.input.goals}`);
  appendParagraph(buffer, styles, `Tone / voice: ${plan.input.tone}`);
  appendParagraph(buffer, styles, `Primary CTA: ${plan.input.primaryCta}`);
  appendParagraph(buffer, styles, `Key themes: ${plan.input.keyThemes}`);
  if (plan.input.extraContext) {
    appendParagraph(buffer, styles, `Extra context: ${plan.input.extraContext}`);
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

  appendParagraph(buffer, styles, "Marketing Scripts", "HEADING_1");
  for (const script of plan.deliverables.marketingScripts) {
    appendParagraph(
      buffer,
      styles,
      `Day ${String(script.day).padStart(2, "0")} • ${script.title}`,
      "HEADING_2",
    );
    appendParagraph(buffer, styles, `Format: ${script.format}`);
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

function normalizeGoogleDocsExportError(error: unknown) {
  if (error instanceof Error && /The caller does not have permission/i.test(error.message)) {
    return new Error(
      "Google authenticated successfully, but the current account does not have permission to create the document or apply the selected sharing settings.",
    );
  }

  if (error instanceof Error && /invalid_grant/i.test(error.message)) {
    return new Error(
      "Your Google connection is no longer valid. Connect Google again, then retry the export.",
    );
  }

  return error instanceof Error ? error : new Error("Google Docs export failed.");
}

async function applySharing(documentId: string, status: GoogleDocsIntegrationStatus) {
  if (status.shareMode === "private") {
    return;
  }

  const auth = await createGoogleAuth();
  const drive = google.drive({ version: "v3", auth });

  if (status.shareMode === "share_with_email") {
    await drive.permissions.create({
      fileId: documentId,
      sendNotificationEmail: false,
      requestBody: {
        type: "user",
        role: "writer",
        emailAddress: parseShareEmail(),
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
  const status = await getGoogleDocsIntegrationStatus();

  if (!status.configured) {
    throw new Error(status.reason ?? "Google Docs export is not configured.");
  }

  const auth = await createGoogleAuth();
  const docs = google.docs({ version: "v1", auth });
  const body = buildGoogleDocBody(plan);

  try {
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
  } catch (error) {
    throw normalizeGoogleDocsExportError(error);
  }
}
