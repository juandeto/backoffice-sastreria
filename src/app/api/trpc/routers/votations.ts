import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { vote } from "@/lib/db/schema";

export const votationsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(vote);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(vote)
        .where(eq(vote.id, input.id));
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vote not found" });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        billId: z.string().uuid(),
        chamber: z.enum(["DEPUTIES", "SENATE"]),
        voteDate: z.string(),
        voteType: z.enum(["GENERAL", "PARTICULAR", "MOTION"]),
        officialVotePreferenceId: z.string().uuid().optional(),
        comments: z.string().optional(),
        result: z.enum(["APPROVED", "REJECTED"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(vote).values(input).returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        billId: z.string().uuid().optional(),
        chamber: z.enum(["DEPUTIES", "SENATE"]).optional(),
        voteDate: z.string().optional(),
        voteType: z.enum(["GENERAL", "PARTICULAR", "MOTION"]).optional(),
        officialVotePreferenceId: z.string().uuid().optional(),
        comments: z.string().optional(),
        result: z.enum(["APPROVED", "REJECTED"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(vote)
        .set(data)
        .where(eq(vote.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vote not found" });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(vote)
        .where(eq(vote.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vote not found" });
      }
      return { success: true };
    }),
});

