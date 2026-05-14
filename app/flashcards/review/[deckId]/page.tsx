import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/next-auth";
import ReviewPage from "@/frontend/pages/flashcards/review/ReviewPage";

export default async function Page({ params }: { params: Promise<{ deckId: string }> }) {
  const { currentUser } = await serverAuth();
  if (!currentUser) redirect("/");
  const { deckId } = await params;
  return <ReviewPage deckId={deckId} />;
}
