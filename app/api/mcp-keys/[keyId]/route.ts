import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { auth } from "@/lib/next-auth";
import McpKeyDAL from "@/backend/data-access-layer/McpKeyDAL";
import type { Logger } from "@/lib/pino";

const deleteHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  { params }: { params: Promise<{ keyId: string }> },
) => {
  const session = await auth();
  const { keyId } = await params;
  const ok = await McpKeyDAL.revokeKey(keyId, session!.user.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
};

export const DELETE = routeWrapper(checkAuth({}, deleteHandler));
