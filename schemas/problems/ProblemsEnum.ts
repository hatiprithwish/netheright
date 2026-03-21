import { BadgeColor } from "../common";

export enum ProblemDifficultyEnum {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
}

export const ProblemDifficultyToBadgeColor: Record<
  ProblemDifficultyEnum,
  BadgeColor
> = {
  [ProblemDifficultyEnum.Easy]: BadgeColor.Green,
  [ProblemDifficultyEnum.Medium]: BadgeColor.Yellow,
  [ProblemDifficultyEnum.Hard]: BadgeColor.Red,
};
