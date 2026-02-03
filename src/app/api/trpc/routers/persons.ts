import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { person } from "@/lib/db/schema";

export const personsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(person);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(person)
        .where(eq(person.id, input.id));
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Person not found" });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        birthDate: z.string().optional(),
        gender: z.string().optional(),
        original_province: z.number().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        tik_tok: z.string().optional(),
        biography: z.string().optional(),
        profession: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(person).values(input).returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        image_url: z.string().optional(),
        birthDate: z.string().optional(),
        gender: z.string().optional(),
        original_province: z.number().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        tik_tok: z.string().optional(),
        biography: z.string().optional(),
        profession: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(person)
        .set(data)
        .where(eq(person.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Person not found" });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(person)
        .where(eq(person.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Person not found" });
      }
      return { success: true };
    }),
});

