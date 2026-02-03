import { z } from "zod";
import { and, eq, sql, lte, gte, or, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { legislativeTerm, province } from "@/lib/db/schema";

export const legislativeTermsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(legislativeTerm);
  }),

  listByPersonId: protectedProcedure
    .input(z.object({ personId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: legislativeTerm.id,
          chamber: legislativeTerm.chamber,
          order_in_list: legislativeTerm.order_in_list,
          startDate: legislativeTerm.startDate,
          endDate: legislativeTerm.endDate,
          provinceId: legislativeTerm.province,
          provinceName: province.name,
          elected_in_party: legislativeTerm.elected_in_party,
          notes: legislativeTerm.notes,
        })
        .from(legislativeTerm)
        .leftJoin(province, eq(legislativeTerm.province, province.provinceId))
        .where(eq(legislativeTerm.personId, input.personId));
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
        chamber: z.enum(["DEPUTY", "SENATOR"]),
        province: z.number().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        order_in_list: z.number().min(1),
        notes: z.string().optional(),
        elected_in_party: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validar que las fechas del nuevo mandato no se solapen con otros mandatos existentes
      // Dos períodos se solapan si: A_start <= B_end AND B_start <= A_end
      // También debemos considerar el caso donde endDate es null (mandato actual)
      const newEndDate = input.endDate ?? "9999-12-31";

      const overlappingTerms = await ctx.db
        .select()
        .from(legislativeTerm)
        .where(
          and(
            eq(legislativeTerm.personId, input.personId),
            // El nuevo mandato comienza antes o durante el mandato existente
            // Y el nuevo mandato termina después o durante el mandato existente
            // Dos períodos se solapan si: A_start <= B_end AND B_start <= A_end
            and(
              lte(legislativeTerm.startDate, newEndDate),
              or(
                isNull(legislativeTerm.endDate),
                gte(legislativeTerm.endDate, input.startDate),
              ),
            ),
          ),
        );

      if (overlappingTerms.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Las fechas de inicio y fin del mandato no pueden solaparse con otro mandato",
        });
      }

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
        chamber: z.enum(["DEPUTY", "SENATOR"]).optional(),
        province: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        order_in_list: z.number().min(1).optional(),
        notes: z.string().optional(),
        elected_in_party: z.string().optional(),
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

