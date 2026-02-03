import { z } from "zod";
import { eq, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { province } from "@/lib/db/schema";

export const provincesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          name: z.string().min(1).optional(),
          take: z.number().int().positive().max(200).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const name = input?.name?.trim();
      const take = input?.take;

      const baseQuery = ctx.db
        .select({
          id: sql<string>`${province.provinceId}::text`.as("id"),
          name: province.name,
          isoCode: province.isoCode,
          region: province.region,
          nationalDeputiesCount: province.nationalDeputiesCount,
          senatorsCount: province.senatorsCount,
        })
        .from(province);

      const orderedQuery = name
        ? baseQuery.where(ilike(province.name, `%${name}%`)).orderBy(province.name)
        : baseQuery.orderBy(province.name);

      if (take) {
        return orderedQuery.limit(take);
      }

      return orderedQuery;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        nationalDeputiesCount: z.number().int().nonnegative().optional(),
        senatorsCount: z.number().int().nonnegative().optional(),
        hasLeyDeLemas: z.boolean().optional(),
        geojson: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [result] = await ctx.db
        .update(province)
        .set(data)
        .where(eq(province.provinceId, id))
        .returning();

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Provincia no encontrada",
        });
      }

      return {
        id: result.provinceId.toString(),
        name: result.name,
        isoCode: result.isoCode,
        region: result.region,
        nationalDeputiesCount: result.nationalDeputiesCount,
        senatorsCount: result.senatorsCount,
      };
    }),
});
