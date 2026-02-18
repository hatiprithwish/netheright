import * as Schemas from "@/schemas";

export function PhaseStep({
  current,
  step,
  label,
  onClick,
}: {
  current: Schemas.InterviewPhaseIntEnum;
  step: Schemas.InterviewPhaseIntEnum;
  label: string;
  maxReachedPhase: Schemas.InterviewPhaseIntEnum;
  onClick: () => void;
}) {
  const isActive = current === step;
  const isDisabled = current !== step; // Disable all phases except current

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
        isActive
          ? "bg-white shadow text-primary font-medium"
          : "text-slate-300 cursor-not-allowed"
      }`}
    >
      {label}
    </button>
  );
}
