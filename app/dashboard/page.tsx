import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import Dashboard from "@/frontend/ui/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <Dashboard
      userName={session.user.name || "User"}
      userEmail={session.user.email || ""}
      userImage={session.user.image}
    />
  );
}
