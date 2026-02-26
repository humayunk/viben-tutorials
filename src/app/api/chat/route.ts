import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
    client = new Anthropic({ apiKey });
  }
  return client;
}

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  cardContext: {
    type: string;
    title?: string;
    body?: string;
    tutorialTitle: string;
  };
}

export async function POST(request: Request) {
  try {
    const { messages, cardContext } = (await request.json()) as ChatRequest;

    if (!messages?.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const anthropic = getClient();

    const systemPrompt = `You are a friendly, concise tutor helping a learner work through a tutorial called "${cardContext.tutorialTitle}".

They are currently on a ${cardContext.type} card${cardContext.title ? ` titled "${cardContext.title}"` : ""}.
${cardContext.body ? `\nCard content:\n${cardContext.body}` : ""}

Rules:
- Keep answers short (2-4 sentences unless they ask for detail)
- Use simple language, avoid jargon unless the card already introduces it
- If they seem confused, try a different analogy or break it down further
- You can use markdown for code blocks or emphasis
- Stay focused on the current topic — gently redirect off-topic questions`;

    // Convert our message format to Anthropic's
    const anthropicMessages = messages.map((msg) => ({
      role: (msg.role === "bot" ? "assistant" : "user") as "assistant" | "user",
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text in response");
    }

    return NextResponse.json({ content: textBlock.text });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
