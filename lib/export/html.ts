import { productByline, productName } from "@/lib/brand";
import { getContentPreset } from "@/lib/content-presets";
import type { GeneratedContentPlan } from "@/lib/types/content";
import { formatDate } from "@/lib/utils";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildHtmlReport(plan: GeneratedContentPlan) {
  const preset = getContentPreset(plan.input.preset);
  const calendarCards = plan.deliverables.monthlyContentCalendar
    .map(
      (entry) => `
        <article class="card">
          <div class="eyebrow">Day ${entry.day} · ${escapeHtml(entry.contentType)}</div>
          <h3>${escapeHtml(entry.theme)}</h3>
          <p>${escapeHtml(entry.angle)}</p>
          <dl>
            <div><dt>Publish date</dt><dd>${escapeHtml(formatDate(entry.publishDate))}</dd></div>
            <div><dt>Platforms</dt><dd>${escapeHtml(entry.platformFocus.join(", "))}</dd></div>
            <div><dt>CTA</dt><dd>${escapeHtml(entry.cta)}</dd></div>
          </dl>
          <div class="block">
            <strong>Caption</strong>
            <p>${escapeHtml(entry.caption)}</p>
          </div>
          <div class="block">
            <strong>Hashtags</strong>
            <p>${escapeHtml(entry.hashtags.join(" "))}</p>
          </div>
          <div class="block">
            <strong>Image prompt</strong>
            <p>${escapeHtml(entry.imagePrompt)}</p>
          </div>
        </article>
      `,
    )
    .join("");

  const carouselCards = plan.deliverables.carouselText
    .map(
      (carousel) => `
        <article class="card compact">
          <div class="eyebrow">Carousel · Day ${carousel.day}</div>
          <h3>${escapeHtml(carousel.title)}</h3>
          <ol>
            ${carousel.slides
              .map(
                (slide) =>
                  `<li><strong>Slide ${slide.slide}:</strong> ${escapeHtml(slide.title)} — ${escapeHtml(slide.body)}</li>`,
              )
              .join("")}
          </ol>
          <p><strong>CTA:</strong> ${escapeHtml(carousel.cta)}</p>
        </article>
      `,
    )
    .join("");

  const videoCards = plan.deliverables.videoScripts
    .map(
      (script) => `
        <article class="card compact">
          <div class="eyebrow">Video · Day ${script.day}</div>
          <h3>${escapeHtml(script.title)}</h3>
          <p><strong>Hook:</strong> ${escapeHtml(script.hook)}</p>
          <ul>${script.body.map((beat) => `<li>${escapeHtml(beat)}</li>`).join("")}</ul>
          <p><strong>CTA:</strong> ${escapeHtml(script.cta)}</p>
        </article>
      `,
    )
    .join("");

  const marketingCards = plan.deliverables.marketingScripts
    .map(
      (script) => `
        <article class="card compact">
          <div class="eyebrow">${escapeHtml(script.format)} · Day ${script.day}</div>
          <h3>${escapeHtml(script.title)}</h3>
          <p><strong>Hook:</strong> ${escapeHtml(script.hook)}</p>
          <ul>${script.body.map((beat) => `<li>${escapeHtml(beat)}</li>`).join("")}</ul>
          <p><strong>CTA:</strong> ${escapeHtml(script.cta)}</p>
        </article>
      `,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(plan.summary.campaignTitle)}</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #182033;
        --muted: #59637b;
        --line: rgba(24, 32, 51, 0.12);
        --paper: #f8f5ef;
        --card: #fffdf8;
        --accent: #0f766e;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: linear-gradient(180deg, #fffdf7 0%, #f3ede1 100%);
        color: var(--ink);
      }
      main {
        width: min(1200px, calc(100% - 48px));
        margin: 0 auto;
        padding: 48px 0 80px;
      }
      h1, h2, h3 { margin: 0; }
      p, li, dd, dt { line-height: 1.6; }
      header {
        background: linear-gradient(135deg, #172033 0%, #215c57 100%);
        color: white;
        border-radius: 32px;
        padding: 40px;
        margin-bottom: 32px;
      }
      section { margin-top: 28px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 18px;
      }
      .card {
        background: var(--card);
        border: 1px solid var(--line);
        border-radius: 24px;
        padding: 20px;
        box-shadow: 0 18px 40px rgba(24, 32, 51, 0.08);
      }
      .compact ol, .compact ul { padding-left: 20px; }
      .eyebrow {
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 24px;
      }
      .metric {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 20px;
        padding: 16px;
      }
      .metric strong {
        display: block;
        font-size: 24px;
        margin-bottom: 4px;
      }
      dl {
        margin: 18px 0;
        display: grid;
        gap: 10px;
      }
      dt {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--muted);
      }
      dd { margin: 0; }
      .block {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--line);
      }
      .brand-line {
        color: rgba(255,255,255,0.78);
        font-size: 13px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      @media print {
        body { background: white; }
        header { break-inside: avoid; }
        .card { box-shadow: none; }
      }
      @media (max-width: 760px) {
        main { width: min(100% - 24px, 1200px); padding-top: 24px; }
        header { padding: 24px; border-radius: 24px; }
        .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div class="eyebrow">${escapeHtml(productName)}</div>
        <div class="brand-line">${escapeHtml(productByline)}</div>
        <h1>${escapeHtml(plan.summary.campaignTitle)}</h1>
        <p>${escapeHtml(plan.summary.positioning)}</p>
        <p>${escapeHtml(plan.summary.narrative)}</p>
        <div class="metrics">
          <div class="metric"><strong>${plan.stats.totalPosts}</strong><span>Total posts</span></div>
          <div class="metric"><strong>${plan.stats.carouselCount}</strong><span>Carousel outlines</span></div>
          <div class="metric"><strong>${plan.stats.videoCount}</strong><span>Video scripts</span></div>
          <div class="metric"><strong>${plan.stats.marketingScriptCount}</strong><span>Marketing scripts</span></div>
        </div>
      </header>
      <section>
        <div class="eyebrow">Campaign brief</div>
        <div class="grid">
          <article class="card"><strong>Business</strong><p>${escapeHtml(plan.input.businessName)}</p></article>
          <article class="card"><strong>Preset</strong><p>${escapeHtml(preset.label)}</p></article>
          <article class="card"><strong>Niche</strong><p>${escapeHtml(plan.input.niche)}</p></article>
          <article class="card"><strong>Offer</strong><p>${escapeHtml(plan.input.offer)}</p></article>
          <article class="card"><strong>Goals</strong><p>${escapeHtml(plan.input.goals)}</p></article>
          <article class="card"><strong>CTA</strong><p>${escapeHtml(plan.input.primaryCta)}</p></article>
        </div>
      </section>
      <section>
        <div class="eyebrow">Monthly content calendar</div>
        <div class="grid">${calendarCards}</div>
      </section>
      <section>
        <div class="eyebrow">Carousel outlines</div>
        <div class="grid">${carouselCards}</div>
      </section>
      <section>
        <div class="eyebrow">Video scripts</div>
        <div class="grid">${videoCards}</div>
      </section>
      <section>
        <div class="eyebrow">Marketing scripts</div>
        <div class="grid">${marketingCards}</div>
      </section>
    </main>
  </body>
</html>`;
}
