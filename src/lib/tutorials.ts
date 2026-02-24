import { promises as fs } from "fs";
import path from "path";
import type { Tutorial, TutorialListItem } from "@/types";

const TUTORIALS_DIR = path.join(process.cwd(), "tutorials");

async function ensureDir() {
  try {
    await fs.mkdir(TUTORIALS_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

function tutorialPath(id: string): string {
  // Sanitize ID to prevent path traversal
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(TUTORIALS_DIR, `${safe}.json`);
}

export async function saveTutorial(tutorial: Tutorial): Promise<void> {
  await ensureDir();
  const filePath = tutorialPath(tutorial.id);
  await fs.writeFile(filePath, JSON.stringify(tutorial, null, 2), "utf-8");
}

export async function getTutorial(id: string): Promise<Tutorial | null> {
  try {
    const filePath = tutorialPath(id);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function updateTutorial(
  id: string,
  tutorial: Tutorial
): Promise<void> {
  await ensureDir();
  const filePath = tutorialPath(id);
  // Verify file exists
  await fs.access(filePath);
  await fs.writeFile(filePath, JSON.stringify(tutorial, null, 2), "utf-8");
}

export async function listTutorials(): Promise<TutorialListItem[]> {
  await ensureDir();
  const files = await fs.readdir(TUTORIALS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const items: TutorialListItem[] = [];
  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(
        path.join(TUTORIALS_DIR, file),
        "utf-8"
      );
      const tutorial: Tutorial = JSON.parse(content);
      const stat = await fs.stat(path.join(TUTORIALS_DIR, file));
      items.push({
        id: tutorial.id,
        title: tutorial.title,
        tool: tutorial.tool,
        difficulty: tutorial.difficulty,
        cardCount: tutorial.cards.length,
        createdAt: stat.mtime.toISOString(),
      });
    } catch {
      // Skip invalid files
    }
  }

  // Sort newest first
  items.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return items;
}

export async function findByAirtableRecord(
  airtableRecordId: string
): Promise<Tutorial | null> {
  await ensureDir();
  const files = await fs.readdir(TUTORIALS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(
        path.join(TUTORIALS_DIR, file),
        "utf-8"
      );
      const tutorial: Tutorial = JSON.parse(content);
      if (tutorial.source?.airtableRecordId === airtableRecordId) {
        return tutorial;
      }
    } catch {
      // Skip invalid files
    }
  }
  return null;
}
