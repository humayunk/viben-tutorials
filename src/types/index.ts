// Airtable record types
export interface AirtableRecord {
  id: string;
  fields: {
    job_id: string;
    source: string;
    source_url?: string;
    author?: string;
    title?: string;
    profile_image_url?: string;
    thumbnail_image?: string;
    raw_content?: string;
    published_at?: string;
    ai_editor_summary?: string;
    ai_editor_tags?: string[];
    ai_editor_title?: string;
    ai_editor_practical_steps?: string;
    difficulty_level?: string;
    video_duration_s?: number;
    view_count?: number;
    like_count?: number;
  };
}

export interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Tutorial schema types (matches tutorial-schema.json)
export interface Tutorial {
  id: string;
  title: string;
  description?: string;
  tool: string;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "expert";
  estimatedMinutes?: number;
  source: {
    airtableRecordId?: string;
    sourceUrl?: string;
    author?: string;
    authorImage?: string;
    thumbnailImage?: string;
    publishedAt?: string;
  };
  cards: Card[];
}

export type CardType =
  | "intro"
  | "concept"
  | "action"
  | "quiz"
  | "choice"
  | "milestone"
  | "celebration";

export interface Card {
  type: CardType;
  emoji?: string;
  title?: string;
  body?: string;
  body2?: string;
  cta?: string;
  modalities?: Modalities;
  // concept
  diagram?: { nodes: string[]; highlight?: number[]; caption?: string };
  analogy?: { icon: string; text: string };
  bullets?: string[];
  warn?: string;
  safe?: string;
  concept?: { label: string; title: string; desc: string };
  // action
  code?: string;
  codeLabel?: string;
  codeCaption?: string;
  link?: { url: string; text: string };
  helpItems?: { q: string; a: string }[];
  troubleshoot?: { label: string; error?: string; fix: string }[];
  // quiz
  question?: string;
  options?: { text: string; correct: boolean }[];
  correctFeedback?: string;
  wrongFeedback?: string;
  // choice
  choices?: { icon?: string; label: string; desc?: string; tag: string }[];
  store?: string;
  // celebration
  stats?: boolean;
}

export interface Modalities {
  read?: {
    body: string;
    codeBlocks?: { code: string; caption?: string }[];
    callouts?: { type: "warn" | "safe" | "tip" | "info"; text: string }[];
  };
  watch?: {
    videoUrl: string;
    thumbnailUrl?: string;
    startTime?: string;
    endTime?: string;
    source?: { author: string; authorInitial?: string; description?: string };
  };
  try?: {
    prompt: string;
    commands: { input: string; output: string; hint?: string }[];
  };
  ask?: {
    initialMessages: { role: "bot" | "user"; content: string }[];
    supportsImageUpload?: boolean;
  };
}

// API response types
export interface RecordsApiResponse {
  records: AirtableRecord[];
  offset?: string;
  total?: number;
}

export interface TutorialListItem {
  id: string;
  title: string;
  tool: string;
  difficulty: string;
  cardCount: number;
  createdAt: string;
}
