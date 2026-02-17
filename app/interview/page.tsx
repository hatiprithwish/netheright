import { StartInterviewPage } from "@/frontend/ui/interview/components/StartInterviewPage";
import { auth } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import React from "react";

const InterviewStartPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return <StartInterviewPage />;
};

export default InterviewStartPage;
