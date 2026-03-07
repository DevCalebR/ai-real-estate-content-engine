import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { exchangeGoogleOAuthCode } from "@/lib/integrations/google-oauth";

const googleOauthStateCookie = "google_oauth_state";
const googleOauthReturnToCookie = "google_oauth_return_to";

function sanitizeReturnTo(value: string | null | undefined) {
  return value?.startsWith("/") ? value : "/history";
}

function buildReturnUrl(
  requestUrl: string,
  returnTo: string,
  notice: "connected" | "error",
  message?: string,
) {
  const url = new URL(returnTo, requestUrl);
  url.searchParams.set("google_oauth", notice);

  if (message) {
    url.searchParams.set("google_oauth_message", message);
  }

  return url;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(googleOauthStateCookie)?.value ?? null;
  const returnTo = sanitizeReturnTo(cookieStore.get(googleOauthReturnToCookie)?.value);
  const responseError = url.searchParams.get("error");
  const responseState = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  const clearCookies = (response: NextResponse) => {
    response.cookies.delete(googleOauthStateCookie);
    response.cookies.delete(googleOauthReturnToCookie);
    return response;
  };

  if (responseError) {
    return clearCookies(
      NextResponse.redirect(
        buildReturnUrl(request.url, returnTo, "error", "Google connection was cancelled or denied."),
      ),
    );
  }

  if (!expectedState || !responseState || expectedState !== responseState) {
    return clearCookies(
      NextResponse.redirect(
        buildReturnUrl(
          request.url,
          returnTo,
          "error",
          "Google OAuth state did not match. Start the connection again.",
        ),
      ),
    );
  }

  if (!code) {
    return clearCookies(
      NextResponse.redirect(
        buildReturnUrl(
          request.url,
          returnTo,
          "error",
          "Google did not return an authorization code.",
        ),
      ),
    );
  }

  try {
    await exchangeGoogleOAuthCode(code);

    return clearCookies(
      NextResponse.redirect(
        buildReturnUrl(
          request.url,
          returnTo,
          "connected",
          "Google account connected. You can now export this run to Google Docs.",
        ),
      ),
    );
  } catch (error) {
    return clearCookies(
      NextResponse.redirect(
        buildReturnUrl(
          request.url,
          returnTo,
          "error",
          error instanceof Error ? error.message : "Google OAuth could not be completed.",
        ),
      ),
    );
  }
}
