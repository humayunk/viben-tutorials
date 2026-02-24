import Anthropic from "@anthropic-ai/sdk";
import type { Tutorial } from "@/types";
import { SYSTEM_PROMPT } from "./prompts";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

export async function generateTutorial(
  userPrompt: string
): Promise<Tutorial> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text from response
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text in Claude response");
  }

  // Parse JSON — strip any markdown fences if present
  let jsonStr = textBlock.text.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
  }

  const tutorial: Tutorial = JSON.parse(jsonStr);

  // Basic validation
  if (!tutorial.id || !tutorial.title || !tutorial.cards?.length) {
    throw new Error(
      "Invalid tutorial: missing id, title, or cards"
    );
  }

  return tutorial;
}
