import InterviewPage from "@/frontend/interview";

type Props = {
  params: Promise<{ problemId: number; sessionId?: string }>;
};

export default async function index({ params }: Props) {
  const { problemId, sessionId } = await params;

  return (
    <InterviewPage problemId={Number(problemId)} interviewId={sessionId} />
  );
}
