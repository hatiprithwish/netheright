import { auth } from "@/lib/next-auth";

import Dashboard from "@/frontend/ui/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user || !session.user.id) return null;

  return (
    <Dashboard
      userId={session.user.id}
      userName={session.user.name || "User"}
      userEmail={session.user.email || ""}
      userImage={session.user.image}
    />
  );
}
