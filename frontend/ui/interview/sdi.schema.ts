import { z } from "zod";

// Phase 1: Scope validation schema
export const ValidationSchema = z.object({
  isValid: z.boolean(),
  reason: z.string(),
  missingAspects: z.array(z.string()).optional(),
});

// Phase 2: Critique schema
export const CritiqueSchema = z.object({
  criticalFlaw: z.string(),
  affectedNodes: z.array(z.string()),
  severity: z.enum(["low", "medium", "high"]),
  defenseQuestion: z.string(),
});

// Phase 4: Scorecard schema
export const ScorecardSchema = z.object({
  categories: z.object({
    requirementsGathering: z.number().min(0).max(100),
    dataModeling: z.number().min(0).max(100),
    tradeOffAnalysis: z.number().min(0).max(100),
    scalability: z.number().min(0).max(100),
  }),
  strengths: z.array(z.string()),
  growthAreas: z.array(z.string()),
  actionableFeedback: z.string(),
  overallGrade: z.enum(["S", "A", "B", "C", "F"]),
});

// Type exports
export type Validation = z.infer<typeof ValidationSchema>;
export type Critique = z.infer<typeof CritiqueSchema>;
export type Scorecard = z.infer<typeof ScorecardSchema>;
