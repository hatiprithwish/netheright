import { NextRequest, NextResponse } from "next/server";
import { Logger } from "@/lib/logger";
import { type RouteHandler } from "./RouteWrapper";

export interface RequestSchemaOptions {
  body?: any;
  params?: string[]; // Required route param keys
  query?: string[]; // Required query param keys
  cookies?: string[]; // Required cookie keys
  headers?: string[]; // Required header keys
}

const missingFieldsResponse = (type: string, missing: string[]) =>
  NextResponse.json(
    { error: `${type} validation failed`, details: { missing } },
    { status: 400 },
  );

export const validateRequestSchema = (
  schemas: RequestSchemaOptions,
  handler: RouteHandler,
) => {
  return async (
    req: NextRequest,
    _: any,
    logger: Logger,
    ...args: any[]
  ): Promise<NextResponse | Response> => {
    // Validate required headers
    if (schemas.headers?.length) {
      const missing = schemas.headers.filter(
        (h) => !req.headers.get(h.toLowerCase()),
      );
      if (missing.length) return missingFieldsResponse("Headers", missing);
    }

    // Validate required cookies
    if (schemas.cookies?.length) {
      const missing = schemas.cookies.filter((c) => !req.cookies.get(c));
      if (missing.length) return missingFieldsResponse("Cookies", missing);
    }

    // Validate required query params
    if (schemas.query?.length) {
      const searchParams = req.nextUrl.searchParams;
      const missing = schemas.query.filter(
        (q) => !searchParams.has(q) || searchParams.get(q) === "",
      );
      if (missing.length)
        return missingFieldsResponse("Query parameters", missing);
    }

    // Validate required route params (passed via Next.js context in args[0])
    if (schemas.params?.length) {
      const context = args[0] ?? {};
      const resolvedParams =
        context.params instanceof Promise
          ? await context.params
          : (context.params ?? {});

      const missing = schemas.params.filter(
        (p) => !resolvedParams[p] || resolvedParams[p] === "",
      );
      if (missing.length) return missingFieldsResponse("Route params", missing);
    }

    // Validate and parse request body with Zod
    let validatedBody: any = undefined;
    if (schemas.body) {
      let rawBody: unknown;
      try {
        rawBody = await req.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 },
        );
      }

      const result = schemas.body.safeParse(rawBody);
      if (!result.success) {
        logger.error(
          `[ValidateRequestSchema] Body validation failed: ${JSON.stringify(result.error.issues)}`,
        );
        return NextResponse.json(
          {
            error: "Request body validation failed",
            details: result.error.issues.map((i: any) => ({
              path: i.path.join("."),
              message: i.message,
            })),
          },
          { status: 400 },
        );
      }
      validatedBody = result.data;
    }

    return handler(req, validatedBody, logger, ...args);
  };
};
