import InterviewPage from "@/frontend/pages/interview";

type Props = {
  params: Promise<{ problemId: string; interviewId: string }>;
};

export default async function InterviewRoute({ params }: Props) {
  const { problemId, interviewId } = await params;

  return (
    <InterviewPage problemId={Number(problemId)} interviewId={interviewId} />
  );
}
