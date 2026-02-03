import { z } from "zod";
import { eq, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { block_coalition } from "@/lib/db/schema";

export const blockCoalitionsRouter = createTRPCRouter({
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
      const query = ctx.db.select().from(block_coalition);
      if (name) {
        return query
          .where(ilike(block_coalition.name, `%${name}%`))
          .orderBy(block_coalition.name)
          .limit(take);
      }
      return query.orderBy(block_coalition.name).limit(take);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(block_coalition)
        .where(eq(block_coalition.id, input.id));
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Block coalition not found",
        });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "El nombre es requerido"),
        startDate: z.string().min(1, "La fecha de inicio es requerida"),
        color: z.string().min(1, "El color es requerido"),
        leader: z.string().uuid().optional(),
        endDate: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(block_coalition)
        .values(input)
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al crear el interbloque",
        });
      }
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        startDate: z.string().optional(),
        color: z.string().min(1).optional(),
        leader: z.string().uuid().optional().nullable(),
        endDate: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(block_coalition)
        .set(data)
        .where(eq(block_coalition.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Block coalition not found",
        });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(block_coalition)
        .where(eq(block_coalition.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Block coalition not found",
        });
      }
      return { success: true };
    }),
});
