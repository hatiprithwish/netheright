import Constants from "@/constants";

interface GradeBadgeProps {
  grade: number;
  size?: "sm" | "md" | "lg";
}

export function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const label = Constants.GRADE_LABELS[grade] || "?";
  const colors = Constants.GRADE_COLORS[grade] || Constants.GRADE_COLORS[5];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-lg",
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-full border-2 ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}
