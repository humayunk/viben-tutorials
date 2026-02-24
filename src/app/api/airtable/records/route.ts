import { NextRequest, NextResponse } from "next/server";
import { listYouTubeRecords } from "@/lib/airtable";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const offset = searchParams.get("offset") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const difficulty = searchParams.get("difficulty") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const pageSize = searchParams.get("pageSize")
    ? parseInt(searchParams.get("pageSize")!, 10)
    : 20;

  try {
    const data = await listYouTubeRecords({
      offset,
      pageSize,
      tag,
      difficulty,
      search,
    });
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
