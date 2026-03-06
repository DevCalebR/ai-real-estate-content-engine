import { getContentPlan } from "@/lib/storage/runs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const plan = await getContentPlan(id);

  if (!plan) {
    return Response.json({ error: "Run not found." }, { status: 404 });
  }

  return Response.json(plan);
}
