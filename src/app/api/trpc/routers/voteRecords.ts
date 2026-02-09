import { z } from "zod";
import { eq, and, or, gte, lte, isNull, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  voteRecord,
  person,
  legislativeTerm,
  province,
  block_membership,
  block,
} from "@/lib/db/schema";
import { calculateLegislativeMetric } from "@/lib/services/metrics.service";

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
        choice: z.enum([
          "POSITIVE",
          "NEGATIVE",
          "ABSTENTION",
          "ABSENT",
          "INCONCLUSIVE",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(voteRecord)
        .values(input)
        .returning();
      
      // Calculate metrics (wrap in try/catch to avoid breaking vote saving)
      try {
        await calculateLegislativeMetric(ctx.db, {
          voteId: input.voteId,
          legislativeTermId: input.legislativeTermId,
        });
      } catch (error) {
        // Log error but don't fail the mutation
        console.error("Failed to calculate legislative metric:", error);
      }
      
      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        voteId: z.string().uuid().optional(),
        legislativeTermId: z.string().uuid().optional(),
        choice: z
          .enum([
            "POSITIVE",
            "NEGATIVE",
            "ABSTENTION",
            "ABSENT",
            "INCONCLUSIVE",
          ])
          .optional(),
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
      
      // Calculate metrics (wrap in try/catch to avoid breaking vote saving)
      try {
        await calculateLegislativeMetric(ctx.db, {
          voteId: result.voteId,
          legislativeTermId: result.legislativeTermId,
        });
      } catch (error) {
        // Log error but don't fail the mutation
        console.error("Failed to calculate legislative metric:", error);
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

  listByVoteIdWithLegislators: protectedProcedure
    .input(
      z.object({
        voteId: z.string().uuid(),
        voteDate: z.string().min(1),
        chamber: z.enum(["DEPUTY", "SENATOR"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          legislativeTermId: legislativeTerm.id,
          personId: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
          chamber: legislativeTerm.chamber,
          provinceName: province.name,
          blockName: block.name,
          blockColor: block.color,
          voteRecordId: voteRecord.id,
          choice: voteRecord.choice,
        })
        .from(person)
        .innerJoin(legislativeTerm, eq(person.id, legislativeTerm.personId))
        .leftJoin(province, eq(legislativeTerm.province, province.provinceId))
        .leftJoin(
          block_membership,
          and(
            eq(block_membership.legislativeTermId, legislativeTerm.id),
            sql`${block_membership.endDate} IS NULL OR ${block_membership.endDate} > now()`,
          ),
        )
        .leftJoin(block, eq(block_membership.blockId, block.id))
        .leftJoin(
          voteRecord,
          and(
            eq(voteRecord.legislativeTermId, legislativeTerm.id),
            eq(voteRecord.voteId, input.voteId),
          ),
        )
        .where(
          and(
            eq(legislativeTerm.chamber, input.chamber),
            lte(legislativeTerm.startDate, input.voteDate),
            or(
              gte(legislativeTerm.endDate, input.voteDate),
              isNull(legislativeTerm.endDate),
            ),
          ),
        )
        .orderBy(person.lastName, person.firstName);
    }),

  bulkUpsert: protectedProcedure
    .input(
      z.object({
        voteId: z.string().uuid(),
        records: z.array(
          z.object({
            legislativeTermId: z.string().uuid(),
            choice: z.enum([
              "POSITIVE",
              "NEGATIVE",
              "ABSTENTION",
              "ABSENT",
              "INCONCLUSIVE",
            ]),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results = [];

      for (const record of input.records) {
        // Buscar si ya existe un vote record para este voteId y legislativeTermId
        const [existing] = await ctx.db
          .select()
          .from(voteRecord)
          .where(
            and(
              eq(voteRecord.voteId, input.voteId),
              eq(voteRecord.legislativeTermId, record.legislativeTermId),
            ),
          );

        if (existing) {
          // Actualizar el registro existente
          const [updated] = await ctx.db
            .update(voteRecord)
            .set({ choice: record.choice })
            .where(eq(voteRecord.id, existing.id))
            .returning();
          if (updated) {
            results.push(updated);
          }
        } else {
          // Crear nuevo registro
          const [created] = await ctx.db
            .insert(voteRecord)
            .values({
              voteId: input.voteId,
              legislativeTermId: record.legislativeTermId,
              choice: record.choice,
            })
            .returning();
          if (created) {
            results.push(created);
          }
        }

        // Calculate metrics for each record (wrap in try/catch to avoid breaking vote saving)
        try {
          await calculateLegislativeMetric(ctx.db, {
            voteId: input.voteId,
            legislativeTermId: record.legislativeTermId,
          });
        } catch (error) {
          // Log error but don't fail the mutation
          console.error("Failed to calculate legislative metric:", error);
        }
      }

      return results;
    }),
});

