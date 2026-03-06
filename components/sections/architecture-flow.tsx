import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { architectureSteps } from "@/lib/constants";

export function ArchitectureFlow({
  title = "Visible system architecture",
  description = "The app makes the orchestration legible so the project reads as a real automation system, not a prompt box.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="System Architecture"
        title={title}
        description={description}
      />
      <div className="grid gap-4 lg:grid-cols-5">
        {architectureSteps.map((step, index) => (
          <div key={step.title} className="flex items-stretch gap-4 lg:contents">
            <Card className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-strong)]">
                  Step {index + 1}
                </span>
                <span className="text-sm text-[var(--ink-soft)]">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--ink)]">{step.title}</h3>
              <p className="text-sm leading-7 text-[var(--ink-soft)]">{step.description}</p>
            </Card>
            {index < architectureSteps.length - 1 ? (
              <div className="hidden items-center justify-center lg:flex">
                <ArrowRight className="h-5 w-5 text-[var(--brand-strong)]" />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
