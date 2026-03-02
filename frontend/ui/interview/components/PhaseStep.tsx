import * as Schemas from "@/schemas";
import { Check } from "lucide-react";

export function PhaseStep({
  current,
  step,
  label,
  maxReachedPhase,
  onClick,
}: {
  current: Schemas.InterviewPhaseIntEnum;
  step: Schemas.InterviewPhaseIntEnum;
  label: string;
  maxReachedPhase: Schemas.InterviewPhaseIntEnum;
  onClick: () => void;
}) {
  const isCurrent = current === step;
  const isCompleted = step < current;
  const isReachable = step <= maxReachedPhase;

  return (
    <button
      onClick={onClick}
      disabled={!isReachable}
      className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isCurrent
          ? "bg-brand-primary text-primary-foreground shadow-lg shadow-brand-primary/25 ring-2 ring-brand-primary/20 ring-offset-2 ring-offset-background"
          : isCompleted
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
            : isReachable
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : "text-muted-foreground opacity-50 cursor-not-allowed"
      }`}
    >
      {isCompleted ? (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-200/50 dark:bg-emerald-900/50">
          <Check className="w-3 h-3" />
        </span>
      ) : (
        <span
          className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
            isCurrent
              ? "bg-white/20 text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {step}
        </span>
      )}
      <span>{labelWithoutNumber(label)}</span>
    </button>
  );
}

function labelWithoutNumber(label: string) {
  return label.replace(/^\d+\.\s*/, "");
}
