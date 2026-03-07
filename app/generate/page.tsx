import type { Metadata } from "next";

import { GenerationForm } from "@/components/forms/generation-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAiRuntimeStatus } from "@/lib/ai/config";
import { productDescription } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Generate",
  description: productDescription,
};

export default function GeneratePage() {
  const runtime = getAiRuntimeStatus();
  const runtimeLabel =
    runtime.activeMode === "claude"
      ? `Live Claude${runtime.claudeModel ? ` · ${runtime.claudeModel}` : ""}`
      : runtime.activeMode === "misconfigured"
        ? "Claude selected but env vars are incomplete"
        : "Demo mode active";

  return (
    <div className="space-y-10 pb-12">
      <section className="space-y-5">
        <SectionHeading
          eyebrow="Generate"
          title="Create a client-ready monthly content system"
          description="The form feeds a typed orchestration pipeline that returns structured JSON, formats it into organized deliverables, stores the run locally, and makes exports immediately available."
        />
        {runtime.activeMode === "misconfigured" ? (
          <Card className="border-amber-200 bg-amber-50/90">
            <p className="text-sm leading-7 text-amber-900">
              Claude mode is selected in the environment, but `CLAUDE_API_KEY` and/or
              `CLAUDE_MODEL` are missing. Switch `AI_PROVIDER=demo` or complete the
              Claude configuration to generate content successfully.
            </p>
          </Card>
        ) : null}
      </section>

      <GenerationForm
        runtimeLabel={runtimeLabel}
        runtimeTone={runtime.activeMode === "misconfigured" ? "warning" : "accent"}
      />
    </div>
  );
}
