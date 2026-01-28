import { NextRequest, NextResponse } from "next/server";
import { ZodTypeAny } from "zod";
import { auth } from "@/lib/next-auth";

interface ValidationError {
  statusCode: number;
  details: {
    type: string;
    errors?: any[];
    missing?: string[];
  };
}

interface SchemaValidationOptions {
  body?: ZodTypeAny;
  params?: string[]; // Required param keys
  query?: string[]; // Required query keys
  cookies?: string[]; // Required cookie keys
  headers?: string[]; // Required header keys
  requiresAuth?: boolean; // Check if user is authenticated
}

/**
 * Create a validation error with structured details
 */
const createValidationErrorResponse = (
  type: string,
  errors?: any[],
  missing?: string[],
): NextResponse => {
  const details: ValidationError["details"] = { type };
  if (errors) details.errors = errors;
  if (missing) details.missing = missing;

  return NextResponse.json(
    {
      error: `${type} validation failed`,
      details,
    },
    { status: 400 },
  );
};

type RouteHandler = (
  req: NextRequest,
  data: any,
  ...args: any[]
) => Promise<NextResponse | Response> | NextResponse | Response;

/**
 * Middleware wrapper to validate request schema using Zod
 * @param schemas - Object containing Zod schemas for body, and arrays for required params, query, cookies, headers
 * @param handler - The route handler to wrap
 * @returns Wrapped route handler
 */
export const validateRequest = (
  schemas: SchemaValidationOptions,
  handler: (
    req: NextRequest,
    data: any,
    ...args: any[]
  ) => Promise<NextResponse | Response> | NextResponse | Response,
) => {
  return async (
    req: NextRequest,
    ...args: any[]
  ): Promise<NextResponse | Response> => {
    try {
      let validatedBody: any = undefined;

      // Validate Authentication
      if (schemas.requiresAuth) {
        const session = await auth();
        if (!session?.user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
      }

      // Validate required headers
      if (schemas.headers && schemas.headers.length > 0) {
        const missingHeaders: string[] = [];
        for (const headerName of schemas.headers) {
          const value = req.headers.get(headerName.toLowerCase());
          if (!value) {
            missingHeaders.push(headerName);
          }
        }
        if (missingHeaders.length > 0) {
          return createValidationErrorResponse(
            "Request headers",
            undefined,
            missingHeaders,
          );
        }
      }

      // Validate required cookies
      if (schemas.cookies && schemas.cookies.length > 0) {
        const missingCookies: string[] = [];
        for (const cookieName of schemas.cookies) {
          const cookie = req.cookies.get(cookieName);
          if (!cookie) {
            missingCookies.push(cookieName);
          }
        }
        if (missingCookies.length > 0) {
          return createValidationErrorResponse(
            "Cookies",
            undefined,
            missingCookies,
          );
        }
      }

      // Validate required query params
      if (schemas.query && schemas.query.length > 0) {
        const searchParams = req.nextUrl.searchParams;
        const missingQuery: string[] = [];
        for (const queryName of schemas.query) {
          if (
            !searchParams.has(queryName) ||
            searchParams.get(queryName) === ""
          ) {
            missingQuery.push(queryName);
          }
        }
        if (missingQuery.length > 0) {
          return createValidationErrorResponse(
            "Query parameters",
            undefined,
            missingQuery,
          );
        }
      }

      // Validate required route params
      // Route params are usually passed as the second argument (context) to the handler in Next.js App Router
      // context: { params: { [key: string]: string | string[] } }
      if (schemas.params && schemas.params.length > 0) {
        const context = args[0] || {};
        const params = await context.params; // await params in Next.js 15+ (context.params is a promise in newer versions, but usually object in 14)
        // In Next.js 15 params IS a promise. In 14 it is not.
        // To be safe/compatible, check if it's a promise or object.
        // But type safety might be tricky. Let's assume standard object for now or await it.

        const resolvedParams = params
          ? params instanceof Promise
            ? await params
            : params
          : {};

        const missingParams: string[] = [];
        for (const paramName of schemas.params) {
          if (
            !resolvedParams ||
            typeof resolvedParams[paramName] === "undefined" ||
            resolvedParams[paramName] === ""
          ) {
            missingParams.push(paramName);
          }
        }

        if (missingParams.length > 0) {
          return createValidationErrorResponse(
            "Request params",
            undefined,
            missingParams,
          );
        }
      }

      // Validate body with Zod schema
      if (schemas.body) {
        try {
          // Clone the request to read body, but actually in Next.js once read it's consumed.
          // We must read it here and pass it to the handler.
          // If we read it here, req.json() will throw if called again in handler.
          // So we pass the validated data to the handler.
          const body = await req.json();
          const bodyValidation = schemas.body.safeParse(body);

          if (!bodyValidation.success) {
            return createValidationErrorResponse(
              "Request body",
              bodyValidation.error.issues.map((err) => ({
                path: err.path.join("."),
                message: err.message,
                code: err.code,
              })),
            );
          }
          validatedBody = bodyValidation.data;
        } catch (e) {
          return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
          );
        }
      }

      // Call the original handler with validated body as second arg (or merged into args?)
      // Standard Next.js handler signature: (req: Request, context: { params })
      // We will change the signature expected by the wrapper to: (req: Request, data: { body: T }, context: ...)

      // Actually, easiest is to attach it to the request? No, Request is immutable-ish.
      // We'll pass it as the second argument.
      // But wait, the standard export must be (req, context).
      // So the wrapped function returns (req, context).
      // The inner handler will receive (req, context, validatedBody).

      // Let's adopt a style where we pass `validatedBody` as an extra argument.

      return handler(req, validatedBody, ...args);
    } catch (error) {
      console.error("Validation Middleware Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error during validation" },
        { status: 500 },
      );
    }
  };
};
