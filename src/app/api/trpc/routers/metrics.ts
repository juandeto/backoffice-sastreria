import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  legislativeMetric,
  chamberMetric,
  legislativeTermMetric,
} from "@/lib/db/schema";

export const metricsRouter = createTRPCRouter({
  listByVoteId: protectedProcedure
    .input(z.object({ voteId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(legislativeMetric)
        .where(eq(legislativeMetric.voteId, input.voteId));
    }),

  listByPersonId: protectedProcedure
    .input(z.object({ personId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(legislativeMetric)
        .where(eq(legislativeMetric.personId, input.personId));
    }),

  getChamberMetricBySessionId: protectedProcedure
    .input(z.object({ sessionId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const metrics = await ctx.db
        .select()
        .from(chamberMetric)
        .where(eq(chamberMetric.sessionId, input.sessionId));
      
      return metrics;
    }),

  getTermMetric: protectedProcedure
    .input(
      z.object({
        personId: z.string().uuid(),
        legislativeTermId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(legislativeTermMetric)
        .where(
          and(
            eq(legislativeTermMetric.personId, input.personId),
            eq(legislativeTermMetric.legislativeTermId, input.legislativeTermId)
          )
        );
      
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Legislative term metric not found",
        });
      }
      
      return result;
    }),

  listTermMetricsByPersonId: protectedProcedure
    .input(z.object({ personId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(legislativeTermMetric)
        .where(eq(legislativeTermMetric.personId, input.personId));
    }),
});
