import { z } from "zod";
import { eq, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { party } from "@/lib/db/schema";

export const partiesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        take: z.number().int().positive().max(100).optional().default(50),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const name = input?.name?.trim();
      const take = input?.take ?? 10;
      const query = ctx.db.select().from(party);
      if (name) {
        return query.where(ilike(party.name, `%${name}%`)).orderBy(party.name).limit(take);
      }
      return query.orderBy(party.name).limit(take);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(party)
        .where(eq(party.id, input.id));
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Party not found" });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "El nombre es requerido"),
        abbreviation: z.string().min(1, "La abreviación es requerida"),
        color: z.string().min(1, "El color es requerido"),
        logo: z.string().optional(),
        partyType: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(party).values(input).returning();
      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al crear el partido",
        });
      }
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        abbreviation: z.string().min(1).optional(),
        color: z.string().min(1).optional(),
        logo: z.string().optional().nullable(),
        partyType: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(party)
        .set(data)
        .where(eq(party.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Party not found" });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(party)
        .where(eq(party.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Party not found" });
      }
      return { success: true };
    }),
});
