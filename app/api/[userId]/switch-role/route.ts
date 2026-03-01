import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { db } from "@/backend/db";
import { users } from "@/backend/db/models";
import { eq } from "drizzle-orm";
import MetadataRepo from "@/backend/repositories/MetadataRepo";
import type { Logger } from "@/lib/logger";

type RouteContext = { params: Promise<{ userId: string }> };

const handler = async (
  req: NextRequest,
  _: any,
  _logger: Logger,
  { params }: RouteContext,
) => {
  const { userId } = await params;
  const body = await req.json();
  const requestedRoleId = body.roleId as string;

  // Validate role against DB (via cache) — no hardcoded role list
  const validRoles = await MetadataRepo.getAllRoles();
  const isValidRole = validRoles.some((r) => r.id === requestedRoleId);
  if (!isValidRole) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await db
    .update(users)
    .set({ roleId: requestedRoleId })
    .where(eq(users.id, userId));

  return NextResponse.json({ success: true, roleId: requestedRoleId });
};

export const POST = routeWrapper(checkAuth({}, handler));
