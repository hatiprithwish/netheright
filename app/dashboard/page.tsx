import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/next-auth";
import DashboardPage from "@/frontend/pages/dashboard";
import * as Schemas from "@/schemas";

export default async function Page() {
  const { hasFeature } = await serverAuth();

  if (!hasFeature(Schemas.FeatureEnum.ManageDashboard)) {
    redirect(Schemas.AppStaticRoute.Forbidden);
  }

  return <DashboardPage />;
}
