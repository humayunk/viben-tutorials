import type { AirtableRecord, AirtableListResponse } from "@/types";

const BASE_ID = "appaqQIbI9RJJvXPm";
const TABLE_ID = "tblkhO6bbpOjGkHpF";
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

function getHeaders() {
  const pat = process.env.AIRTABLE_PAT;
  if (!pat) throw new Error("AIRTABLE_PAT not set");
  return {
    Authorization: `Bearer ${pat}`,
    "Content-Type": "application/json",
  };
}

// Fields we actually need — reduces payload size
const FIELDS = [
  "job_id",
  "source",
  "source_url",
  "author",
  "title",
  "profile_image_url",
  "thumbnail_image",
  "raw_content",
  "published_at",
  "ai_editor_summary",
  "ai_editor_tags",
  "ai_editor_title",
  "ai_editor_practical_steps",
  "difficulty_level",
  "video_duration_s",
  "view_count",
  "like_count",
];

// Lightweight fields for list view (no transcript/steps)
const LIST_FIELDS = [
  "job_id",
  "source",
  "source_url",
  "author",
  "title",
  "thumbnail_image",
  "ai_editor_summary",
  "ai_editor_tags",
  "ai_editor_title",
  "difficulty_level",
  "video_duration_s",
  "view_count",
  "published_at",
];

interface ListOptions {
  offset?: string;
  pageSize?: number;
  tag?: string;
  difficulty?: string;
  search?: string;
}

export async function listYouTubeRecords(
  options: ListOptions = {}
): Promise<AirtableListResponse> {
  const { offset, pageSize = 20, tag, difficulty, search } = options;

  const params = new URLSearchParams();
  params.set("pageSize", String(pageSize));

  // Always filter to YouTube source
  const filters: string[] = ['{source} = "YouTube"'];

  if (difficulty) {
    filters.push(`{difficulty_level} = "${difficulty}"`);
  }
  if (tag) {
    filters.push(`FIND("${tag}", ARRAYJOIN({ai_editor_tags}, ","))`);
  }
  if (search) {
    filters.push(
      `OR(FIND(LOWER("${search}"), LOWER({title})), FIND(LOWER("${search}"), LOWER({author})), FIND(LOWER("${search}"), LOWER({ai_editor_title})))`
    );
  }

  const formula =
    filters.length === 1
      ? filters[0]
      : `AND(${filters.join(", ")})`;
  params.set("filterByFormula", formula);

  // Sort by published_at descending
  params.set("sort[0][field]", "published_at");
  params.set("sort[0][direction]", "desc");

  // Only request list fields
  for (const field of LIST_FIELDS) {
    params.append("fields[]", field);
  }

  if (offset) {
    params.set("offset", offset);
  }

  const res = await fetch(`${API_URL}?${params}`, {
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function getRecord(
  recordId: string
): Promise<AirtableRecord> {
  const res = await fetch(`${API_URL}/${recordId}`, {
    headers: getHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable error ${res.status}: ${text}`);
  }

  return res.json();
}
