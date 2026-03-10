import { NextRequest, NextResponse } from "next/server";
import { buildPromptFromArticle } from "@/lib/prompts";
import { generateTutorialFromArticle } from "@/lib/claude";
import { saveTutorial, findBySourceUrl } from "@/lib/tutorials";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url } = body;

  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "url is required" },
      { status: 400 }
    );
  }

  try {
    // Dedup — check if we already have a tutorial for this URL
    const existing = await findBySourceUrl(url);
    if (existing) {
      return NextResponse.json(
        {
          error: "Tutorial already exists for this URL",
          tutorial: { id: existing.id, title: existing.title },
        },
        { status: 409 }
      );
    }

    // 1. Scrape article and build prompt
    const userPrompt = await buildPromptFromArticle(url);

    // 2. Generate tutorial via Claude
    const tutorial = await generateTutorialFromArticle(userPrompt);

    // Ensure source URL is set
    if (!tutorial.source) {
      tutorial.source = { sourceUrl: url };
    } else if (!tutorial.source.sourceUrl) {
      tutorial.source.sourceUrl = url;
    }

    // 3. Save
    await saveTutorial(tutorial);

    return NextResponse.json({
      tutorial: {
        id: tutorial.id,
        title: tutorial.title,
        url: `/tutorials/${tutorial.id}`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Generate from URL error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
