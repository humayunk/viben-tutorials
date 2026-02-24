import { NextRequest, NextResponse } from "next/server";
import { getRecord } from "@/lib/airtable";
import { buildUserPrompt } from "@/lib/prompts";
import { generateTutorial } from "@/lib/claude";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { recordId } = body;

  if (!recordId) {
    return NextResponse.json(
      { error: "recordId is required" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch from Airtable
    const record = await getRecord(recordId);

    // 2. Build prompt
    const userPrompt = buildUserPrompt(record);

    // 3. Generate via Claude
    const tutorial = await generateTutorial(userPrompt);

    return NextResponse.json(tutorial);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Generate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
