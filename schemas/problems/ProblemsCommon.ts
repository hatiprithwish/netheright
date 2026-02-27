export interface ProblemBase {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  tags: string[] | null;
}

export interface Problem extends ProblemBase {
  functionalRequirements: string;
  nonFunctionalRequirements: string;
  boteFactors: string;
}
