// DONE_PRITH

import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/next-auth";
import Dashboard from "@/frontend/dashboard";
import * as Schemas from "@/schemas";

export default async function DashboardPage() {
  const { currentUser, hasFeature } = await serverAuth();

  if (!currentUser || !hasFeature(Schemas.Feature.ManageDashboard)) {
    redirect(Schemas.AppStaticRoute.Forbidden);
  }

  return (
    <Dashboard
      userId={currentUser.id}
      userName={currentUser.name || "User"}
      userEmail={currentUser.email || ""}
      userImage={currentUser.image}
    />
  );
}
