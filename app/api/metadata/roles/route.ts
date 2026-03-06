import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import MetadataRepo from "@/backend/repositories/MetadataRepo";
import type { Logger } from "@/lib/pino";

const getHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
) => {
  const response = await MetadataRepo.getAllRoles();
  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 500,
  });
};

export const GET = routeWrapper(checkAuth({}, getHandler));
