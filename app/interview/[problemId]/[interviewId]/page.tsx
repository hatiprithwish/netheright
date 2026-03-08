// DONE_PRITH

import InterviewPage from "@/frontend/ui/interview";

type Props = {
  params: Promise<{ problemId: string; interviewId: string }>;
};

export default async function InterviewRoute({ params }: Props) {
  const { problemId, interviewId } = await params;

  return (
    <InterviewPage problemId={Number(problemId)} interviewId={interviewId} />
  );
}
