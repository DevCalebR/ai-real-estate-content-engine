# Portfolio Notes

## What the System Does

AI Real Estate Content Engine turns a short client intake into a full month of social media content for a real estate business.

The user fills out:

- agent or business name
- market/location
- niche
- target audience
- tone / brand voice
- primary CTA
- listing highlights
- preferred platforms

The app returns:

- a 30-day content calendar
- 30 captions
- 10 carousel outlines
- 10 short-form video scripts
- hashtags for every post
- image prompts for design support

## Business Impact

- Cuts manual content planning time from hours to minutes
- Gives agents a reusable monthly campaign system instead of isolated posts
- Makes brand voice, CTA, and market positioning more consistent across channels
- Produces deliverables that can be handed directly to clients, coordinators, or designers
- Demonstrates how AI can be embedded into a real workflow instead of exposed as a raw prompt field

## Architecture

The core system flow is:

Input Form -> AI Orchestration -> Structured Content Generation -> Formatting Engine -> Export Deliverables

Implementation details:

- `app/api/generate` validates the brief and triggers generation
- `lib/ai` abstracts provider selection
- `lib/prompts` keeps generation instructions out of route handlers
- `lib/formatting/plan.ts` transforms raw model output into presentation-ready deliverables
- `lib/storage/runs.ts` persists runs to local JSON for demo history
- `lib/export` produces markdown, JSON, and HTML handoff files

## What to Screenshot

- Home dashboard hero with architecture/feature cards visible
- Generate page with the sample brief loaded
- Results page on the Calendar tab
- Results page on the Exports tab
- History page showing multiple generated runs
- Architecture page showing the workflow cards
- Print view or downloaded HTML report open in a browser
