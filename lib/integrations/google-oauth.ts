import { randomBytes } from "node:crypto";

import { google } from "googleapis";

import {
  getGoogleOAuthSession,
  saveGoogleOAuthSession,
  type GoogleOAuthSession,
} from "@/lib/storage/google-oauth";

const googleOAuthScopes = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
] as const;

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

export function getGoogleOAuthConfig() {
  const clientId = normalizeEnvValue(process.env.GOOGLE_OAUTH_CLIENT_ID);
  const clientSecret = normalizeEnvValue(process.env.GOOGLE_OAUTH_CLIENT_SECRET);
  const redirectUri = normalizeEnvValue(process.env.GOOGLE_OAUTH_REDIRECT_URI);

  return {
    clientId,
    clientSecret,
    redirectUri,
  };
}

export function getGoogleOAuthConfigError() {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();

  if (!clientId || !clientSecret || !redirectUri) {
    return "Google OAuth is not fully configured. Add GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, and GOOGLE_OAUTH_REDIRECT_URI.";
  }

  try {
    const url = new URL(redirectUri);

    if (!url.pathname) {
      return "GOOGLE_OAUTH_REDIRECT_URI must include a valid callback path.";
    }
  } catch {
    return "GOOGLE_OAUTH_REDIRECT_URI must be a valid URL.";
  }

  return null;
}

function createBaseGoogleOAuthClient() {
  const configError = getGoogleOAuthConfigError();

  if (configError) {
    throw new Error(configError);
  }

  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function mergeTokenPayload(
  current: GoogleOAuthSession["tokens"] | undefined,
  next: Partial<GoogleOAuthSession["tokens"]>,
) {
  return {
    ...current,
    ...next,
    refresh_token: next.refresh_token ?? current?.refresh_token,
  };
}

function normalizeTokenValue(value?: string | null) {
  return value ?? undefined;
}

function normalizeExpiryDate(value?: number | null) {
  return value ?? undefined;
}

export function createGoogleOAuthState() {
  return randomBytes(24).toString("hex");
}

export function buildGoogleOAuthAuthorizationUrl(state: string) {
  const oauthClient = createBaseGoogleOAuthClient();

  return oauthClient.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: [...googleOAuthScopes],
    state,
  });
}

export async function exchangeGoogleOAuthCode(code: string) {
  const oauthClient = createBaseGoogleOAuthClient();
  const existingSession = await getGoogleOAuthSession();
  const { tokens } = await oauthClient.getToken(code);
  const mergedTokens = mergeTokenPayload(existingSession?.tokens, {
    access_token: normalizeTokenValue(tokens.access_token),
    expiry_date: normalizeExpiryDate(tokens.expiry_date),
    id_token: normalizeTokenValue(tokens.id_token),
    refresh_token: normalizeTokenValue(tokens.refresh_token),
    scope: normalizeTokenValue(tokens.scope),
    token_type: normalizeTokenValue(tokens.token_type),
  });

  if (!mergedTokens.refresh_token) {
    throw new Error(
      "Google OAuth did not return a refresh token. Remove the existing app access in Google Account permissions and connect again.",
    );
  }

  oauthClient.setCredentials(mergedTokens);

  const oauth2 = google.oauth2({
    version: "v2",
    auth: oauthClient,
  });
  const userInfo = await oauth2.userinfo.get();

  const session: GoogleOAuthSession = {
    connectedEmail: userInfo.data.email ?? null,
    updatedAt: new Date().toISOString(),
    tokens: mergedTokens,
  };

  await saveGoogleOAuthSession(session);
  return session;
}

export async function createConnectedGoogleOAuthClient() {
  const oauthClient = createBaseGoogleOAuthClient();
  const session = await getGoogleOAuthSession();

  if (!session?.tokens.refresh_token) {
    throw new Error("Google OAuth is configured, but no connected account is stored yet.");
  }

  oauthClient.setCredentials(session.tokens);
  oauthClient.on("tokens", (tokens) => {
    void saveGoogleOAuthSession({
      connectedEmail: session.connectedEmail,
      updatedAt: new Date().toISOString(),
      tokens: mergeTokenPayload(session.tokens, {
        access_token: normalizeTokenValue(tokens.access_token),
        expiry_date: normalizeExpiryDate(tokens.expiry_date),
        id_token: normalizeTokenValue(tokens.id_token),
        refresh_token: normalizeTokenValue(tokens.refresh_token),
        scope: normalizeTokenValue(tokens.scope),
        token_type: normalizeTokenValue(tokens.token_type),
      }),
    });
  });

  return {
    oauthClient,
    session,
  };
}
