import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { bill } from "@/lib/db/schema";

export const billsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(bill);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(bill)
        .where(eq(bill.id, input.id));
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        fileNumber: z.string().optional(),
        billType: z.enum(["LAW", "RESOLUTION", "DECLARATION", "DECREE"]),
        introducedDate: z.string().optional(),
        status: z.string().optional(),
        summary: z.string().optional(),
        description: z.string().optional(),
        link: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(bill).values(input).returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).optional(),
        fileNumber: z.string().optional(),
        billType: z.enum(["LAW", "RESOLUTION", "DECLARATION", "DECREE"]).optional(),
        introducedDate: z.string().optional(),
        status: z.string().optional(),
        summary: z.string().optional(),
        description: z.string().optional(),
        link: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(bill)
        .set(data)
        .where(eq(bill.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(bill)
        .where(eq(bill.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
      }
      return { success: true };
    }),
});

