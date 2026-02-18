import z from "zod";

export const ZSanitizedNode = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string().optional().nullable(),
});

export type SanitizedNode = z.infer<typeof ZSanitizedNode>;

export const ZSanitizedEdge = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional().nullable(),
});

export type SanitizedEdge = z.infer<typeof ZSanitizedEdge>;

export const ZSanitizedGraph = z.object({
  nodes: z.array(ZSanitizedNode),
  connections: z.array(ZSanitizedEdge),
});

export type SanitizedGraph = z.infer<typeof ZSanitizedGraph>;
