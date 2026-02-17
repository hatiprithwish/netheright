import { ProblemListPage } from "@/frontend/ui/problems/components/ProblemListPage";
import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";

const ProblemsPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return <ProblemListPage />;
};

export default ProblemsPage;
