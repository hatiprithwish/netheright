export enum ChatRoleIntEnum {
  User = 1,
  Assistant = 2,
  System = 3,
}

export enum ChatRoleLabelEnum {
  User = "user",
  Assistant = "assistant",
  System = "system",
}

export enum InterviewPhaseIntEnum {
  RequirementsGathering = 1,
  HighLevelDesign = 2,
  DeepDive = 3,
  Scorecard = 4,
}

export enum InterviewPhaseLabelEnum {
  RequirementsGathering = "requirements gathering",
  HighLevelDesign = "high level design",
  DeepDive = "deep dive",
  Scorecard = "scorecard",
}

export const interviewPhaseLabelToInt: Record<
  InterviewPhaseLabelEnum,
  InterviewPhaseIntEnum
> = {
  [InterviewPhaseLabelEnum.RequirementsGathering]:
    InterviewPhaseIntEnum.RequirementsGathering,
  [InterviewPhaseLabelEnum.HighLevelDesign]:
    InterviewPhaseIntEnum.HighLevelDesign,
  [InterviewPhaseLabelEnum.DeepDive]: InterviewPhaseIntEnum.DeepDive,
  [InterviewPhaseLabelEnum.Scorecard]: InterviewPhaseIntEnum.Scorecard,
};

export const interviewPhaseIntToLabel: Record<
  InterviewPhaseIntEnum,
  InterviewPhaseLabelEnum
> = {
  [InterviewPhaseIntEnum.RequirementsGathering]:
    InterviewPhaseLabelEnum.RequirementsGathering,
  [InterviewPhaseIntEnum.HighLevelDesign]:
    InterviewPhaseLabelEnum.HighLevelDesign,
  [InterviewPhaseIntEnum.DeepDive]: InterviewPhaseLabelEnum.DeepDive,
  [InterviewPhaseIntEnum.Scorecard]: InterviewPhaseLabelEnum.Scorecard,
};

export enum InterviewGrade {
  S = 1,
  A = 2,
  B = 3,
  C = 4,
  F = 5,
}

export enum InterviewSessionStatusIntEnum {
  Active = 1,
  Completed = 2,
  Abandoned = 3,
}

export enum InterviewSessionStatusLabelEnum {
  Active = "active",
  Completed = "completed",
  Abandoned = "abandoned",
}

export const interviewSessionStatusLabelToInt: Record<
  InterviewSessionStatusLabelEnum,
  InterviewSessionStatusIntEnum
> = {
  [InterviewSessionStatusLabelEnum.Active]:
    InterviewSessionStatusIntEnum.Active,
  [InterviewSessionStatusLabelEnum.Completed]:
    InterviewSessionStatusIntEnum.Completed,
  [InterviewSessionStatusLabelEnum.Abandoned]:
    InterviewSessionStatusIntEnum.Abandoned,
};

export const interviewSessionStatusIntToLabel: Record<
  InterviewSessionStatusIntEnum,
  InterviewSessionStatusLabelEnum
> = {
  [InterviewSessionStatusIntEnum.Active]:
    InterviewSessionStatusLabelEnum.Active,
  [InterviewSessionStatusIntEnum.Completed]:
    InterviewSessionStatusLabelEnum.Completed,
  [InterviewSessionStatusIntEnum.Abandoned]:
    InterviewSessionStatusLabelEnum.Abandoned,
};

export enum RedFlagTypeEnum {
  JimmyEffect = "Jimmy Effect",
  MagicalBox = "Magical Box",
  KeywordStuffing = "Keyword Stuffing",
  PrematureOptimization = "Premature Optimization",
  VagueRequirements = "Vague Requirements",
  SkippedTradeoffs = "Skipped Tradeoffs",
}
