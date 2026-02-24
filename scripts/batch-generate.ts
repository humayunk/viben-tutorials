/**
 * Batch generate tutorials for the test batch.
 * Run with: npx tsx scripts/batch-generate.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const RECORD_IDS = [
  "rec3PHBSsRnuqLw3N", // claude-code beginner - Riley Brown
  "rec4flxum8yHVs99D", // claude-code beginner - Developers Digest
  "rec0TCJ4XotZKEC4A", // cursor intermediate - Bart Slodyczka
  "rec1D4JTN2OgV9VkZ", // cursor intermediate - IndyDevDan
  "rec4YVIzrKpxz7toM", // agents beginner - The AI Daily Brief
  "rec683cvIWEWiLEKx", // agents beginner - Tina Huang
  "rec13scRzbomkrPbL", // mcp intermediate - OpenAI
  "rec6TsHsXYjsYSb4G", // mcp intermediate - AI Coding Daily
  "rec0HH4rylCQjl2CE", // automation intermediate - Alex Finn
  "rec1OprCfuSPgkHIU", // automation intermediate - bri
  "recGPTtuDa2Ryhe5a", // n8n beginner - Nate Herk
  "recmJ8b400HKh2Oql", // n8n beginner - Nate Herk
  "rec0Mxuf3FN1GQq2Y", // prompting intermediate - Ras Mic
  "rec08cPAQzOKkWOss", // workflow expert - WorldofAI
  "rec1Yi068iZrqL8kn", // workflow expert - Every
];

const BASE_URL = "http://localhost:3001";

async function generate(recordId: string, index: number) {
  console.log(`\n[${index + 1}/${RECORD_IDS.length}] Generating for ${recordId}...`);

  try {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordId }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(`  FAIL: ${data.error}`);
      return { recordId, status: "error", error: data.error };
    }

    // Save it
    const saveRes = await fetch(`${BASE_URL}/api/tutorials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!saveRes.ok) {
      console.log(`  Generated but SAVE FAILED`);
      return { recordId, status: "save_error", tutorial: data };
    }

    console.log(`  OK: "${data.title}" (${data.cards.length} cards)`);
    return { recordId, status: "ok", id: data.id, title: data.title, cards: data.cards.length };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.log(`  ERROR: ${msg}`);
    return { recordId, status: "error", error: msg };
  }
}

async function main() {
  console.log(`Batch generating ${RECORD_IDS.length} tutorials...\n`);
  console.log(`Using API at ${BASE_URL}`);

  const results = [];

  for (const [i, recordId] of RECORD_IDS.entries()) {
    const result = await generate(recordId, i);
    results.push(result);

    // Small delay to be nice to rate limits
    if (i < RECORD_IDS.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\n\n=== SUMMARY ===");
  const ok = results.filter((r) => r.status === "ok");
  const failed = results.filter((r) => r.status !== "ok");

  console.log(`Success: ${ok.length}/${results.length}`);
  if (ok.length > 0) {
    console.log("\nGenerated tutorials:");
    for (const r of ok) {
      console.log(`  - ${r.title} (${r.cards} cards)`);
    }
  }
  if (failed.length > 0) {
    console.log("\nFailed:");
    for (const r of failed) {
      console.log(`  - ${r.recordId}: ${r.error}`);
    }
  }
}

main();
