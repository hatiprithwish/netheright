"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Brain } from "lucide-react";
import * as Schemas from "@/schemas";
import {
  useGetDueCards,
  useGetDeck,
  submitReview,
} from "@/frontend/api/flashcardsQueries";

interface Props {
  deckId: string;
}

type EvalState = "idle" | "evaluating" | "done";
type EvalResult = "correct" | "partial" | "wrong";

interface ReviewState {
  cardIndex: number;
  answer: string;
  showAnswer: boolean;
  evalState: EvalState;
  evalResult: EvalResult | null;
  evalFeedback: string;
  autoQuality: number | null;
  submitting: boolean;
}

const QUALITY_MAP: Record<EvalResult, number> = {
  correct: 5,
  partial: 3,
  wrong: 1,
};

const RATING_LABELS = [
  {
    label: "Again",
    quality: 0,
    className:
      "border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400",
  },
  {
    label: "Hard",
    quality: 3,
    className:
      "border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  },
  {
    label: "Good",
    quality: 4,
    className:
      "border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
  },
  {
    label: "Easy",
    quality: 5,
    className:
      "border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  },
];

function evaluateAnswer(
  question: string,
  expectedAnswer: string,
  userAnswer: string,
): { result: EvalResult; feedback: string; quality: number } {
  const user = userAnswer.toLowerCase().trim();
  const expected = expectedAnswer.toLowerCase();

  if (!user)
    return { result: "wrong", feedback: "No answer provided.", quality: 0 };

  // Extract key terms from expected answer (words > 3 chars)
  const keyTerms = expected.match(/\b\w{4,}\b/g) ?? [];
  const matchedTerms = keyTerms.filter((term) => user.includes(term));
  const matchRatio =
    keyTerms.length > 0 ? matchedTerms.length / keyTerms.length : 0;

  if (matchRatio >= 0.7 || user === expected) {
    return {
      result: "correct",
      feedback: "Your answer covers the key concepts well.",
      quality: user === expected ? 5 : 4,
    };
  } else if (matchRatio >= 0.3) {
    const missing = keyTerms.filter((t) => !user.includes(t)).slice(0, 3);
    return {
      result: "partial",
      feedback: `Partially correct. Missing key concepts: ${missing.join(", ")}.`,
      quality: 3,
    };
  } else {
    return {
      result: "wrong",
      feedback: `The expected answer covers: ${keyTerms.slice(0, 4).join(", ")}.`,
      quality: 1,
    };
  }
}

const resultStyles: Record<
  EvalResult,
  { border: string; bg: string; text: string; label: string }
> = {
  correct: {
    border: "border-emerald-400 dark:border-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Correct",
  },
  partial: {
    border: "border-amber-400 dark:border-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    label: "Partial",
  },
  wrong: {
    border: "border-red-400 dark:border-red-600",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-400",
    label: "Try Again",
  },
};

export default function ReviewPage({ deckId }: Props) {
  const { data: deckData } = useGetDeck(deckId);
  const { data, isLoading, handleRefresh } = useGetDueCards(deckId);

  const [state, setState] = useState<ReviewState>({
    cardIndex: 0,
    answer: "",
    showAnswer: false,
    evalState: "idle",
    evalResult: null,
    evalFeedback: "",
    autoQuality: null,
    submitting: false,
  });
  const [reviewedCount, setReviewedCount] = useState(0);
  const [done, setDone] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const cards = data?.cards ?? [];
  const totalDue = data?.totalDue ?? 0;
  const currentCard = cards[state.cardIndex] ?? null;
  const deck = deckData?.deck;

  useEffect(() => {
    if (state.evalState === "idle" && !state.showAnswer) {
      textareaRef.current?.focus();
    }
  }, [state.cardIndex, state.evalState, state.showAnswer]);

  const handleSubmitAnswer = async () => {
    if (!state.answer.trim() || !currentCard) return;

    setState((s) => ({ ...s, evalState: "evaluating" }));

    // Simulate slight evaluation delay for UX
    await new Promise((r) => setTimeout(r, 800));

    const evaluation = evaluateAnswer(
      currentCard.front,
      currentCard.back,
      state.answer,
    );

    setState((s) => ({
      ...s,
      evalState: "done",
      showAnswer: true,
      evalResult: evaluation.result,
      evalFeedback: evaluation.feedback,
      autoQuality: evaluation.quality,
    }));
  };

  const handleRate = async (quality: number) => {
    if (!currentCard || state.submitting) return;

    setState((s) => ({ ...s, submitting: true }));
    try {
      await submitReview(currentCard.id, { quality });
      setReviewedCount((c) => c + 1);

      const nextIndex = state.cardIndex + 1;
      if (nextIndex >= cards.length) {
        setDone(true);
      } else {
        setState({
          cardIndex: nextIndex,
          answer: "",
          showAnswer: false,
          evalState: "idle",
          evalResult: null,
          evalFeedback: "",
          autoQuality: null,
          submitting: false,
        });
      }
    } catch {
      setState((s) => ({ ...s, submitting: false }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (state.evalState === "idle") handleSubmitAnswer();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading cards…
        </div>
      </div>
    );
  }

  if (done || (cards.length === 0 && !isLoading)) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center text-center px-6">
        <div>
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {cards.length === 0 ? "All caught up!" : `Session complete!`}
          </h2>
          <p className="text-muted-foreground mb-2">
            {cards.length === 0
              ? "No cards due for review right now. Come back later!"
              : `Reviewed ${reviewedCount} card${reviewedCount !== 1 ? "s" : ""} in ${deck?.name ?? "this deck"}.`}
          </p>
          {reviewedCount > 0 && (
            <p className="text-sm text-muted-foreground mb-6">
              Great work! Your schedule has been updated.
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Link
              href={`/flashcards/decks/${deckId}`}
              className="px-5 py-2.5 border border-border rounded-lg font-medium hover:bg-accent transition-colors text-sm"
            >
              Manage Deck
            </Link>
            <Link
              href="/flashcards"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
            >
              All Decks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = totalDue > 0 ? (reviewedCount / totalDue) * 100 : 0;
  const evalResultStyle = state.evalResult
    ? resultStyles[state.evalResult]
    : null;
  const autoRatingLabel =
    state.autoQuality !== null
      ? (RATING_LABELS.find((r) => r.quality === state.autoQuality) ??
        RATING_LABELS[2])
      : null;

  return (
    <div className="min-h-screen bg-brand-bg text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/flashcards/decks/${deckId}`}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {deck?.name ?? "Deck"}
          </Link>
          <span className="text-sm text-muted-foreground">
            {reviewedCount} / {totalDue}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-1.5 mb-8">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Question */}
          <div className="p-6 pb-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> Question
            </p>
            <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap">
              {currentCard?.front}
            </p>
            {currentCard?.tags && currentCard.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {currentCard.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border mx-6 my-5" />

          {/* Answer input */}
          <div className="px-6 pb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Your Answer
            </p>
            <textarea
              ref={textareaRef}
              value={state.answer}
              onChange={(e) =>
                setState((s) => ({ ...s, answer: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              disabled={state.evalState !== "idle"}
              placeholder="Type your answer here… (⌘↵ to submit)"
              rows={4}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
            />

            {/* Evaluation feedback */}
            {state.evalState === "evaluating" && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                Evaluating your answer…
              </div>
            )}

            {state.evalState === "done" && evalResultStyle && (
              <div
                className={`mt-4 rounded-xl border-2 p-4 ${evalResultStyle.border} ${evalResultStyle.bg}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold text-sm ${evalResultStyle.text}`}>
                    {evalResultStyle.label}
                  </span>
                  {autoRatingLabel && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground border border-border">
                      Auto: {autoRatingLabel.label}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/80 mb-3">
                  {state.evalFeedback}
                </p>

                {/* Expected answer */}
                <div className="bg-background/60 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Expected answer
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {currentCard?.back}
                  </p>
                </div>
              </div>
            )}

            {/* Submit / Rate buttons */}
            {state.evalState === "idle" && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!state.answer.trim()}
                className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors"
              >
                Submit Answer
              </button>
            )}

            {state.evalState === "done" && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  Override rating (or press 1–4)
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {RATING_LABELS.map(({ label, quality, className }, i) => {
                    const isAuto = quality === state.autoQuality;
                    return (
                      <button
                        key={label}
                        onClick={() => handleRate(quality)}
                        disabled={state.submitting}
                        className={`relative py-2.5 border-2 rounded-xl text-sm font-semibold transition-all ${className} ${isAuto ? "ring-2 ring-offset-1 ring-primary" : ""}`}
                      >
                        <span className="absolute top-1 left-1.5 text-[10px] opacity-50">
                          {i + 1}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
