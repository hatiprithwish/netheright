import { NextRequest, NextResponse } from "next/server";
import McpKeyDAL from "@/backend/data-access-layer/McpKeyDAL";
import { Logger } from "@/lib/pino";
import { type RouteHandler } from "./RouteWrapper";

export type McpRouteHandler = (
  req: NextRequest,
  body: any,
  logger: Logger,
  context: any,
  userId: string,
) => Promise<NextResponse | Response>;

export const checkMcpAuth = (handler: McpRouteHandler) => {
  return async (
    req: NextRequest,
    body: any,
    logger: Logger,
    ...args: any[]
  ): Promise<NextResponse | Response> => {
    const authHeader = req.headers.get("authorization");
    const rawKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!rawKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await McpKeyDAL.verifyKey(rawKey);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(req, body, logger, args[0], userId);
  };
};
