import InterviewPage from "@/frontend/ui/interview";

type Props = {
  params: Promise<{ problemId: number }>;
};

export default async function index({ params }: Props) {
  const { problemId } = await params;

  return <InterviewPage problemId={Number(problemId)} />;
}
