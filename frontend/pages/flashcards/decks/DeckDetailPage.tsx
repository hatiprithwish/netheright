"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Tag, FileText, Brain } from "lucide-react";
import * as Schemas from "@/schemas";
import {
  useGetDeck,
  useGetCards,
  createCard,
  bulkCreateCards,
  deleteCard,
} from "@/frontend/api/flashcardsQueries";

interface Props {
  deckId: string;
}

type CreateMode = "single" | "bulk";

function parseBulkText(text: string): Array<{ front: string; back: string }> {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("::"))
    .map((line) => {
      const idx = line.indexOf("::");
      return {
        front: line.slice(0, idx).trim(),
        back: line.slice(idx + 2).trim(),
      };
    })
    .filter((c) => c.front && c.back);
}

export default function DeckDetailPage({ deckId }: Props) {
  const {
    data: deckData,
    isLoading: deckLoading,
    handleRefresh: refreshDeck,
  } = useGetDeck(deckId);
  const {
    data: cardsData,
    isLoading: cardsLoading,
    handleRefresh: refreshCards,
  } = useGetCards(deckId);

  const [showCreate, setShowCreate] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>("single");

  // Single card form
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [tags, setTags] = useState("");

  // Bulk form
  const [bulkText, setBulkText] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deck = deckData?.deck;
  const cards = cardsData?.cards ?? [];
  const bulkParsed = parseBulkText(bulkText);

  const handleSingleCreate = async () => {
    if (!front.trim() || !back.trim()) return;
    setSaving(true);
    try {
      await createCard(deckId, {
        front: front.trim(),
        back: back.trim(),
        tags: tags.trim()
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      });
      setFront("");
      setBack("");
      setTags("");
      setShowCreate(false);
      refreshCards();
      refreshDeck();
    } finally {
      setSaving(false);
    }
  };

  const handleBulkCreate = async () => {
    if (!bulkParsed.length) return;
    setSaving(true);
    try {
      await bulkCreateCards(deckId, { cards: bulkParsed });
      setBulkText("");
      setShowCreate(false);
      refreshCards();
      refreshDeck();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cardId: string) => {
    setDeletingId(cardId);
    try {
      await deleteCard(deckId, cardId);
      refreshCards();
      refreshDeck();
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave =
    createMode === "single" ? handleSingleCreate : handleBulkCreate;
  const canSave =
    createMode === "single"
      ? !!(front.trim() && back.trim())
      : bulkParsed.length > 0;

  if (deckLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading deck…</div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Deck not found</p>
          <Link href="/flashcards" className="text-primary hover:underline">
            ← Back to decks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/flashcards"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Decks
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{deck.name}</h1>
              {deck.description && (
                <p className="text-muted-foreground mt-1">{deck.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{deck.cardCount} cards</span>
                {deck.dueCount > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {deck.dueCount} due for review
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {deck.cardCount > 0 && (
                <Link
                  href={`/flashcards/review/${deckId}`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Brain className="w-4 h-4" />
                  {deck.dueCount > 0
                    ? `Review (${deck.dueCount})`
                    : "Browse Cards"}
                </Link>
              )}
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Cards
              </button>
            </div>
          </div>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold">
                    Add Cards to {deck.name}
                  </h2>
                  {/* Mode Toggle */}
                  <div className="flex bg-muted rounded-lg p-1 text-sm">
                    <button
                      onClick={() => setCreateMode("single")}
                      className={`px-3 py-1 rounded-md font-medium transition-colors ${createMode === "single" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Single
                    </button>
                    <button
                      onClick={() => setCreateMode("bulk")}
                      className={`px-3 py-1 rounded-md font-medium transition-colors ${createMode === "bulk" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Bulk
                    </button>
                  </div>
                </div>

                {createMode === "single" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Front (Question) *
                      </label>
                      <textarea
                        autoFocus
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        placeholder="What is the question or concept?"
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Back (Answer) *
                      </label>
                      <textarea
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        placeholder="What is the answer or explanation?"
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> Tags (comma separated)
                      </label>
                      <input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g. arrays, algorithms, easy"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-muted-foreground">
                        One card per line:{" "}
                        <code className="bg-muted px-1 rounded text-xs">
                          front :: back
                        </code>
                      </label>
                    </div>
                    <textarea
                      autoFocus
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      placeholder={
                        "What is a closure? :: A function that retains access to its outer scope\nWhat is O(n)? :: Linear time complexity\nWhat is a Promise? :: An object representing eventual completion of an async op"
                      }
                      rows={10}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {bulkText && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {bulkParsed.length} valid card
                        {bulkParsed.length !== 1 ? "s" : ""} parsed
                        {bulkText.split("\n").filter(Boolean).length -
                          bulkParsed.length >
                          0 && (
                          <span className="text-amber-600 dark:text-amber-400 ml-2">
                            (
                            {bulkText.split("\n").filter(Boolean).length -
                              bulkParsed.length}{" "}
                            skipped — missing "::")
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCreate(false);
                      setFront("");
                      setBack("");
                      setTags("");
                      setBulkText("");
                    }}
                    className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !canSave}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {saving
                      ? "Saving…"
                      : createMode === "bulk"
                        ? `Add ${bulkParsed.length} Cards`
                        : "Add Card"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card List */}
        {cardsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-5 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No cards yet</h3>
            <p className="text-muted-foreground mb-5">
              Add cards manually or paste in bulk
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add First Card
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cards.map((card: Schemas.Card) => (
              <div
                key={card.id}
                className="group bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Front
                      </p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {card.front}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Back
                      </p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {card.back}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(card.id)}
                    disabled={deletingId === card.id}
                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {card.schedule && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Next review:{" "}
                    {new Date(card.schedule.nextDue).toLocaleDateString()} ·
                    interval {card.schedule.interval}d
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
