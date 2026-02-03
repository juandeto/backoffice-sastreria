import { z } from "zod";

export const chamberEnumSchema = z.enum(["DEPUTY", "SENATOR"]);

export const blockSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  abbreviation: z.string(),
  chamber: chamberEnumSchema,
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  color: z.string(),
  partyId: z.string().uuid().nullable().optional(),
  block_coalition_id: z.string().uuid().nullable().optional(),
});

export const partySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  abbreviation: z.string(),
  color: z.string(),
  logo: z.string().nullable().optional(),
  partyType: z.string().nullable().optional(),
});

export const blockCoalitionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  leader: z.string().uuid().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  color: z.string(),
});

export type Block = z.infer<typeof blockSchema>;
export type Party = z.infer<typeof partySchema>;
export type BlockCoalition = z.infer<typeof blockCoalitionSchema>;

// Deprecated - kept for compatibility during migration
export const sectionSchema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});
