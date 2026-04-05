import { FEEDBACK_STEPS } from "./utils";
import FeatureRow from "./FeatureRow";

export default function InterviewFeedbackSection() {
  return (
    <section
      id="interview-feedback"
      className="border-t border-border bg-background py-24 lg:py-32"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Detailed Feedback & Tracking
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Don't just practice — improve. Get deep, actionable insights into your performance and track your growth over time.
          </p>
        </div>

        {/* Phase Rows */}
        <div className="flex flex-col gap-28 lg:gap-36">
          {FEEDBACK_STEPS.map((stepData, index) => (
            <FeatureRow key={stepData.badgeText} priority={index === 0} {...stepData} />
          ))}
        </div>
      </div>
    </section>
  );
}


