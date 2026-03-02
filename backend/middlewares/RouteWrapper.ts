/**
 * Outermost route decorator.
 * Injects a request-scoped logger and catches unhandled exceptions.
 */

import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger, Logger } from "@/lib/logger";
import { randomUUID } from "crypto";

export type RouteHandler = (
  req: NextRequest,
  validatedBody: any,
  logger: Logger,
  ...args: any[]
) => Promise<NextResponse | Response> | NextResponse | Response;

export const routeWrapper = (handler: RouteHandler) => {
  return async (
    req: NextRequest,
    ...args: any[]
  ): Promise<NextResponse | Response> => {
    const requestId = randomUUID();
    const logger = createRequestLogger(requestId, req.url);

    logger.info(`[${req.method}] ${req.url}`);

    try {
      const response = await handler(req, undefined, logger, ...args);
      logger.info(
        `[${req.method}] ${req.url} → ${(response as Response).status}`,
      );
      return response;
    } catch (error) {
      logger.error(`Unhandled error: ${error}`);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
};
