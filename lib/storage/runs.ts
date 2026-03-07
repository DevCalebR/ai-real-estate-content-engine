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

async function readPlanFile(filePath: string) {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    return generatedContentPlanSchema.parse(JSON.parse(contents));
  } catch (error) {
    if (
      error instanceof Error &&
      ("code" in error ? error.code === "ENOENT" : false)
    ) {
      return null;
    }

    // Skip old or invalid local run files instead of breaking history.
    return null;
  }
}

export async function saveContentPlan(plan: GeneratedContentPlan) {
  await ensureRunsDirectory();
  const filePath = path.join(runsDirectory, `${plan.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(plan, null, 2), "utf8");
}

export async function getContentPlan(id: string) {
  const filePath = path.join(runsDirectory, `${id}.json`);
  return readPlanFile(filePath);
}

export async function listContentPlans(): Promise<GeneratedContentPlan[]> {
  await ensureRunsDirectory();
  const files = await fs.readdir(runsDirectory);

  const plans = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map((file) => readPlanFile(path.join(runsDirectory, file))),
  );

  return plans
    .filter((plan): plan is GeneratedContentPlan => plan !== null)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function listRunSummaries(): Promise<RunSummary[]> {
  const plans = await listContentPlans();
  return plans.map(buildRunSummary);
}
