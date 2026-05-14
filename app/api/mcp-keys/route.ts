import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import { auth } from "@/lib/next-auth";
import { z } from "zod";
import McpKeyDAL from "@/backend/data-access-layer/McpKeyDAL";
import type { Logger } from "@/lib/pino";

const ZCreateKeyRequest = z.object({ name: z.string().min(1).max(100) });
type CreateKeyRequest = z.infer<typeof ZCreateKeyRequest>;

const getHandler = async (_req: NextRequest, _body: undefined, _logger: Logger) => {
  const session = await auth();
  const keys = await McpKeyDAL.listKeys(session!.user.id);
  return NextResponse.json({ keys });
};

const postHandler = async (_req: NextRequest, body: CreateKeyRequest, _logger: Logger) => {
  const session = await auth();
  const result = await McpKeyDAL.createKey(session!.user.id, body.name);
  // raw key only returned once
  return NextResponse.json(result, { status: 201 });
};

export const GET = routeWrapper(checkAuth({}, getHandler));
export const POST = routeWrapper(
  checkAuth({}, validateRequestSchema({ body: ZCreateKeyRequest }, postHandler)),
);
