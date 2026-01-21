import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { officialVotePreference } from "@/lib/db/schema";

export const officialVotePreferenceRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(officialVotePreference);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(officialVotePreference)
        .where(eq(officialVotePreference.id, input.id));
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Official vote preference not found",
        });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(officialVotePreference)
        .values(input)
        .returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(officialVotePreference)
        .set(data)
        .where(eq(officialVotePreference.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Official vote preference not found",
        });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(officialVotePreference)
        .where(eq(officialVotePreference.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Official vote preference not found",
        });
      }
      return { success: true };
    }),
});

