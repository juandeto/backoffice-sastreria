import { z } from "zod";
import { eq, ilike } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { block } from "@/lib/db/schema";

export const blocksRouter = createTRPCRouter({
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
      const query = ctx.db.select().from(block);
      if (name) {
        return query.where(ilike(block.name, `%${name}%`)).limit(take);
      }
      return query.limit(take);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(block)
        .where(eq(block.id, input.id));
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Block not found" });
      }
      return result;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        abbreviation: z.string().min(1),
        chamber: z.enum(["DEPUTY", "SENATOR"]),
        startDate: z.string(),
        endDate: z.string().optional(),
        color: z.string().min(1),
        partyId: z.string().uuid().optional(),
        block_coalition_id: z.string().uuid().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db.insert(block).values(input).returning();
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        abbreviation: z.string().min(1).optional(),
        chamber: z.enum(["DEPUTY", "SENATOR"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        color: z.string().min(1).optional(),
        partyId: z.string().uuid().optional().nullable(),
        block_coalition_id: z.string().uuid().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(block)
        .set(data)
        .where(eq(block.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Block not found" });
      }
      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .delete(block)
        .where(eq(block.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Block not found" });
      }
      return { success: true };
    }),
});

