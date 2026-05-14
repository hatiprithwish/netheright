import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/next-auth";
import DeckDetailPage from "@/frontend/pages/flashcards/decks/DeckDetailPage";

export default async function Page({ params }: { params: Promise<{ deckId: string }> }) {
  const { currentUser } = await serverAuth();
  if (!currentUser) redirect("/");
  const { deckId } = await params;
  return <DeckDetailPage deckId={deckId} />;
}
