import { NextRequest, NextResponse } from "next/server";
import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import * as Schemas from "@/schemas";
import { auth } from "@/lib/next-auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const upToPhase = searchParams.get("upToPhase");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 },
    );
  }

  try {
    const messages = await InterviewDAL.getMessagesBySession(
      sessionId,
      upToPhase
        ? (parseInt(upToPhase) as Schemas.InterviewPhaseIntEnum)
        : undefined,
    );

    // Convert to UIMessage format for frontend
    const uiMessages = messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: [{ type: "text", text: msg.content }],
    }));

    return NextResponse.json({ messages: uiMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
