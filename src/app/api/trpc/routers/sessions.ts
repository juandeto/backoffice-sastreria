import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { session } from "@/lib/db/schema";
import { calculateChamberMetric } from "@/lib/services/metrics.service";

export const sessionsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(session).orderBy(desc(session.sessionDate));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(session)
        .where(eq(session.id, input.id));
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        chamber: z.enum(["DEPUTY", "SENATOR"]),
        sessionDate: z.string(),
        sessionType: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        quorumRequired: z.number().int().min(1),
        quorumAchieved: z.number().int().optional(),
        hasQuorum: z.boolean().optional(),
        status: z.enum(["scheduled", "started", "failed_no_quorum", "closed"]),
        source: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(session)
        .values({
          ...input,
          sessionDate: input.sessionDate,
        })
        .returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        chamber: z.enum(["DEPUTY", "SENATOR"]).optional(),
        sessionDate: z.string().optional(),
        sessionType: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        quorumRequired: z.number().int().min(1).optional(),
        quorumAchieved: z.number().int().optional(),
        hasQuorum: z.boolean().optional(),
        status: z.enum(["scheduled", "started", "failed_no_quorum", "closed"]).optional(),
        source: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, sessionDate, ...data } = input;
      const [result] = await ctx.db
        .update(session)
        .set({
          ...data,
          ...(sessionDate !== undefined && { sessionDate }),
        })
        .where(eq(session.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }
      
      // Calculate chamber metric when session is closed (wrap in try/catch)
      if (result.status === "closed") {
        try {
          await calculateChamberMetric(ctx.db, id, result.chamber);
        } catch (error) {
          // Log error but don't fail the mutation
          console.error("Failed to calculate chamber metric:", error);
        }
      }
      
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(session)
        .where(eq(session.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }
      return { success: true };
    }),
});
