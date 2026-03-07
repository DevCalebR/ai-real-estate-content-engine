# Google Docs Setup

This project exports a generated content plan into a new Google Doc in the connected user's Drive.

## Auth Model

This build uses Google OAuth for a single-user local workflow.

- The app opens a Google consent flow
- Google redirects back to the local callback route
- OAuth tokens are stored locally in `data/integrations/google-oauth.json`
- The stored token file is ignored by git

## Exact Callback URI

The app expects this callback path:

`/api/auth/google/callback`

For local development on the default port, the full redirect URI must be:

`http://localhost:3000/api/auth/google/callback`

Use `localhost`, not `127.0.0.1`, unless you also change the env var and the OAuth client settings to match exactly.

## Google Cloud Console Clicks

Use your existing project:

- Project: `AI Real Estate Content Engine`

Then click:

1. `Google Cloud Console` → project picker → select `AI Real Estate Content Engine`
2. `APIs & Services` → `Enabled APIs & services` → `+ ENABLE APIS AND SERVICES`
3. Search `Google Docs API` → open it → click `Enable`
4. Go back to `+ ENABLE APIS AND SERVICES`
5. Search `Google Drive API` → open it → click `Enable`
6. `Google Auth Platform` → `Branding`
7. Complete the app details if they are not already saved
8. `Google Auth Platform` → `Audience`
9. Keep the app in `Testing` unless you have already published it
10. Add your Google account under `Test users`
11. `Google Auth Platform` → `Clients`
12. `Create client`
13. Application type: `Web application`
14. Name: `AI Real Estate Content Engine Local`
15. Authorized JavaScript origins: `http://localhost:3000`
16. Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
17. Click `Create`

## Exact OAuth Client Settings

Create a `Web application` OAuth client with:

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

If you want to run the app on another port later, add a second origin and redirect URI for that port too.

## `.env.local` Values

Copy these values into `.env.local`:

```env
GOOGLE_DOCS_SHARE_MODE=anyone_with_link
GOOGLE_DOCS_SHARE_EMAIL=
GOOGLE_OAUTH_CLIENT_ID=your-google-oauth-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

Notes:

- `GOOGLE_DOCS_SHARE_MODE=anyone_with_link` is the easiest demo setup
- Leave `GOOGLE_DOCS_SHARE_EMAIL` empty unless you want `share_with_email`
- Old service-account variables are not used by the OAuth flow

## Local Test Flow

1. Start the app with `npm run dev`
2. Generate a content plan
3. Open the results page
4. Click `Connect Google`
5. Complete the Google consent flow with a test user on the correct project
6. Return to the results page
7. Click `Export to Google Docs`
8. Open the returned Google Doc URL

## Troubleshooting

- If Google says `redirect_uri_mismatch`, the redirect URI in the OAuth client does not exactly match `.env.local`
- If the consent screen blocks the login, add your Google account as a test user in the same project
- If Google says an API is disabled, enable both `Google Docs API` and `Google Drive API` in the same project as the OAuth client
- If the app says the Google connection is no longer valid, reconnect through `Connect Google`
