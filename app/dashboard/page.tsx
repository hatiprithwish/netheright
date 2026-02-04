import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/frontend/ui/dashboard/components/DashboardContent";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <DashboardContent
      userName={session.user.name || "User"}
      userEmail={session.user.email || ""}
      userImage={session.user.image || undefined}
    />
  );
}
