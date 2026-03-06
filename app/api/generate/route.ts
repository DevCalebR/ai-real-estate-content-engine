import { ZodError } from "zod";

import { generateContentPlan } from "@/lib/ai";
import { saveContentPlan } from "@/lib/storage/runs";
import { generationInputSchema } from "@/lib/types/content";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = generationInputSchema.parse(payload);
    const plan = await generateContentPlan(input);
    await saveContentPlan(plan);

    return Response.json({
      id: plan.id,
      createdAt: plan.createdAt,
      modeUsed: plan.modeUsed,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: error.flatten().formErrors[0] || "The request body is invalid.",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The content plan could not be generated.",
      },
      { status: 500 },
    );
  }
}
