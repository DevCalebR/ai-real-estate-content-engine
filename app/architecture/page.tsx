import { ArchitectureFlow } from "@/components/sections/architecture-flow";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  {
    title: "Stable generation contract",
    body: "The UI talks to one content-plan workflow, while the backend can switch between demo mode and Claude without changing the rest of the product.",
  },
  {
    title: "Structured output, not loose text",
    body: "The system expects JSON, validates it, and then formats it into calendar entries, captions, video scripts, carousel copy, hashtags, and exportable deliverables.",
  },
  {
    title: "Local persistence for demos",
    body: "Generated runs are stored as local JSON files so the app can reopen past plans instantly without adding database complexity to a portfolio piece.",
  },
  {
    title: "Clean delivery layer",
    body: "Markdown, JSON, HTML, and print-friendly reports all build from the same saved content plan, which keeps presentation separate from generation.",
  },
] as const;

export default function ArchitecturePage() {
  return (
    <div className="space-y-12 pb-12">
      <SectionHeading
        eyebrow="Architecture"
        title="A visible pipeline from brief to deliverable"
        description="This page explains the workflow in plain language first, then shows the implementation choices that make the product credible as an AI automation system."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <p className="eyebrow">In Plain English</p>
          <h2 className="text-3xl font-semibold text-[var(--ink)]">
            A client fills out one brief and receives a full month of usable content
          </h2>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            The application collects a few business inputs, generates structured content,
            formats it into a reviewable workspace, saves the run, and exports it into clean handoff files.
          </p>
        </Card>
        <Card className="space-y-4">
          <p className="eyebrow">Why This Feels Senior-Level</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            The project separates prompts from route handlers, separates provider calls from
            formatting logic, validates schemas, persists results, and exposes its architecture
            clearly enough for a reviewer to follow the system without reading the entire codebase.
          </p>
        </Card>
      </section>

      <ArchitectureFlow
        title="Workflow inside the app"
        description="The workflow is intentionally legible so a recruiter or client can see how the brief becomes a reusable content system rather than a one-off prompt response."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="space-y-3">
            <p className="eyebrow">Implementation detail</p>
            <h2 className="text-2xl font-semibold text-[var(--ink)]">{pillar.title}</h2>
            <p className="text-sm leading-7 text-[var(--ink-soft)]">{pillar.body}</p>
          </Card>
        ))}
      </section>

      <Card className="space-y-4">
        <p className="eyebrow">Folder intent</p>
        <div className="grid gap-3 text-sm leading-7 text-[var(--ink-soft)] md:grid-cols-2">
          <div>
            <strong className="text-[var(--ink)]">app/</strong> holds pages, route handlers,
            and print/export endpoints.
          </div>
          <div>
            <strong className="text-[var(--ink)]">components/</strong> contains the polished
            UI shell, generation form, result tabs, and reusable display primitives.
          </div>
          <div>
            <strong className="text-[var(--ink)]">lib/ai</strong> contains provider selection
            and the Claude/demo integrations.
          </div>
          <div>
            <strong className="text-[var(--ink)]">lib/prompts</strong> keeps prompt instructions
            out of route handlers and makes the generation contract maintainable.
          </div>
          <div>
            <strong className="text-[var(--ink)]">lib/export</strong> formats saved runs into
            downloadable files.
          </div>
          <div>
            <strong className="text-[var(--ink)]">data/</strong> keeps lightweight local JSON
            persistence suitable for demos.
          </div>
        </div>
      </Card>
    </div>
  );
}
