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
          ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 ring-2 ring-brand-primary/20 ring-offset-2 ring-offset-white"
          : isCompleted
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : isReachable
              ? "bg-gray-50 text-text-main hover:bg-gray-100"
              : "text-text-muted opacity-50 cursor-not-allowed"
      }`}
    >
      {isCompleted ? (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-200/50">
          <Check className="w-3 h-3" />
        </span>
      ) : (
        <span
          className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] ${
            isCurrent ? "bg-white/20 text-white" : "bg-gray-200 text-text-muted"
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
