import { promises as fs } from "node:fs";
import path from "node:path";

import {
  buildRunSummary,
  generatedContentPlanSchema,
  type GeneratedContentPlan,
  type RunSummary,
} from "@/lib/types/content";

const runsDirectory = path.join(process.cwd(), "data", "runs");

async function ensureRunsDirectory() {
  await fs.mkdir(runsDirectory, { recursive: true });
}

export async function saveContentPlan(plan: GeneratedContentPlan) {
  await ensureRunsDirectory();
  const filePath = path.join(runsDirectory, `${plan.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(plan, null, 2), "utf8");
}

export async function getContentPlan(id: string) {
  try {
    const filePath = path.join(runsDirectory, `${id}.json`);
    const contents = await fs.readFile(filePath, "utf8");
    return generatedContentPlanSchema.parse(JSON.parse(contents));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function listContentPlans(): Promise<GeneratedContentPlan[]> {
  await ensureRunsDirectory();
  const files = await fs.readdir(runsDirectory);

  const plans = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const contents = await fs.readFile(path.join(runsDirectory, file), "utf8");
        return generatedContentPlanSchema.parse(JSON.parse(contents));
      }),
  );

  return plans.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function listRunSummaries(): Promise<RunSummary[]> {
  const plans = await listContentPlans();
  return plans.map(buildRunSummary);
}
