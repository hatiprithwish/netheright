import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import RedisClient from "@/lib/redis";
import { envConfig } from "@/lib/envConfig";
import type { Logger } from "@/lib/pino";

const getHandler = async (req: NextRequest, _body: undefined, logger: Logger) => {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${envConfig.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await RedisClient.getClient();
  const pong = await client.ping();
  logger.info(`Redis keep-alive ping: ${pong}`);

  return NextResponse.json({ isSuccess: true, pong });
};

export const GET = routeWrapper(getHandler);
