/**
 * Authentication and feature guard middleware.
 * Pass featureIds to enforce that the user holds all required features.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { Logger } from "@/lib/pino";
import { type RouteHandler } from "./RouteWrapper";

interface CheckAuthParams {
  featureIds?: string[];
}

export const checkAuth = (params: CheckAuthParams, handler: RouteHandler) => {
  return async (
    req: NextRequest,
    _: any,
    logger: Logger,
    ...args: any[]
  ): Promise<NextResponse | Response> => {
    const session = await auth();

    if (!session?.user) {
      logger.error(`[CheckAuth] Unauthenticated request to ${req.url}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (params.featureIds && params.featureIds.length > 0) {
      const userFeatures = session.user.features ?? [];
      const denied = params.featureIds.find((id) => !userFeatures.includes(id));
      if (denied) {
        logger.error(
          `[CheckAuth] Denied feature: ${denied}, userId: ${session.user.id}`,
        );
        return NextResponse.json(
          { error: "Access not allowed" },
          { status: 403 },
        );
      }
    }

    return handler(req, undefined, logger, ...args);
  };
};
