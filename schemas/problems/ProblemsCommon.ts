export interface ProblemBase {
  id: number;
  title: string;
  description: string;
}

export interface Problem extends ProblemBase {
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  boteFactors: string;
}
