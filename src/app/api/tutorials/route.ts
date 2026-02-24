import { NextRequest, NextResponse } from "next/server";
import { listTutorials, saveTutorial, findByAirtableRecord } from "@/lib/tutorials";
import type { Tutorial } from "@/types";

export async function GET(request: NextRequest) {
  const recordId = request.nextUrl.searchParams.get("recordId");

  try {
    // If recordId provided, find tutorial for that Airtable record
    if (recordId) {
      const tutorial = await findByAirtableRecord(recordId);
      return NextResponse.json({ tutorial });
    }

    const tutorials = await listTutorials();
    return NextResponse.json(tutorials);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tutorial: Tutorial = await request.json();

    if (!tutorial.id || !tutorial.title || !tutorial.cards?.length) {
      return NextResponse.json(
        { error: "Invalid tutorial: missing id, title, or cards" },
        { status: 400 }
      );
    }

    await saveTutorial(tutorial);
    return NextResponse.json({ ok: true, id: tutorial.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
