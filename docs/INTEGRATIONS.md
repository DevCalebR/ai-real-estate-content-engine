# Integrations

## Overview

Monthly AI Content Engine uses lightweight integrations that strengthen the product story without overcomplicating the architecture.

Current integrations:

- Claude for live AI generation
- Google OAuth for account connection
- Google Docs and Google Drive for direct document export and sharing

## Claude

Purpose:

- live monthly content generation through a provider abstraction layer

Files:

- `lib/ai/index.ts`
- `lib/ai/providers/claude.ts`
- `lib/prompts/content-plan.ts`

Notes:

- demo mode remains the default safe fallback
- Claude can be swapped without changing the rest of the app contract

## Google OAuth

Purpose:

- connect a Google account so the app can create Google Docs inside that user’s Drive

Files:

- `app/api/auth/google/start/route.ts`
- `app/api/auth/google/callback/route.ts`
- `lib/integrations/google-oauth.ts`
- `lib/storage/google-oauth.ts`

Notes:

- OAuth tokens are stored locally in `data/integrations/google-oauth.json`
- local token storage is good for portfolio/demo use but should move to durable storage for production hosting

## Google Docs

Purpose:

- export a saved content plan into a newly created Google Doc with clean section formatting

Files:

- `app/api/runs/[id]/export/google-docs/route.ts`
- `lib/integrations/google-docs.ts`

Behavior:

- creates a new Google Doc in the connected user’s Drive
- applies anyone-with-link, private, or share-with-email behavior based on env configuration
- returns the created document URL to the UI

## Why These Integrations Matter

- Claude makes the app useful beyond demo mode
- Google Docs makes delivery more practical for real clients or operators
- The architecture keeps integrations isolated, so the core product stays understandable and maintainable
