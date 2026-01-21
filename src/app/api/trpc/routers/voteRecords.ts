import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { voteRecord } from "@/lib/db/schema";

export const voteRecordsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(voteRecord);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(voteRecord)
        .where(eq(voteRecord.id, input.id));
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vote record not found",
        });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        voteId: z.string().uuid(),
        legislativeTermId: z.string().uuid(),
        choice: z.enum(["POSITIVE", "NEGATIVE", "ABSTENTION", "ABSENT"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(voteRecord)
        .values(input)
        .returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        voteId: z.string().uuid().optional(),
        legislativeTermId: z.string().uuid().optional(),
        choice: z.enum(["POSITIVE", "NEGATIVE", "ABSTENTION", "ABSENT"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(voteRecord)
        .set(data)
        .where(eq(voteRecord.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vote record not found",
        });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(voteRecord)
        .where(eq(voteRecord.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vote record not found",
        });
      }
      return { success: true };
    }),
});

