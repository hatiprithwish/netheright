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

export const chatRoleIntToLabel: Record<ChatRoleIntEnum, ChatRoleLabelEnum> = {
  [ChatRoleIntEnum.User]: ChatRoleLabelEnum.User,
  [ChatRoleIntEnum.Assistant]: ChatRoleLabelEnum.Assistant,
  [ChatRoleIntEnum.System]: ChatRoleLabelEnum.System,
};

export enum InterviewPhaseIntEnum {
  RequirementsGathering = 1,
  BotECalculation = 2,
  HighLevelDesign = 3,
  ComponentDeepDive = 4,
  BottlenecksDiscussion = 5,
}

export enum InterviewPhaseLabelEnum {
  RequirementsGathering = "Requirements Gathering",
  BotECalculation = "BotE Calculation",
  HighLevelDesign = "High Level Design",
  ComponentDeepDive = "Component Deep Dive",
  BottlenecksDiscussion = "Bottlenecks Discussion",
}

export const interviewPhaseLabelToInt: Record<
  InterviewPhaseLabelEnum,
  InterviewPhaseIntEnum
> = {
  [InterviewPhaseLabelEnum.RequirementsGathering]:
    InterviewPhaseIntEnum.RequirementsGathering,
  [InterviewPhaseLabelEnum.HighLevelDesign]:
    InterviewPhaseIntEnum.HighLevelDesign,
  [InterviewPhaseLabelEnum.ComponentDeepDive]:
    InterviewPhaseIntEnum.ComponentDeepDive,
  [InterviewPhaseLabelEnum.BottlenecksDiscussion]:
    InterviewPhaseIntEnum.BottlenecksDiscussion,
  [InterviewPhaseLabelEnum.BotECalculation]:
    InterviewPhaseIntEnum.BotECalculation,
};

export const interviewPhaseIntToLabel: Record<
  InterviewPhaseIntEnum,
  InterviewPhaseLabelEnum
> = {
  [InterviewPhaseIntEnum.RequirementsGathering]:
    InterviewPhaseLabelEnum.RequirementsGathering,
  [InterviewPhaseIntEnum.HighLevelDesign]:
    InterviewPhaseLabelEnum.HighLevelDesign,
  [InterviewPhaseIntEnum.ComponentDeepDive]:
    InterviewPhaseLabelEnum.ComponentDeepDive,
  [InterviewPhaseIntEnum.BottlenecksDiscussion]:
    InterviewPhaseLabelEnum.BottlenecksDiscussion,
  [InterviewPhaseIntEnum.BotECalculation]:
    InterviewPhaseLabelEnum.BotECalculation,
};

export enum InterviewGrade {
  F = 1,
  C = 2,
  B = 3,
  A = 4,
  S = 5,
}

export enum InterviewStatusIntEnum {
  Active = 1,
  Completed = 2,
  Abandoned = 3,
  Deleted = 4,
}

export enum InterviewStatusLabelEnum {
  Active = "Active",
  Completed = "Completed",
  Abandoned = "Abandoned",
  Deleted = "Deleted",
}

export const interviewStatusLabelToInt: Record<
  InterviewStatusLabelEnum,
  InterviewStatusIntEnum
> = {
  [InterviewStatusLabelEnum.Active]: InterviewStatusIntEnum.Active,
  [InterviewStatusLabelEnum.Completed]: InterviewStatusIntEnum.Completed,
  [InterviewStatusLabelEnum.Abandoned]: InterviewStatusIntEnum.Abandoned,
  [InterviewStatusLabelEnum.Deleted]: InterviewStatusIntEnum.Deleted,
};

export const interviewStatusIntToLabel: Record<
  InterviewStatusIntEnum,
  InterviewStatusLabelEnum
> = {
  [InterviewStatusIntEnum.Active]: InterviewStatusLabelEnum.Active,
  [InterviewStatusIntEnum.Completed]: InterviewStatusLabelEnum.Completed,
  [InterviewStatusIntEnum.Abandoned]: InterviewStatusLabelEnum.Abandoned,
  [InterviewStatusIntEnum.Deleted]: InterviewStatusLabelEnum.Deleted,
};

export enum RedFlagTypeEnum {
  JimmyEffect = "Jimmy Effect",
  MagicalBox = "Magical Box",
  KeywordStuffing = "Keyword Stuffing",
  PrematureOptimization = "Premature Optimization",
  VagueRequirements = "Vague Requirements",
  SkippedTradeoffs = "Skipped Tradeoffs",
}
