"use client";

import Link from "next/link";
import { ArrowRight, Layers3, LoaderCircle, Sparkles, Wand2 } from "lucide-react";
import { useDeferredValue, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContentPreset, presetCards } from "@/lib/content-presets";
import { demoBrief, nicheSuggestions, sampleBriefs, tonePresets } from "@/lib/constants";
import {
  generationInputSchema,
  platformOptions,
  type ContentPresetKey,
  type GenerationInput,
} from "@/lib/types/content";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<keyof GenerationInput, string>>;

const defaultPreset: ContentPresetKey = "saas-productized-service";

const emptyValues: GenerationInput = {
  preset: defaultPreset,
  businessName: "",
  niche: "",
  targetAudience: "",
  offer: "",
  goals: "",
  tone: "",
  primaryCta: "",
  keyThemes: "",
  extraContext: "",
  platforms: ["LinkedIn", "Instagram"],
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
  const selectedPreset = getContentPreset(values.preset);

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
    setValues(sampleBriefs[values.preset] ?? demoBrief);
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
      preset: flattened.preset?.[0],
      businessName: flattened.businessName?.[0],
      niche: flattened.niche?.[0],
      targetAudience: flattened.targetAudience?.[0],
      offer: flattened.offer?.[0],
      goals: flattened.goals?.[0],
      tone: flattened.tone?.[0],
      primaryCta: flattened.primaryCta?.[0],
      keyThemes: flattened.keyThemes?.[0],
      extraContext: flattened.extraContext?.[0],
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
            <p className="eyebrow">Structured Brief</p>
            <h2 className="font-display text-4xl leading-none text-[var(--ink)]">
              Build a month of strategic social content
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Choose a preset, define the business context, and the engine will assemble a
              30-day content system with captions, carousel outlines, short-form video
              scripts, marketing scripts, hashtags, and image prompts.
            </p>
          </div>
          <Badge tone={runtimeTone}>{runtimeLabel}</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-semibold text-[var(--ink)]">Preset</label>
            {errors.preset ? <span className="text-sm text-red-600">{errors.preset}</span> : null}
          </div>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">
            Presets tune the content system for common business models while keeping the rest of
            the workflow reusable across niches.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {presetCards.map((preset) => {
              const selected = values.preset === preset.key;

              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => updateField("preset", preset.key)}
                  className={cn(
                    "rounded-[24px] border p-4 text-left transition",
                    selected
                      ? "border-teal-500 bg-teal-50 shadow-[0_12px_28px_rgba(15,118,110,0.14)]"
                      : "border-[var(--line)] bg-white/80 hover:border-teal-200 hover:bg-white",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[var(--ink)]">{preset.label}</div>
                      <p className="mt-2 text-xs leading-6 text-[var(--ink-soft)]">
                        {preset.description}
                      </p>
                    </div>
                    {selected ? (
                      <span className="rounded-full bg-teal-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                        Active
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Business or brand name"
            value={values.businessName}
            error={errors.businessName}
            onChange={(value) => updateField("businessName", value)}
            placeholder="RelayWorks Studio"
          />
          <Field
            label="Niche / industry"
            value={values.niche}
            error={errors.niche}
            onChange={(value) => updateField("niche", value)}
            placeholder="AI automation systems and productized services"
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
            label="Offer / service / product"
            value={values.offer}
            error={errors.offer}
            onChange={(value) => updateField("offer", value)}
            placeholder="Automation implementation sprints and ongoing optimization"
          />
          <Field
            label="Primary call to action"
            value={values.primaryCta}
            error={errors.primaryCta}
            onChange={(value) => updateField("primaryCta", value)}
            placeholder="Visit the site to book a systems call"
          />
        </div>

        <Field
          label="Target audience"
          value={values.targetAudience}
          error={errors.targetAudience}
          onChange={(value) => updateField("targetAudience", value)}
          placeholder="Founders and operators who want more leverage from automation without adding full-time systems headcount"
          multiline
        />

        <Field
          label="Goals"
          value={values.goals}
          error={errors.goals}
          onChange={(value) => updateField("goals", value)}
          placeholder="Drive qualified website traffic, increase discovery calls, and build authority around the offer"
          helper={
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedPreset.goalSuggestions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => updateField("goals", goal)}
                  className="rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-[var(--ink-soft)] ring-1 ring-[rgba(25,34,53,0.08)]"
                >
                  {goal}
                </button>
              ))}
            </div>
          }
          multiline
        />

        <Field
          label="Tone / brand voice"
          value={values.tone}
          error={errors.tone}
          onChange={(value) => updateField("tone", value)}
          placeholder="Sharp, modern, and commercially useful"
          helper={
            <div className="mt-2 flex flex-wrap gap-2">
              {[...selectedPreset.toneSuggestions, ...tonePresets].slice(0, 5).map((preset) => (
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
          label="Key themes / campaign focus"
          value={values.keyThemes}
          error={errors.keyThemes}
          onChange={(value) => updateField("keyThemes", value)}
          placeholder="Use cases, customer outcomes, workflow demos, objections, traffic-driving hooks"
          helper={
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedPreset.themeSuggestions.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => updateField("keyThemes", theme)}
                  className="rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-[var(--ink-soft)] ring-1 ring-[rgba(25,34,53,0.08)]"
                >
                  {theme}
                </button>
              ))}
            </div>
          }
          multiline
        />

        <Field
          label="Extra context (optional)"
          value={values.extraContext}
          error={errors.extraContext}
          onChange={(value) => updateField("extraContext", value)}
          placeholder="Add launch timing, local market context, differentiators, product notes, seasonal pushes, promotions, or proof points"
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
            Platform choices shape the content mix, pacing, and how aggressively the system leans
            into traffic, education, or awareness content.
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
            Load {selectedPreset.shortLabel} sample
          </Button>
          <Link href="/architecture" className={buttonStyles({ variant: "ghost", size: "lg" })}>
            View architecture
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
                {preview.businessName || "Campaign identity builds here"}
              </h3>
            </div>
          </div>
          <div className="grid gap-3 rounded-[24px] bg-white/80 p-4">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Preset + niche
              </div>
              <div className="mt-1 text-sm text-[var(--ink)]">
                {[selectedPreset.label, preview.niche].filter(Boolean).join(" • ") ||
                  "Choose a preset and niche to anchor the strategy"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Offer
              </div>
              <div className="mt-1 text-sm text-[var(--ink)]">
                {preview.offer || "Add the product, service, or offer the content should support"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Audience
              </div>
              <div className="mt-1 text-sm text-[var(--ink)]">
                {preview.targetAudience ||
                  "Describe the audience the content should persuade and convert"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--brand-strong)]">
                Goals
              </div>
              <div className="mt-1 text-sm text-[var(--ink)]">
                {preview.goals || "Add the commercial goal this month of content should support"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-[var(--ink)]">
              <Layers3 className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Preset Guidance</p>
              <h3 className="text-2xl font-semibold text-[var(--ink)]">{selectedPreset.label}</h3>
            </div>
          </div>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            {selectedPreset.description}
          </p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            {selectedPreset.promptGuidance}
          </p>
        </Card>

        <Card className="space-y-4">
          <p className="eyebrow">What This Run Produces</p>
          <div className="space-y-3 text-sm leading-7 text-[var(--ink-soft)]">
            <p>1. A 30-day content calendar with post type, topic, caption, hashtags, image prompt, and CTA.</p>
            <p>2. Ten carousel outlines, ten short-form video scripts, and ten marketing scripts for higher-leverage publishing.</p>
            <p>3. Export-ready markdown, JSON, HTML, print, and Google Docs deliverables for review or client handoff.</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <p className="eyebrow">Demo Tip</p>
          <p className="text-sm leading-7 text-[var(--ink-soft)]">
            Switch presets and load the matching sample brief to show how the workflow adapts for
            SaaS, services, real estate, e-commerce, creator brands, and local businesses without
            changing the app structure.
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
