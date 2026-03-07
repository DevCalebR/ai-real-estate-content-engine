import { promises as fs } from "node:fs";
import path from "node:path";

import { generateDemoContentPlan } from "../lib/ai/providers/demo";
import { demoBrief, sampleBriefs } from "../lib/constants";
import { formatContentPlan } from "../lib/formatting/plan";

async function writeJson(fileName: string, value: unknown) {
  await fs.writeFile(
    path.join(process.cwd(), "data", fileName),
    JSON.stringify(value, null, 2),
    "utf8",
  );
}

async function main() {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });

  await writeJson("sample-brief.json", demoBrief);
  await writeJson("sample-briefs.json", sampleBriefs);

  await Promise.all(
    Object.entries(sampleBriefs).map(([presetKey, brief]) =>
      writeJson(`sample-brief-${presetKey}.json`, brief),
    ),
  );

  const rawOutput = await generateDemoContentPlan(demoBrief);
  const plan = formatContentPlan({
    rawOutput,
    input: demoBrief,
    modeUsed: "demo",
    createdAt: "2026-03-06T14:30:00.000Z",
    id: "sample-demo-run",
  });

  await writeJson("sample-demo-run.json", plan);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
