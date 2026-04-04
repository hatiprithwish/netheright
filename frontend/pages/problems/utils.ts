import { Calculator, Network, Search } from "lucide-react";

export const INTERVIEW_PHASES = [
  {
    title: "Phase 1: Requirements Gathering",
    description: "Clarify functional and non-functional requirements",
    icon: Search,
    colorClass:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Phase 2: Back-of-the-Envelope",
    description: "Estimate system scale and resource needs",
    icon: Calculator,
    colorClass:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Phase 3: High-Level Design",
    description: "Create your system architecture diagram",
    icon: Network,
    colorClass:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
];
