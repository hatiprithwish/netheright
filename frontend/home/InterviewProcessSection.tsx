import Image from "next/image";

const SECTION_HEADING = "Interview Process";

const PHASES = [
  {
    phase: "Phase 1",
    title: "Requirements Gathering",
    description:
      "In Phase 1, the AI asks you targeted questions about the functional and non-functional requirements of the system. Clarify your assumptions, define the scope, and lay the foundation for a solid design — just like a real senior engineer would.",
    imageSrc: "/phase-1-requirements.png",
    imageAlt: "Phase 1: Requirements Gathering chat interface",
    imageLeft: false,
  },
  {
    phase: "Phase 2",
    title: "Back-of-the-Envelope Calculations",
    description:
      "In Phase 2, you'll perform back-of-the-envelope calculations to estimate the scale and cost of the system. Think through QPS, storage, bandwidth, and caching needs — the AI gives you real-time feedback on your reasoning.",
    imageSrc: "/phase-2-calculations.png",
    imageAlt: "Phase 2: Back-of-the-Envelope Calculations chat interface",
    imageLeft: true,
  },
  {
    phase: "Phase 3",
    title: "High-Level Design",
    description:
      "In Phase 3, you'll create a full High-Level Design of the system on an interactive canvas. Draw components, connect services, and label data flows — the AI evaluates your architecture decisions in real time.",
    imageSrc: "/phase-3-hld.png",
    imageAlt: "Phase 3: High-Level Design canvas",
    imageLeft: false,
  },
] as const;

function PhaseRow({
  phase,
  title,
  description,
  imageSrc,
  imageAlt,
  imageLeft,
  index,
}: (typeof PHASES)[number] & { index: number }) {
  const textContent = (
    <div className="flex flex-col justify-center gap-4">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
        {phase}
      </div>
      <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );

  const imageContent = (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-border shadow-2xl">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={640}
          height={420}
          className="w-full object-cover"
          priority={index === 0}
        />
      </div>
      {/* Decorative glow behind image */}
      <div
        className="absolute -inset-4 -z-10 rounded-3xl opacity-30 blur-2xl"
        style={{
          background:
            index === 0
              ? "radial-gradient(circle, hsl(var(--primary)/0.4), transparent)"
              : index === 1
                ? "radial-gradient(circle, rgba(168,85,247,0.4), transparent)"
                : "radial-gradient(circle, rgba(236,72,153,0.4), transparent)",
        }}
      />
    </div>
  );

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      {imageLeft ? (
        <>
          {imageContent}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {imageContent}
        </>
      )}
    </div>
  );
}

export function InterviewProcessSection() {
  return (
    <section
      id="interview-process"
      className="border-t border-border bg-background py-24 lg:py-32"
    >
      <div className="container mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {SECTION_HEADING}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Three structured phases to challenge and evaluate every dimension of
            your system design skills.
          </p>
        </div>

        {/* Phase Rows */}
        <div className="flex flex-col gap-28 lg:gap-36">
          {PHASES.map((phaseData, index) => (
            <PhaseRow key={phaseData.phase} {...phaseData} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
