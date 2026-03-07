import { buildHtmlReport } from "@/lib/export/html";
import { buildMarkdownReport } from "@/lib/export/markdown";
import { getContentPlan } from "@/lib/storage/runs";
import { buildDownloadBaseName } from "@/lib/utils";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const plan = await getContentPlan(id);

  if (!plan) {
    return Response.json({ error: "Run not found." }, { status: 404 });
  }

  const format = new URL(request.url).searchParams.get("format") ?? "markdown";
  const baseName = buildDownloadBaseName(plan.input.businessName, plan.createdAt);

  if (format === "json") {
    return new Response(JSON.stringify(plan, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${baseName}.json"`,
      },
    });
  }

  if (format === "html") {
    return new Response(buildHtmlReport(plan), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="${baseName}.html"`,
      },
    });
  }

  return new Response(buildMarkdownReport(plan), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${baseName}.md"`,
    },
  });
}
