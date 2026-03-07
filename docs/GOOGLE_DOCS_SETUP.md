# Google Docs Setup

This project supports exporting a generated content plan into a newly created Google Doc.

## What It Uses

- Google Docs API for document creation and content formatting
- Google Drive API for optional sharing / link access

## Recommended Auth Model

Use a Google Cloud service account. This keeps the integration lightweight and demo-friendly for a single-user portfolio project.

## Setup Steps

1. Create or choose a Google Cloud project.
2. Enable the Google Docs API.
3. Enable the Google Drive API.
4. Create a service account.
5. Generate a JSON key for that service account.
6. Copy the service account email and private key into `.env.local`.
7. Keep the private key as the full PEM block from the JSON file. Do not use `private_key_id`.

## Required Environment Variables

```env
GOOGLE_DOCS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_DOCS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DOCS_SHARE_MODE=anyone_with_link
GOOGLE_DOCS_SHARE_EMAIL=
```

Notes:

- Quoted keys with escaped `\n` line breaks are supported
- The app validates the private key before enabling export
- A real service-account private key is much longer than a few hundred characters

## Share Modes

### `anyone_with_link`

- Best for a fast portfolio demo
- The created document is viewable by anyone with the returned link
- No extra share email is required

### `share_with_email`

- Best if you want the exported document shared directly to one Google account
- Requires `GOOGLE_DOCS_SHARE_EMAIL`
- The target email receives writer access

### `private`

- The document stays in the service account Drive
- Useful only if you intentionally want to manage access separately
- The app will still create the document, but the returned link may not be directly useful in a normal browser session

## Fallback Behavior

If Google credentials are not configured:

- the Google Docs button stays disabled
- the UI explains that the integration is not configured
- markdown, JSON, HTML, and print exports still work

If credentials are present but invalid:

- the Google Docs button stays disabled
- the UI shows the configuration problem directly
- the export route returns a safe configuration error instead of a low-level crypto failure

## Troubleshooting

- If the UI says the private key could not be parsed, re-copy the full `private_key` value from the downloaded service-account JSON file.
- If the UI says the client email is invalid, use the `client_email` value from the same JSON file.
- If you want the returned URL to open immediately during a demo, keep `GOOGLE_DOCS_SHARE_MODE=anyone_with_link`.

## Notes For Demos

- `anyone_with_link` is the smoothest setup for a portfolio walkthrough
- `share_with_email` is the better choice if you want the doc editable in your own Google account
- The exported Google Doc includes the brief, calendar, captions, carousel outlines, video scripts, hashtags, and image prompts
