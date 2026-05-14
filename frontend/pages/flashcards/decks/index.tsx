"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Plus, Trash2, Brain, BarChart3, Clock } from "lucide-react";
import * as Schemas from "@/schemas";
import { useGetDecks, useGetFlashcardStats } from "@/frontend/api/cachedQueries";
import { createDeck, deleteDeck } from "@/frontend/api/mutations";

export default function DecksPage() {
  const { data, isLoading, handleRefresh } = useGetDecks();
  const { data: statsData } = useGetFlashcardStats();

  const [showCreate, setShowCreate] = useState(false);
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = statsData?.stats;
  const decks = data?.decks ?? [];

  const handleCreate = async () => {
    if (!deckName.trim()) return;
    setCreating(true);
    try {
      await createDeck({
        name: deckName.trim(),
        description: deckDesc.trim() || undefined,
      });
      setDeckName("");
      setDeckDesc("");
      setShowCreate(false);
      handleRefresh();
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (deckId: string) => {
    setDeletingId(deckId);
    try {
      await deleteDeck(deckId);
      handleRefresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="w-8 h-8 text-primary" />
              Flashcards
            </h1>
            <p className="text-muted-foreground mt-1">
              Spaced repetition for faster, lasting learning
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Deck
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              {
                label: "Total Cards",
                value: stats.totalCards,
                icon: BookOpen,
                color: "blue",
              },
              {
                label: "Due Today",
                value: stats.dueToday,
                icon: Clock,
                color: "amber",
              },
              {
                label: "Reviewed Today",
                value: stats.reviewedToday,
                icon: BarChart3,
                color: "emerald",
              },
              {
                label: "All Time Reviews",
                value: stats.totalReviews,
                icon: Brain,
                color: "purple",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-card rounded-xl border border-border p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`rounded-full bg-${color}-50 dark:bg-${color}-900/20 p-1.5`}
                  >
                    <Icon
                      className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {label}
                  </span>
                </div>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Create Deck Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">Create New Deck</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Deck Name *
                  </label>
                  <input
                    autoFocus
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="e.g. JavaScript Concepts"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </label>
                  <input
                    value={deckDesc}
                    onChange={(e) => setDeckDesc(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    setShowCreate(false);
                    setDeckName("");
                    setDeckDesc("");
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !deckName.trim()}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {creating ? "Creating…" : "Create Deck"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Deck Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6 animate-pulse"
              >
                <div className="h-5 bg-muted rounded w-2/3 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : decks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Brain className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No decks yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first deck to start learning with spaced repetition
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Deck
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck: Schemas.Deck) => (
              <div
                key={deck.id}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {deck.name}
                    </h3>
                    {deck.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {deck.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(deck.id)}
                    disabled={deletingId === deck.id}
                    className="ml-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{deck.cardCount} cards</span>
                  {deck.dueCount > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {deck.dueCount} due
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/flashcards/decks/${deck.id}`}
                    className="flex-1 text-center px-3 py-1.5 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors"
                  >
                    Manage
                  </Link>
                  {deck.cardCount > 0 && (
                    <Link
                      href={`/flashcards/review/${deck.id}`}
                      className="flex-1 text-center px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      {deck.dueCount > 0
                        ? `Review (${deck.dueCount})`
                        : "Browse"}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
