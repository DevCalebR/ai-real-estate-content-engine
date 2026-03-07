# Integrations

This project keeps third-party integrations isolated so the application stays easy to demo, reason about, and extend.

## Claude

Purpose:

- Live model generation for content plans

Where it lives:

- `lib/ai/providers/claude.ts`
- `lib/prompts/content-plan.ts`

Notes:

- Claude is optional
- The app defaults to demo mode when no Claude configuration is present

## Google Docs

Purpose:

- Export a generated run into a newly created Google Doc and return an openable URL

Where it lives:

- `lib/integrations/google-docs.ts`
- `app/api/runs/[id]/export/google-docs/route.ts`

Notes:

- Google Docs export is optional
- The UI stays safe when credentials are missing
- The integration uses a single-user OAuth web flow for personal Drive exports
- OAuth tokens are stored locally in `data/integrations/google-oauth.json`
- Google Drive is used only for sharing/link access behavior

## Export Stack

Purpose:

- Turn saved runs into reusable handoff formats

Where it lives:

- `lib/export/markdown.ts`
- `lib/export/html.ts`
- `lib/integrations/google-docs.ts`

Notes:

- Markdown, JSON, HTML, and print exports work without Google configuration
- Google Docs adds one cloud-based export path without changing the underlying content plan structure
