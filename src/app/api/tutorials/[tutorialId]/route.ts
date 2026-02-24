import { NextRequest, NextResponse } from "next/server";
import { getTutorial, updateTutorial } from "@/lib/tutorials";
import type { Tutorial } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ tutorialId: string }> }
) {
  const { tutorialId } = await params;

  try {
    const tutorial = await getTutorial(tutorialId);
    if (!tutorial) {
      return NextResponse.json(
        { error: "Tutorial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(tutorial);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tutorialId: string }> }
) {
  const { tutorialId } = await params;

  try {
    const tutorial: Tutorial = await request.json();

    if (!tutorial.id || !tutorial.title || !tutorial.cards?.length) {
      return NextResponse.json(
        { error: "Invalid tutorial: missing id, title, or cards" },
        { status: 400 }
      );
    }

    await updateTutorial(tutorialId, tutorial);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("ENOENT") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
