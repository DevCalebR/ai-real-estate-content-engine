export const googleDocsShareModes = [
  "anyone_with_link",
  "share_with_email",
  "private",
] as const;

export type GoogleDocsShareMode = (typeof googleDocsShareModes)[number];

export type GoogleDocsIntegrationStatus = {
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
