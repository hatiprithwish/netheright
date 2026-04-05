import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/next-auth";
import FeedbackPage from "@/frontend/pages/feedback";
import * as Schemas from "@/schemas";

export default async function Page({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  const { hasFeature } = await serverAuth();

  if (!hasFeature(Schemas.FeatureEnum.ManageDashboard)) {
    redirect(Schemas.AppStaticRoute.Forbidden);
  }

  return <FeedbackPage interviewId={interviewId} />;
}
