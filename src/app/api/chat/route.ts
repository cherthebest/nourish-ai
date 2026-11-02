import { NextResponse } from "next/server";
import { answerWithRag, type ChatMessage } from "@/lib/rag/generate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      message?: string;
      history?: ChatMessage[];
    };
    const message = (body.message || "").trim();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }
    if (message.length > 4000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const result = await answerWithRag(message, body.history || []);
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Chat failed. Please try again." },
      { status: 500 },
    );
  }
}