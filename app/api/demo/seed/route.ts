import { seedDemoWorkspace } from "@/lib/storage/demo-workspace";

export async function POST() {
  try {
    const plan = await seedDemoWorkspace();

    return Response.json({
      id: plan.id,
      createdAt: plan.createdAt,
      modeUsed: plan.modeUsed,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The sample workspace could not be created.",
      },
      { status: 500 },
    );
  }
}
