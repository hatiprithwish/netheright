import React from "react";
import * as Schemas from "@/schemas";
import { RequirementsStep } from "./phases/requirements-gathering";
import { BotECalculationStep } from "./phases/bote-calculations";
import { HighLevelDesign } from "./phases/high-level-design";

export const PHASE_COMPONENT_MAP: Record<
  Schemas.InterviewPhaseIntEnum,
  React.ComponentType<InterviewPhaseProps>
> = {
  [Schemas.InterviewPhaseIntEnum.RequirementsGathering]: RequirementsStep,
  [Schemas.InterviewPhaseIntEnum.BotECalculation]: BotECalculationStep,
  [Schemas.InterviewPhaseIntEnum.HighLevelDesign]: HighLevelDesign,
  // Phases 4 & 5 are defined in the enum but not yet rendered; cast to satisfy
  // the full-enum Record requirement until components exist.
  [Schemas.InterviewPhaseIntEnum.ComponentDeepDive]:
    HighLevelDesign as React.ComponentType<InterviewPhaseProps>,
  [Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion]:
    HighLevelDesign as React.ComponentType<InterviewPhaseProps>,
};

export const ACTIVE_PHASES: {
  step: Schemas.InterviewPhaseIntEnum;
  label: string;
}[] = [
  {
    step: Schemas.InterviewPhaseIntEnum.RequirementsGathering,
    label: `1. ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}`,
  },
  {
    step: Schemas.InterviewPhaseIntEnum.BotECalculation,
    label: `2. ${Schemas.InterviewPhaseLabelEnum.BotECalculation}`,
  },
  {
    step: Schemas.InterviewPhaseIntEnum.HighLevelDesign,
    label: `3. ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}`,
  },
];

// Common for all phases
export interface InterviewPhaseProps {
  messages: any[];
  sendMessage: (message: any, options?: any) => void;
  isLoading?: boolean;
  pendingPhaseTransition?: number | null;
  onConfirmTransition?: () => void;
  onSkipPhase?: () => void;
}
