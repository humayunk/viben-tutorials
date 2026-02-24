# Viben Airtable Schema Reference

## Base: Vibin AI Editor (`appaqQIbI9RJJvXPm`)

The primary content database for the tutorial pipeline. 3 tables.

---

## Table 1: Signal Ingestion + AI Editorial (`tblkhO6bbpOjGkHpF`)

**Total records:** 15,392

### Source Distribution

| Source | Count | % |
|--------|------:|--:|
| X (Twitter) | 9,116 | 59% |
| Reddit | 3,680 | 23% |
| YouTube | 1,017 | 6% |
| LinkedIn | 868 | 5% |
| Hacker News | 402 | 2% |
| Twitter blog posts | 136 | <1% |
| Spotify | 84 | <1% |
| Blog posts | 53 | <1% |
| Newsletter | 20 | <1% |
| Blog | 16 | <1% |

### Fields (34 total)

| Field | Type | Notes |
|-------|------|-------|
| `job_id` | singleLineText | Primary field, UUID |
| `source` | singleSelect | YouTube, reddit, X, LinkedIn, hacker-news, blog-posts, Spotify, Newsletter, blog |
| `source_url` | url | Original content URL (YouTube watch link, Reddit post, tweet, etc.) |
| `author` | singleLineText | Creator name |
| `title` | singleLineText | Original content title |
| `profile_image_url` | url | Author avatar |
| `thumbnail_image` | singleLineText | Content thumbnail (YouTube maxresdefault, etc.) |
| `raw_content` | multilineText | **Full content/transcript text.** For YouTube = video transcript. 99% coverage on YouTube records. |
| `ingested_at` | dateTime | When record was added |
| `published_at` | dateTime | Original publish date |
| `ai_editor_decision` | singleSelect | Selected / Rejected |
| `thread_post_ids` | singleLineText | For Twitter threads |
| `video_url` | url | Separate video URL (rarely populated for YouTube — use `source_url` instead) |
| `media_type` | singleSelect | photo, video, animated_gif, image, document, article, text, linkedinVideo, link, poll |
| `conversation_id` | singleLineText | Twitter conversation ID |
| `is_thread` | checkbox | Twitter thread flag |
| `is_company` | checkbox | Company account flag |
| `ai_editor_summary` | richText | AI-generated summary (57% coverage overall) |
| `ai_editor_tags` | multipleSelects | AI-assigned topic tags (57% coverage) |
| `ai_editor_title` | singleLineText | AI-rewritten headline |
| `difficulty_level` | singleSelect | beginner, intermediate, expert |
| `score` | number | Engagement/quality score |
| `comment_count` | number | |
| `subreddit` | singleLineText | Reddit subreddit |
| `video_duration_s` | number | Video duration in seconds |
| `notes` | multilineText | Internal notes |
| `media_frame_analysis` | multilineText | AI analysis of visual frames |
| `video_transcript` | multilineText | **Empty on all YouTube records** — transcript is in `raw_content` instead |
| `has_audio` | checkbox | |
| `view_count` | number | |
| `like_count` | number | |
| `retweet_count` | number | |
| `ai_editor_article` | multilineText | AI-generated article from content |
| `ai_editor_practical_steps` | multilineText | AI-generated step-by-step guide (97% coverage on YouTube) |

### YouTube Records (1,017 total)

**Field coverage:**
- `raw_content` (transcript): 99%
- `ai_editor_practical_steps`: 97%
- `ai_editor_summary`: ~95%+
- `ai_editor_tags`: ~95%+
- `video_transcript`: 0% (use `raw_content` instead)

**Difficulty distribution:**
- Intermediate: 523 (51%)
- Beginner: 259 (25%)
- Expert: 216 (21%)
- None: 19 (2%)

**Top tags (YouTube):**
agents (319), claude (278), workflow (242), prompting (229), claude-code (168), cursor (114), gemini (107), automation (102), mcp (94), chatgpt (76), openclaw (70), openai (56), tutorial (49), shipping (34), no-code (30), anthropic (29), telegram (29), bolt (29), security (28), n8n (25)

**Top creators (YouTube):**
Alex Finn (33), Matt Wolfe (32), AI LABS (32), Cole Medin (29), The AI Advantage (28), Bolt.new (28), The AI Daily Brief (28), AICodeKing (26), Riley Brown (25), AI Jason (23), Better Stack (22), Income stream surfers (21), WorldofAI (20), DesignCode (18), AI Revolution (18)

---

## Table 2: Creator Identity (`tblg8NwOu4FGdJKhK`)

**Total records:** 2,417

Cross-platform creator profiles linking YouTube, X, LinkedIn, and other identities.

| Field | Type |
|-------|------|
| `canonical_name` | singleLineText |
| `youtube_author` | singleLineText |
| `x_author` | singleLineText |
| `x_handle` | singleLineText |
| `linkedin_author` | singleLineText |
| `newsletter_author` | singleLineText |
| `spotify_author` | singleLineText |
| `profile_image_override` | url |
| `bio` | multilineText |
| `is_active` | checkbox |
| `youtube_channel_url` | url |
| `x_profile_url` | url |
| `linkedin_profile_url` | url |
| `website_url` | url |
| `x_bio` | singleLineText |
| `x_followers` | number |
| `youtube_subscribers` | number |
| `metrics_updated_at` | singleLineText |

---

## Table 3: GitHub Repos (`tblJmHrwAyvj0dUCB`)

**Total records:** 138

Trending GitHub repositories tracked for content curation.

| Field | Type |
|-------|------|
| `job_id` | singleLineText |
| `source` | singleLineText |
| `author` | singleLineText |
| `profile_image_url` | url |
| `thumbnail_image` | url |
| `source_url` | url |
| `ingested_at` | dateTime |
| `ai_editor_title` | singleLineText |
| `ai_editor_summary` | multilineText |
| `github_language` | singleLineText |
| `github_stars_total` | number |
| `github_stars_today` | number |
| `github_forks` | number |
| `github_trending_rank` | number |
| `ai_editor_selected` | checkbox |
| `ai_editor_tags` | multipleSelects |

---

## Other Bases (accessible but less relevant)

| Base | ID | Notes |
|------|----|-------|
| Pivot Build | `app36zubzgaNMOdfa` | Build/project tracking |
| Pivot Media Master | `appwSozYTkrsQWUXB` | Newsletter articles (33 fields), newsletter stories/issues. Separate from Viben content. |
| How To Live | `appldSp5A67Ji04v9` | Separate project |
| Pivot 5 AI Editor 2.0 | `appglKSJZxmA9iHpl` | Older editor version |
| P5 Social Posts | `appRUgK44hQnXH1PM` | Social media posts |
| Brunch Club | `appq99sqGUz46Ol9y` | Restaurant directory project |
| Postscriptor | `appSs0mXKH0d9LOyO` | |
| Signal AI Editor | `appWGkUBuyrzmFnFM` | Possibly older version of Vibin AI Editor |
| Pulse AI Editor | `app8Bb2saISTEg5uu` | Pulse project (Tom's) |
| P5 | `appRXkjvqEavU8Znj` | Read-only access |
| HTL | `appzHQMYaDFPePpTT` | Read-only |

---

## Pipeline Implications

### Best tutorial sources (priority order)
1. **YouTube records** (1,017) — richest data: transcript in `raw_content`, AI summary, practical steps, tags, difficulty level, creator info
2. **Reddit posts** (3,680) — good for Q&A-style tutorials, troubleshooting content
3. **Blog posts** (53 + 136 twitter blog posts) — structured written content

### Key fields for tutorial generation
- `source_url` — embed/link to original content
- `raw_content` — full transcript/text (the input for AI processing)
- `ai_editor_summary` — pre-generated summary (can use as-is or regenerate)
- `ai_editor_practical_steps` — pre-generated steps (huge head start)
- `ai_editor_tags` — topic classification for routing to skill paths
- `difficulty_level` — maps to tutorial difficulty
- `author` + Creator Identity table — attribution and creator profiles
- `thumbnail_image` — visual assets

### Data quality notes
- YouTube `video_transcript` field is always empty — use `raw_content` instead
- `video_url` is rarely populated for YouTube — use `source_url`
- `score` field is mostly empty
- ~43% of all records lack AI summaries/tags (likely newer or lower-priority ingestions)
- Difficulty level missing on 6,539 records (42%) — would need inference for those

### API access
- **Base ID:** `appaqQIbI9RJJvXPm`
- **Table ID:** `tblkhO6bbpOjGkHpF` (Signal Ingestion + AI Editorial)
- **Permission level:** create (full read/write)
- **Rate limits:** 5 requests/second per base (Airtable standard)
