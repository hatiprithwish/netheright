import { NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import MetadataRepo from "@/backend/repositories/MetadataRepo";

const handler = async () => {
  const roles = await MetadataRepo.getAllRoles();
  return NextResponse.json({ success: true, count: roles.length, data: roles });
};

// Allow any authenticated user to view accessible roles
export const GET = routeWrapper(checkAuth({}, handler));
