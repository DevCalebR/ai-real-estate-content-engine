import { promises as fs } from "node:fs";
import path from "node:path";

import { z } from "zod";

const integrationsDirectory = path.join(process.cwd(), "data", "integrations");
const googleOAuthFilePath = path.join(integrationsDirectory, "google-oauth.json");

const googleOAuthSessionSchema = z.object({
  connectedEmail: z.string().email().nullable(),
  updatedAt: z.string(),
  tokens: z.object({
    access_token: z.string().optional(),
    refresh_token: z.string().optional(),
    scope: z.string().optional(),
    token_type: z.string().optional(),
    expiry_date: z.number().optional(),
    id_token: z.string().optional(),
  }),
});

export type GoogleOAuthSession = z.infer<typeof googleOAuthSessionSchema>;

async function ensureIntegrationsDirectory() {
  await fs.mkdir(integrationsDirectory, { recursive: true });
}

export async function getGoogleOAuthSession() {
  try {
    const contents = await fs.readFile(googleOAuthFilePath, "utf8");
    return googleOAuthSessionSchema.parse(JSON.parse(contents));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function saveGoogleOAuthSession(session: GoogleOAuthSession) {
  await ensureIntegrationsDirectory();
  await fs.writeFile(googleOAuthFilePath, JSON.stringify(session, null, 2), "utf8");
}

export async function clearGoogleOAuthSession() {
  try {
    await fs.unlink(googleOAuthFilePath);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
}
