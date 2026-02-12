import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { StartInterviewPage } from "@/frontend/ui/interview/components/StartInterviewPage";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return <StartInterviewPage />;
}
