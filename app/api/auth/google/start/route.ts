import { NextResponse } from "next/server";

import {
  buildGoogleOAuthAuthorizationUrl,
  createGoogleOAuthState,
  getGoogleOAuthConfigError,
} from "@/lib/integrations/google-oauth";

const googleOauthStateCookie = "google_oauth_state";
const googleOauthReturnToCookie = "google_oauth_return_to";

function sanitizeReturnTo(value: string | null) {
  return value?.startsWith("/") ? value : "/history";
}

function buildReturnUrl(requestUrl: string, returnTo: string, notice: "connected" | "error", message?: string) {
  const url = new URL(returnTo, requestUrl);
  url.searchParams.set("google_oauth", notice);

  if (message) {
    url.searchParams.set("google_oauth_message", message);
  }

  return url;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = sanitizeReturnTo(url.searchParams.get("returnTo"));
  const configError = getGoogleOAuthConfigError();

  if (configError) {
    return NextResponse.redirect(buildReturnUrl(request.url, returnTo, "error", configError));
  }

  const state = createGoogleOAuthState();
  const authorizationUrl = buildGoogleOAuthAuthorizationUrl(state);
  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set({
    name: googleOauthStateCookie,
    value: state,
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set({
    name: googleOauthReturnToCookie,
    value: returnTo,
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
