import Anthropic from "@anthropic-ai/sdk";

import { buildContentPlanPrompt } from "@/lib/prompts/content-plan";
import {
  rawGenerationOutputSchema,
  type GenerationInput,
  type RawGenerationOutput,
} from "@/lib/types/content";
import { extractJsonObject } from "@/lib/utils";

export async function generateClaudeContentPlan(
  input: GenerationInput,
  apiKey: string,
  model: string,
): Promise<RawGenerationOutput> {
  const anthropic = new Anthropic({ apiKey });
  const prompt = buildContentPlanPrompt(input);

  const response = await anthropic.messages.create({
    model,
    max_tokens: 7000,
    system: prompt.system,
    messages: [
      {
        role: "user",
        content: prompt.user,
      },
    ],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Claude returned an empty response.");
  }

  const parsed = JSON.parse(extractJsonObject(text));
  return rawGenerationOutputSchema.parse(parsed);
}
