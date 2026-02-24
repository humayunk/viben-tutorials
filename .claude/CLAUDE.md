# Viben Tutorials — Content Processing Pipeline

## What This Is

A local-only Next.js tool for browsing Airtable YouTube records, running them through Claude to generate structured tutorial card sequences, and saving the output as JSON files.

## Tech Stack

- Next.js 15 + TypeScript + Turbopack
- Tailwind CSS 4 + shadcn/ui (manual components)
- Anthropic SDK (Claude Sonnet for generation)
- SWR for client-side data fetching
- File-based storage (JSON in `/tutorials/`)

## Key Files

- `src/lib/airtable.ts` — Airtable REST client (native fetch)
- `src/lib/prompts.ts` — System prompt + user prompt builder (the critical piece)
- `src/lib/claude.ts` — Anthropic SDK wrapper
- `src/lib/youtube.ts` — Video ID extraction, embed URLs
- `src/lib/tutorials.ts` — File I/O for `/tutorials/`
- `tutorial-schema.json` — Reference schema for tutorial card format
- `airtable-schema.md` — Airtable field reference
- `openclaw-example.json` — Example tutorial output

## Env Vars

```
AIRTABLE_PAT=       # Airtable Personal Access Token
ANTHROPIC_API_KEY=   # Claude API key
```

## Conventions

- Dark theme (always-dark, no toggle)
- All Airtable calls are server-side only (API routes)
- Claude generation happens server-side via /api/generate
- Tutorial JSON files saved in /tutorials/ directory at project root
- YouTube transcripts are in `raw_content` field (not `video_transcript`)

## Security

- **NEVER run `npm install <package>` without user confirmation.**
- Don't read .env.local or credential files
- Don't run destructive commands

## Don't

- Don't add authentication — this is a single-user local tool
- Don't add deployment config
- Don't add a database — file-based storage only
- Don't modify the HTML prototypes (*.html files at root)
