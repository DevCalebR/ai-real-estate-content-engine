import type { RuntimeMode } from "@/lib/types/content";

export type AiRuntimeStatus = {
  requestedMode: RuntimeMode;
  activeMode: RuntimeMode | "misconfigured";
  claudeModel: string;
  hasClaudeApiKey: boolean;
};

export function getAiRuntimeStatus(): AiRuntimeStatus {
  const requestedMode =
    process.env.AI_PROVIDER?.toLowerCase() === "claude" ? "claude" : "demo";
  const claudeModel = process.env.CLAUDE_MODEL?.trim() ?? "";
  const hasClaudeApiKey = Boolean(process.env.CLAUDE_API_KEY?.trim());

  if (requestedMode === "demo") {
    return {
      requestedMode,
      activeMode: "demo",
      claudeModel,
      hasClaudeApiKey,
    };
  }

  return {
    requestedMode,
    activeMode: hasClaudeApiKey && Boolean(claudeModel) ? "claude" : "misconfigured",
    claudeModel,
    hasClaudeApiKey,
  };
}
