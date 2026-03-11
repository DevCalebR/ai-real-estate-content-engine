# Portfolio Manual Steps

These are the only manual follow-ups still worth doing after the portfolio-readiness pass.

## Before showing it publicly

1. Decide whether you want to keep the current GitHub repo slug or rename it so it matches `monthly-ai-content-engine`.
2. Review the screenshot assets in `docs/portfolio-assets/` and replace any that you want with newer captures after future UI changes.
3. Confirm your preferred default sample brand and CTA wording if you want something more generic than the current RelayWorks-style SaaS sample.

## Before deploying to Vercel

1. Add `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`, and `GOOGLE_DOCS_SHARE_MODE` to Vercel environment variables.
2. Add the deployed domain as an authorized JavaScript origin and callback URI in the Google OAuth client.
3. Move local JSON token storage and run storage to durable storage if you want reliable multi-session hosted behavior.

## Before enabling live Claude generation

1. Set `AI_PROVIDER=claude`.
2. Add `CLAUDE_API_KEY` and `CLAUDE_MODEL`.
3. Re-test at least one run for SaaS / Productized Service, one for Coach / Consultant, and one for Real Estate.
4. Review the output tone and CTA quality before using Claude mode in a public demo.
