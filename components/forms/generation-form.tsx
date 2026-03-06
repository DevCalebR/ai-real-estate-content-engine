"use client";

import Link from "next/link";
import { ArrowRight, LoaderCircle, Sparkles, Wand2 } from "lucide-react";
import { useDeferredValue, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoBrief, nicheSuggestions, tonePresets } from "@/lib/constants";
import {
  generationInputSchema,
  platformOptions,
  type GenerationInput,
} from "@/lib/types/content";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<keyof GenerationInput, string>>;

const emptyValues: GenerationInput = {
  agentName: "",
  city: "",
  niche: "",
  targetAudience: "",
  tone: "",
  primaryCta: "",
  listingHighlights: "",
  platforms: ["Instagram"],
};

export function GenerationForm({
  runtimeLabel,
  runtimeTone,
}: {
  runtimeLabel: string;
  runtimeTone: "accent" | "warning";
}) {
  const router = useRouter();
  const [values, setValues] = useState<GenerationInput>(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const preview = useDeferredValue(values);

  function updateField<Key extends keyof GenerationInput>(
    field: Key,
    value: GenerationInput[Key],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function togglePlatform(platform: (typeof platformOptions)[number]) {
    const nextPlatforms = values.platforms.includes(platform)
      ? values.platforms.filter((entry) => entry !== platform)
      : [...values.platforms, platform];

    updateField("platforms", nextPlatforms);
  }

  function loadSampleBrief() {
    setValues(demoBrief);
    setErrors({});
    setServerError(null);
  }

  function validateClientInput() {
    const parsed = generationInputSchema.safeParse(values);

    if (parsed.success) {
      setErrors({});
      return parsed.data;
    }

    const flattened = parsed.error.flatten().fieldErrors;

    setErrors({
      agentName: flattened.agentName?.[0],
      city: flattened.city?.[0],
      niche: flattened.niche?.[0],
      targetAudience: flattened.targetAudience?.[0],
      tone: flattened.tone?.[0],
      primaryCta: flattened.primaryCta?.[0],
      listingHighlights: flattened.listingHighlights?.[0],
      platforms: flattened.platforms?.[0],
    });

    return null;
  }

  function submitForm() {
    const parsed = validateClientInput();

    if (!parsed) {
      return;
    }

    setServerError(null);

    startTransition(() => {
      void (async () => {
        try {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as
              | { error?: string }
              | null;
            throw new Error(payload?.error || "Content generation failed.");
          }

          const payload = (await response.json()) as { id: string };
          router.push(`/results/${payload.id}`);
          router.refresh();
        } catch (error) {
          setServerError(
            error instanceof Error
              ? error.message
              : "Something went wrong while generating content.",
          );
        }
      })();
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Client Brief</p>
            <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
              Build a month of content
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Fill in the market, positioning, voice, and CTA. The engine will turn the
              brief into a 30-day plan with captions, carousel outlines, short-form video
              scripts, hashtags, and image prompts.
            </p>
          </div>
          <Badge tone={runtimeTone}>{runtimeLabel}</Badge>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Agent or business name"
            value={values.agentName}
            error={errors.agentName}
            onChange={(value) => updateField("agentName", value)}
            placeholder="Northshore Realty Group"
          />
          <Field
            label="City or market"
            value={values.city}
            error={errors.city}
            onChange={(value) => updateField("city", value)}
            placeholder="Austin, TX"
          />
          <Field
            label="Niche"
            value={values.niche}
            error={errors.niche}
            onChange={(value) => updateField("niche", value)}
            placeholder="Luxury homes"
            helper={
              <div className="mt-2 flex flex-wrap gap-2">
                {nicheSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => updateField("niche", suggestion)}
                    className="rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-[var(--ink-soft)] ring-1 ring-[rgba(25,34,53,0.08)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            }
          />
          <Field
            label="Primary call to action"
            value={values.primaryCta}
            error={errors.primaryCta}
            onChange={(value) => updateField("primaryCta", value)}
            placeholder="Book a buyer strategy call"
          />
        </div>

        <Field
          label="Target audience"
          value={values.targetAudience}
          error={errors.targetAudience}
          onChange={(value) => updateField("targetAudience", value)}
          placeholder="Relocating executives who want a clear, trusted advisor"
          multiline
        />

        <Field
          label="Tone and brand voice"
          value={values.tone}
          error={errors.tone}
          onChange={(value) => updateField("tone", value)}
          placeholder="Calm, modern, luxury editorial"
          helper={
            <div className="mt-2 flex flex-wrap gap-2">
              {tonePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => updateField("tone", preset)}
                  className="rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-[var(--ink-soft)] ring-1 ring-[rgba(25,34,53,0.08)]"
                >
                  {preset}
                </button>
              ))}
            </div>
          }
        />

        <Field
          label="Listing or property highlights (optional)"
          value={values.listingHighlights}
          error={errors.listingHighlights}
          onChange={(value) => updateField("listingHighlights", value)}
          placeholder="Water views, turnkey interiors, walkable neighborhoods, new construction"
          multiline
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-[var(--ink)]">Preferred platforms</label>
            {errors.platforms ? (
              <span className="text-sm text-red-600">{errors.platforms}</span>
            ) : null}
          </div>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            Platform choices shape the content mix, format emphasis, and channel-specific framing.
          </p>
          <div className="flex flex-wrap gap-3">
            {platformOptions.map((platform) => {
              const selected = values.platforms.includes(platform);

              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    selected
                      ? "bg-[var(--ink)] text-white shadow-[0_10px_24px_rgba(25,34,53,0.16)]"
                      : "bg-white/70 text-[var(--ink-soft)] ring-1 ring-[rgba(25,34,53,0.1)]",
                  )}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        {serverError ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="button" size="lg" onClick={submitForm} disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Building the monthly plan
              </>
            ) : (
              <>
                Generate Monthly Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={loadSampleBrief}>
            <Wand2 className="mr-2 h-4 w-4" />
            Load Sample Brief
          </Button>
          <Link href="/architecture" className={buttonStyles({ variant: "ghost", size: "lg" })}>
            View Architecture
          </Link>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Live Preview</p>
              <h3 className="text-2xl font-semibold text-[var(--ink)]">
                {preview.agentName || "Campaign identity builds here"}
              </h3>
            </div>
          </div>
          <div className="grid gap-3 rounded-[24px] bg-white/80 p-4">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Market + niche
              </div>
              <div className="mt-1 text-sm text-[var(--ink)]">
                {[preview.city, preview.niche].filter(Boolean).join(" • ") ||
                  "Add a market and niche to anchor the content strategy"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Audience
              </div>
              <div className="mt-1 text-sm text-[var(--ink)]">
                {preview.targetAudience ||
                  "Add the audience this content should persuade and convert"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Brand voice
              </div>
              <div className="mt-1 text-sm text-[var(--ink)]">
                {preview.tone || "Choose the brand voice the system should preserve"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="eyebrow">What This Run Produces</p>
          <div className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <p>1. A 30-day content calendar with post type, topic, caption, hashtags, and CTA.</p>
            <p>2. Ten carousel outlines and ten short-form video scripts for higher-effort assets.</p>
            <p>3. Export-ready markdown, JSON, HTML, and print-friendly client handoff options.</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="eyebrow">Demo Tip</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            Use <strong>Load Sample Brief</strong> for a fast walkthrough, then change the
            market, niche, or tone live to show that the output reorients around the brief
            instead of behaving like a fixed prompt template.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  placeholder,
  helper,
  multiline = false,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder: string;
  helper?: React.ReactNode;
  multiline?: boolean;
}) {
  const classes =
    "w-full rounded-[22px] border border-[var(--line)] bg-white/80 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-semibold text-[var(--ink)]">{label}</label>
        {error ? <span className="text-sm text-red-600">{error}</span> : null}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className={classes}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={classes}
        />
      )}
      {helper}
    </div>
  );
}
