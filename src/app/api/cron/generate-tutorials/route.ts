import { NextResponse } from "next/server";
import { listRecordsWithContent } from "@/lib/airtable";
import { buildUserPrompt, buildPromptFromArticleRecord } from "@/lib/prompts";
import { generateTutorial, generateTutorialFromArticle } from "@/lib/claude";
import { saveTutorial, findByAirtableRecord } from "@/lib/tutorials";

export const maxDuration = 300;

const ARTICLE_SOURCES = ["hackernews", "blog", "newsletter"];

function isArticleSource(source: string): boolean {
  return ARTICLE_SOURCES.includes(source.toLowerCase());
}

export async function GET() {
  const results: { id: string; title: string; source: string }[] = [];
  const errors: { recordId: string; error: string }[] = [];

  try {
    // Fetch recent records with content from Airtable
    const { records } = await listRecordsWithContent(10);

    for (const record of records) {
      try {
        // Skip if tutorial already exists for this record
        const existing = await findByAirtableRecord(record.id);
        if (existing) continue;

        const source = record.fields.source || "";
        let tutorial;

        if (isArticleSource(source)) {
          // Article source — use article prompt + generator
          const prompt = buildPromptFromArticleRecord(record);
          tutorial = await generateTutorialFromArticle(prompt);
        } else {
          // YouTube source — use existing prompt + generator
          const prompt = buildUserPrompt(record);
          tutorial = await generateTutorial(prompt);
        }

        await saveTutorial(tutorial);
        results.push({
          id: tutorial.id,
          title: tutorial.title,
          source,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Failed to generate tutorial for ${record.id}:`, msg);
        errors.push({ recordId: record.id, error: msg });
      }
    }

    return NextResponse.json({
      generated: results.length,
      tutorials: results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Cron error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
