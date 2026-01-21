import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { politicalLeader } from "@/lib/db/schema";

export const politicalLeadersRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(politicalLeader);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(politicalLeader)
        .where(eq(politicalLeader.id, input.id));
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Political leader not found",
        });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        role: z.string().min(1),
        type_district: z.string().optional(),
        name_district: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(politicalLeader)
        .values(input)
        .returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        role: z.string().min(1).optional(),
        type_district: z.string().optional(),
        name_district: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(politicalLeader)
        .set(data)
        .where(eq(politicalLeader.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Political leader not found",
        });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(politicalLeader)
        .where(eq(politicalLeader.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Political leader not found",
        });
      }
      return { success: true };
    }),
});

