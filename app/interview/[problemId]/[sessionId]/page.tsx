import InterviewPage from "@/frontend/ui/interview";

type Props = {
  params: Promise<{ problemId: string; sessionId: string }>;
};

export default async function InterviewRoute({ params }: Props) {
  const { problemId, sessionId } = await params;

  return <InterviewPage problemId={Number(problemId)} sessionId={sessionId} />;
}
