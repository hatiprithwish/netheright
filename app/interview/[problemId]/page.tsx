import InterviewPage from "@/frontend/ui/interview";

type Props = {
  params: Promise<{ problemId: string }>;
};

export default async function index({ params }: Props) {
  const { problemId } = await params;

  return <InterviewPage problemId={problemId} />;
}
