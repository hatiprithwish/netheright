import { NextResponse } from "next/server";
import { routeWrapper } from "@/backend/middlewares/RouteWrapper";
import ProblemsRepo from "@/backend/repositories/ProblemsRepo";

const getHandler = async () => {
  const response = await ProblemsRepo.getProblems();
  return NextResponse.json(response, {
    status: response.isSuccess ? 200 : 500,
  });
};

export const GET = routeWrapper(getHandler);
