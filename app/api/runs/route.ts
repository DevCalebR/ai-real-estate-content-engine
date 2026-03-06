import { listRunSummaries } from "@/lib/storage/runs";

export async function GET() {
  const runs = await listRunSummaries();
  return Response.json(runs);
}
