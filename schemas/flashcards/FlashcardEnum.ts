export enum ReviewQuality {
  Blackout = 0,
  Wrong = 1,
  WrongButFamiliar = 2,
  Hard = 3,
  Good = 4,
  Easy = 5,
}

export enum ReviewRating {
  Again = "Again",
  Hard = "Hard",
  Good = "Good",
  Easy = "Easy",
}

export const reviewRatingToQuality: Record<ReviewRating, ReviewQuality> = {
  [ReviewRating.Again]: ReviewQuality.Blackout,
  [ReviewRating.Hard]: ReviewQuality.Hard,
  [ReviewRating.Good]: ReviewQuality.Good,
  [ReviewRating.Easy]: ReviewQuality.Easy,
};
