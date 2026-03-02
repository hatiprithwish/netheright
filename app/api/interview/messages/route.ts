import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import InterviewDAL from "@/backend/data-access-layer/InterviewDAL";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/logger";

const getHandler = async (req: NextRequest, _: any, _logger: Logger) => {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const upToPhase = searchParams.get("upToPhase");
  const exactPhase = searchParams.get("exactPhase");

  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required" },
      { status: 400 },
    );
  }

  const messages = await InterviewDAL.getMessagesBySession(
    sessionId,
    upToPhase
      ? (parseInt(upToPhase) as Schemas.InterviewPhaseIntEnum)
      : undefined,
    exactPhase
      ? (parseInt(exactPhase) as Schemas.InterviewPhaseIntEnum)
      : undefined,
  );

  const uiMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    parts: [{ type: "text", text: msg.content }],
  }));

  return NextResponse.json({ messages: uiMessages });
};

export const GET = routeWrapper(checkAuth({}, getHandler));
