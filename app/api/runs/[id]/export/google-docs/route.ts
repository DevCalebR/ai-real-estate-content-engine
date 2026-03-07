import { exportContentPlanToGoogleDocs, getGoogleDocsIntegrationStatus } from "@/lib/integrations/google-docs";
import { getContentPlan } from "@/lib/storage/runs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const plan = await getContentPlan(id);

  if (!plan) {
    return Response.json({ error: "Run not found." }, { status: 404 });
  }

  const status = await getGoogleDocsIntegrationStatus();

  if (!status.configured) {
    return Response.json(
      {
        error: status.reason,
        status,
      },
      { status: 503 },
    );
  }

  try {
    const result = await exportContentPlanToGoogleDocs(plan);

    return Response.json({
      status,
      result,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Google Docs export failed.",
        status,
      },
      { status: 500 },
    );
  }
}
