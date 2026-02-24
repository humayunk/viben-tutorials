import { NextRequest, NextResponse } from "next/server";
import { getRecord } from "@/lib/airtable";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  const { recordId } = await params;

  try {
    const record = await getRecord(recordId);
    return NextResponse.json(record);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
