import { PHASES } from "./utils";
import FeatureRow from "./FeatureRow";

export default function InterviewProcessSection() {
  return (
    <section
      id="interview-process"
      className="border-t border-border bg-background py-24 lg:py-32"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Interview Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Three structured phases to challenge and evaluate every dimension of
            your system design skills.
          </p>
        </div>

        {/* Phase Rows */}
        <div className="flex flex-col gap-28 lg:gap-36">
          {PHASES.map((phaseData, index) => (
            <FeatureRow
              key={phaseData.badgeText}
              priority={index === 0}
              {...phaseData}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
