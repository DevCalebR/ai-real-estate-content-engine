import { promises as fs } from "node:fs";
import path from "node:path";

import { generateDemoContentPlan } from "../lib/ai/providers/demo";
import { demoBrief } from "../lib/constants";
import { formatContentPlan } from "../lib/formatting/plan";

async function main() {
  const rawOutput = await generateDemoContentPlan(demoBrief);
  const plan = formatContentPlan({
    rawOutput,
    input: demoBrief,
    modeUsed: "demo",
    createdAt: "2026-03-06T14:30:00.000Z",
    id: "sample-demo-run",
  });

  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(
    path.join(process.cwd(), "data", "sample-demo-run.json"),
    JSON.stringify(plan, null, 2),
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
