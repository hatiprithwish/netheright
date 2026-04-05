export const PHASES = [
  {
    badgeText: "Phase 1",
    title: "Requirements Gathering",
    description:
      "In Phase 1, the AI asks you targeted questions about the functional and non-functional requirements of the system. Clarify your assumptions, define the scope, and lay the foundation for a solid design — just like a real senior engineer would.",
    imageSrc: "/phase-1-requirements.png",
    imageAlt: "Phase 1: Requirements Gathering chat interface",
    imageLeft: false,
    glowBackground: "radial-gradient(circle, hsl(var(--primary)/0.4), transparent)",
  },
  {
    badgeText: "Phase 2",
    title: "Back-of-the-Envelope Calculations",
    description:
      "In Phase 2, you'll perform back-of-the-envelope calculations to estimate the scale and cost of the system. Think through QPS, storage, bandwidth, and caching needs — the AI gives you real-time feedback on your reasoning.",
    imageSrc: "/phase-2-calculations.png",
    imageAlt: "Phase 2: Back-of-the-Envelope Calculations chat interface",
    imageLeft: true,
    glowBackground: "radial-gradient(circle, rgba(168,85,247,0.4), transparent)",
  },
  {
    badgeText: "Phase 3",
    title: "High-Level Design",
    description:
      "In Phase 3, you'll create a full High-Level Design of the system on an interactive canvas. Draw components, connect services, and label data flows — the AI evaluates your architecture decisions in real time.",
    imageSrc: "/phase-3-hld.png",
    imageAlt: "Phase 3: High-Level Design canvas",
    imageLeft: false,
    glowBackground: "radial-gradient(circle, rgba(236,72,153,0.4), transparent)",
  },
];

export const FEEDBACK_STEPS = [
  {
    badgeText: "Track Progress",
    badgeClassName: "border-secondary/20 bg-secondary/10 text-secondary-foreground",
    title: "Comprehensive Interview History",
    description:
      "Keep track of all your practice sessions in one place. Monitor your performance over time, review past interviews, and see at a glance which areas you've mastered and where you need more practice.",
    imageSrc: "/interview-history.png",
    imageAlt: "Dashboard showing interview history and stats",
    imageLeft: false,
    glowBackground: "radial-gradient(circle, rgba(59,130,246,0.4), transparent)",
  },
  {
    badgeText: "Deep Insights",
    badgeClassName: "border-secondary/20 bg-secondary/10 text-secondary-foreground",
    title: "Actionable AI Feedback",
    description:
      "Get a detailed scorecard after every interview. Our AI analyzes your performance across key dimensions like Requirements Gathering, Data Modeling, and Scalability, pinpointing your exact strengths and specific areas for growth.",
    imageSrc: "/interview-feedback.png",
    imageAlt: "Detailed interview feedback and scorecard",
    imageLeft: true,
    glowBackground: "radial-gradient(circle, rgba(16,185,129,0.4), transparent)",
  },
];
