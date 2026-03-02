/**
 * Authentication and RBAC permission guard.
 * Must be wrapped inside routeWrapper so it receives a logger.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { type FeatureCheck } from "@/schemas";
import { Logger } from "@/lib/logger";
import UserRepo from "@/backend/repositories/UserRepo";
import { type RouteHandler } from "./RouteWrapper";

export const checkAuth = (params: FeatureCheck, handler: RouteHandler) => {
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

    // Compute bitmask from session features (CacheManager-backed, fast after first call)
    const userAccess = await UserRepo.calculateAccessBitmask(
      session.user.features ?? [],
    );

    // Single feature check
    if (params.feature) {
      const allowed = await params.feature.checkAccess(userAccess);
      if (!allowed) {
        logger.error(
          `[CheckAuth] Denied feature: ${params.feature.featureId}, userId: ${session.user.id}`,
        );
        return NextResponse.json(
          { error: "Access not allowed" },
          { status: 403 },
        );
      }
    }

    // OR logic — user needs at least one
    if (params.featuresOr && params.featuresOr.length > 0) {
      let anyAllowed = false;
      for (const feat of params.featuresOr) {
        if (await feat.checkAccess(userAccess)) {
          anyAllowed = true;
          break;
        }
      }
      if (!anyAllowed) {
        logger.error(
          `[CheckAuth] Denied featuresOr: [${params.featuresOr.map((f) => f.featureId).join(", ")}], userId: ${session.user.id}`,
        );
        return NextResponse.json(
          { error: "Access not allowed" },
          { status: 403 },
        );
      }
    }

    // AND logic — user needs all
    if (params.featuresAnd && params.featuresAnd.length > 0) {
      for (const feat of params.featuresAnd) {
        const allowed = await feat.checkAccess(userAccess);
        if (!allowed) {
          logger.error(
            `[CheckAuth] Denied featuresAnd: missing ${feat.featureId}, userId: ${session.user.id}`,
          );
          return NextResponse.json(
            { error: "Access not allowed" },
            { status: 403 },
          );
        }
      }
    }

    return handler(req, undefined, logger, ...args);
  };
};
