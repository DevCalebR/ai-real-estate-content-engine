import { getAiRuntimeStatus } from "@/lib/ai/config";
import { generateClaudeContentPlan } from "@/lib/ai/providers/claude";
import { generateDemoContentPlan } from "@/lib/ai/providers/demo";
import { formatContentPlan } from "@/lib/formatting/plan";
import { type GeneratedContentPlan, type GenerationInput } from "@/lib/types/content";

export async function generateContentPlan(
  input: GenerationInput,
): Promise<GeneratedContentPlan> {
  const runtime = getAiRuntimeStatus();

  if (runtime.activeMode === "misconfigured") {
    throw new Error(
      "Claude mode is enabled, but CLAUDE_API_KEY and CLAUDE_MODEL are not fully configured.",
    );
  }

  const rawOutput =
    runtime.activeMode === "claude"
      ? await generateClaudeContentPlan(
          input,
          process.env.CLAUDE_API_KEY?.trim() ?? "",
          runtime.claudeModel,
        )
      : await generateDemoContentPlan(input);

  return formatContentPlan({
    rawOutput,
    input,
    modeUsed: runtime.activeMode,
  });
}
