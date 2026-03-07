# Monthly AI Content Engine

Product by RelayWorks

Monthly AI Content Engine is a niche-agnostic social content automation platform that turns one structured business brief into a full month of strategic social content. It generates a 30-day content calendar, captions, carousel outlines, short-form video scripts, marketing scripts, hashtags, image prompts, and client-ready exports from one reusable workflow.

The product is designed to feel like a polished SaaS application rather than a prompt wrapper. It includes preset-aware generation, local run history, export delivery, Claude-ready model abstraction, demo-safe mode, and a working Google Docs OAuth export flow.

## What It Does

- Collects a structured monthly content brief for any niche or business type
- Uses a preset-aware generation pipeline to create a full month of social content
- Saves each run locally so results can be reopened, compared, and exported later
- Exports every plan as markdown, JSON, HTML, print-friendly report, and Google Docs
- Supports demo mode with no external AI key required
- Supports live Claude generation through an interchangeable provider layer

## Supported Niches

The current preset system supports:

- Real Estate
- Coach / Consultant
- SaaS / Productized Service
- E-commerce
- Local Business
- Creator Brand

The SaaS / Productized Service preset is intentionally strong for:

- SaaS products
- Automation tools
- Agencies
- Productized services
- Startups
- Online tools

It is tuned for traffic generation, product education, offer clarity, signups, demos, and website clicks across Instagram, LinkedIn, TikTok, Facebook, and X / Twitter.

## Core Features

- 30-day monthly content calendar with day-by-day post strategy
- 30 captions grouped by post
- 10 carousel outlines with slide-by-slide text
- 10 short-form video scripts with hook, body, and CTA
- 10 marketing scripts for traffic-driving and offer-focused social promotion
- Hashtag recommendations for every post
- Image prompts for design generation
- Preset-based workflow for multiple industries
- Demo mode and Claude mode behind the same app contract
- Local history of previous runs
- Markdown, JSON, HTML, print, and Google Docs exports
- Google OAuth connection flow for personal Drive export

## Product Architecture

Visible workflow inside the app:

1. Input Form
2. AI Orchestration
3. Structured Content Generation
4. Formatting Engine
5. Export Deliverables

Implementation notes:

- `app/` holds pages, route handlers, and export endpoints
- `components/` contains the UI shell, form, tabs, and reusable view components
- `lib/ai/` abstracts provider selection and model calls
- `lib/prompts/` keeps prompt logic out of route handlers
- `lib/formatting/` converts raw model output into saved deliverables
- `lib/export/` builds markdown and HTML reports
- `lib/integrations/` contains Google Docs and Google OAuth logic
- `lib/storage/` stores runs and OAuth tokens locally for portfolio/demo use

## How Presets Work

Each preset contributes:

- positioning guidance
- demo-generation theme banks
- preset-specific copy angles
- sample briefs
- platform-aware content bias

The preset shapes the generation behavior without changing the rest of the app. That keeps the workflow reusable across industries while still producing more believable demo and live outputs.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zod
- Anthropic Claude API
- Google Docs API
- Google Drive API
- Local JSON storage for demo-friendly persistence

## Local Setup

```bash
git clone https://github.com/DevCalebR/ai-real-estate-content-engine.git
cd ai-real-estate-content-engine
npm install
cp .env.example .env.local
npm run dev
```

Open:

`http://localhost:3000`

## Environment Variables

```env
AI_PROVIDER=demo
CLAUDE_API_KEY=
CLAUDE_MODEL=

GOOGLE_DOCS_SHARE_MODE=anyone_with_link
GOOGLE_DOCS_SHARE_EMAIL=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## Demo Mode vs Live AI Mode

### Demo Mode

Use:

`AI_PROVIDER=demo`

Behavior:

- no external AI key required
- returns believable preset-aware structured content
- still exercises the real formatting, storage, history, and export pipeline

### Claude Mode

Use:

`AI_PROVIDER=claude`

Required:

- `CLAUDE_API_KEY`
- `CLAUDE_MODEL`

Behavior:

- runs the same workflow through the Claude provider
- uses the same prompt module and output schema
- fails safely if Claude env vars are incomplete

## Export Features

Every saved run can be exported as:

- Markdown
- JSON
- HTML report
- Print-friendly view for browser PDF export
- Google Docs document in the connected user’s Drive

## Google Docs Integration

The Google Docs export creates a brand-new document in the connected user’s Drive and returns the document URL to the UI.

Included sections:

- project summary / brief
- monthly content calendar
- captions grouped by day and post
- carousel outlines
- video scripts
- marketing scripts
- hashtag recommendations
- image prompts

Auth model:

- Google OAuth web flow
- callback route: `/api/auth/google/callback`
- local development redirect URI: `http://localhost:3000/api/auth/google/callback`
- OAuth tokens stored locally in `data/integrations/google-oauth.json`
- token file is ignored by git

Fallback behavior:

- if Google OAuth is not configured, the Google Docs button is disabled with a clear explanation
- if no account is connected, the UI shows `Connect Google`
- markdown, JSON, HTML, and print exports still work normally

Detailed setup:

- [docs/GOOGLE_DOCS_SETUP.md](./docs/GOOGLE_DOCS_SETUP.md)
- [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md)

## Sample Data

Tracked sample data includes:

- `data/sample-brief.json`
- `data/sample-briefs.json`
- `data/sample-brief-real-estate.json`
- `data/sample-brief-coach-consultant.json`
- `data/sample-brief-saas-productized-service.json`
- `data/sample-brief-e-commerce.json`
- `data/sample-brief-local-business.json`
- `data/sample-brief-creator-brand.json`
- `data/sample-demo-run.json`

Regenerate sample files:

```bash
npm run seed:sample
```

## Documentation

- [docs/PORTFOLIO_NOTES.md](./docs/PORTFOLIO_NOTES.md)
- [docs/DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md)
- [docs/CASE_STUDY_BLURB.md](./docs/CASE_STUDY_BLURB.md)
- [docs/SCREENSHOT_CHECKLIST.md](./docs/SCREENSHOT_CHECKLIST.md)
- [docs/SHIP_READINESS_REPORT.md](./docs/SHIP_READINESS_REPORT.md)
- [docs/INTEGRATIONS.md](./docs/INTEGRATIONS.md)
- [docs/GOOGLE_DOCS_SETUP.md](./docs/GOOGLE_DOCS_SETUP.md)

## Portfolio Highlights

- Reads like a SaaS product, not a one-off prompt demo
- Preserves a visible automation pipeline from intake to export
- Uses typed schemas and modular AI/provider architecture
- Includes preset-aware demo data for multiple industries
- Has a working Google OAuth to Google Docs export path
- Can be demoed safely without external AI keys

## Screenshots

Add screenshots for:

- landing page hero
- preset-aware generate page
- results workspace
- export panel with Google Docs success state
- history page
- architecture page

## Future Enhancements

- editable output fields before export
- regenerate a single post or asset
- reusable saved client profiles
- stronger per-platform formatting variants
- durable token and run storage for cloud deployment
- additional model providers beyond Claude
