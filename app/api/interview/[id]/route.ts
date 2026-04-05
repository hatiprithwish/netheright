import { NextRequest, NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import { checkAuth } from "@/backend/middlewares/CheckAuth";
import { validateRequestSchema } from "@/backend/middlewares/ValidateRequestSchema";
import InterviewRepo from "@/backend/repositories/InterviewRepo";
import * as Schemas from "@/schemas";
import type { Logger } from "@/lib/pino";

type RouteContext = { params: Promise<{ id: string }> };

const getHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const response = await InterviewRepo.getInterview({ interviewId: id });
  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 404,
  });
};

const patchHandler = async (
  _req: NextRequest,
  validatedBody: Pick<Schemas.UpdateInterviewStatusApiRequest, "status">,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const response = await InterviewRepo.updateInterviewStatus({
    interviewId: id,
    status: validatedBody.status,
  });
  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 400,
  });
};

const deleteHandler = async (
  _req: NextRequest,
  _body: undefined,
  _logger: Logger,
  context: RouteContext,
) => {
  const { id } = await context.params;
  const response = await InterviewRepo.updateInterviewStatus({
    interviewId: id,
    status: Schemas.InterviewStatusIntEnum.Deleted,
  });

  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 400,
  });
};

export const GET = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["id"] }, getHandler)),
);
export const PATCH = routeWrapper(
  checkAuth(
    {},
    validateRequestSchema(
      {
        params: ["id"],
        body: Schemas.ZUpdateInterviewStatusApiRequest.pick({ status: true }),
      },
      patchHandler,
    ),
  ),
);
export const DELETE = routeWrapper(
  checkAuth({}, validateRequestSchema({ params: ["id"] }, deleteHandler)),
);
