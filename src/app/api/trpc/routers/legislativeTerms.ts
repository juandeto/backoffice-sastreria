import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { legislativeTerm } from "@/lib/db/schema";

export const legislativeTermsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(legislativeTerm);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(legislativeTerm)
        .where(eq(legislativeTerm.id, input.id));
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Legislative term not found",
        });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        personId: z.string().uuid(),
        chamber: z.enum(["DEPUTIES", "SENATE"]),
        district: z.string().min(1),
        startDate: z.string(),
        endDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(legislativeTerm)
        .values(input)
        .returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        personId: z.string().uuid().optional(),
        chamber: z.enum(["DEPUTIES", "SENATE"]).optional(),
        district: z.string().min(1).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(legislativeTerm)
        .set(data)
        .where(eq(legislativeTerm.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Legislative term not found",
        });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(legislativeTerm)
        .where(eq(legislativeTerm.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Legislative term not found",
        });
      }
      return { success: true };
    }),
});

