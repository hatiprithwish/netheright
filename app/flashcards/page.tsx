import { redirect } from "next/navigation";
import { serverAuth } from "@/lib/next-auth";
import DecksPage from "@/frontend/pages/flashcards/decks";

export default async function Page() {
  const { currentUser } = await serverAuth();
  if (!currentUser) redirect("/auth");
  return <DecksPage />;
}
