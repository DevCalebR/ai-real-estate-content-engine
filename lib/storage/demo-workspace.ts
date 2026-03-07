import { generateDemoContentPlan } from "@/lib/ai/providers/demo";
import { demoBrief } from "@/lib/constants";
import { formatContentPlan } from "@/lib/formatting/plan";
import { saveContentPlan } from "@/lib/storage/runs";

export const demoWorkspaceId = "demo-workspace";

export async function seedDemoWorkspace() {
  const createdAt = new Date().toISOString();
  const rawOutput = await generateDemoContentPlan(demoBrief);
  const plan = formatContentPlan({
    rawOutput,
    input: demoBrief,
    modeUsed: "demo",
    createdAt,
    id: demoWorkspaceId,
  });

  await saveContentPlan(plan);
  return plan;
}
