export const googleDocsShareModes = [
  "anyone_with_link",
  "share_with_email",
  "private",
] as const;

export type GoogleDocsShareMode = (typeof googleDocsShareModes)[number];

export type GoogleDocsIntegrationStatus = {
  canConnect: boolean;
  connected: boolean;
  connectedEmail: string | null;
  configured: boolean;
  shareMode: GoogleDocsShareMode;
  shareEmailConfigured: boolean;
  canOpenCreatedDocs: boolean;
  reason: string | null;
  message: string;
};

export type GoogleDocsExportResult = {
  documentId: string;
  documentUrl: string;
  title: string;
  shareMode: GoogleDocsShareMode;
};

export type GoogleAuthNotice = {
  tone: "success" | "error";
  message: string;
};
