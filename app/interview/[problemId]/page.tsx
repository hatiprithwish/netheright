// DONE_PRITH

import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/next-auth";
import InterviewPage from "@/frontend/pages/interview";
import * as Schemas from "@/schemas";

type Props = {
  params: Promise<{ problemId: number; sessionId?: string }>;
};

export default async function index({ params }: Props) {
  const { hasFeature } = await serverAuth();

  if (!hasFeature(Schemas.FeatureEnum.AttendInterview)) {
    redirect(Schemas.AppStaticRoute.Forbidden);
  }

  const { problemId, sessionId } = await params;

  return (
    <InterviewPage problemId={Number(problemId)} interviewId={sessionId} />
  );
}
