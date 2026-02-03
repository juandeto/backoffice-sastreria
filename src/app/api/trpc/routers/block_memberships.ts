import { z } from "zod";
import { eq, desc, and, or, isNull, lte, gte, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { block_membership, block, legislativeTerm } from "@/lib/db/schema";

export const blockMembershipsRouter = createTRPCRouter({
  listByPersonId: protectedProcedure
    .input(z.object({ personId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: block_membership.id,
          legislativeTermId: block_membership.legislativeTermId,
          blockId: block_membership.blockId,
          startDate: block_membership.startDate,
          endDate: block_membership.endDate,
          blockName: block.name,
          blockColor: block.color,
          leader: block_membership.leader,
        })
        .from(block_membership)
        .innerJoin(block, eq(block_membership.blockId, block.id))
        .where(eq(block_membership.personId, input.personId))
        .orderBy(desc(block_membership.startDate));
    }),

  create: protectedProcedure
    .input(
      z.object({
        personId: z.string().uuid(),
        legislativeTermId: z.string().uuid(),
        blockId: z.string().uuid(),
        startDate: z.string(),
        endDate: z.string().optional(),
        leader: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate that the legislativeTermId belongs to the provided personId
      const [term] = await ctx.db
        .select()
        .from(legislativeTerm)
        .where(
          and(
            eq(legislativeTerm.id, input.legislativeTermId),
            eq(legislativeTerm.personId, input.personId)
          )
        );

      if (!term) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El mandato legislativo no pertenece a la persona especificada",
        });
      }

      // Validate that date ranges don't overlap with existing memberships for the same person/term
      const newEndDate = input.endDate ?? "9999-12-31";

      const overlappingMemberships = await ctx.db
        .select()
        .from(block_membership)
        .where(
          and(
            eq(block_membership.personId, input.personId),
            eq(block_membership.legislativeTermId, input.legislativeTermId),
            // Two periods overlap if: A_start <= B_end AND B_start <= A_end
            and(
              lte(block_membership.startDate, newEndDate),
              or(
                isNull(block_membership.endDate),
                gte(block_membership.endDate, input.startDate)
              )
            )
          )
        );

      if (overlappingMemberships.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Las fechas de inicio y fin no pueden solaparse con otra membresía existente para el mismo mandato",
        });
      }

      const [result] = await ctx.db
        .insert(block_membership)
        .values({
          personId: input.personId,
          legislativeTermId: input.legislativeTermId,
          blockId: input.blockId,
          startDate: input.startDate,
          endDate: input.endDate ?? null,
          leader: input.leader ?? false,
        })
        .returning();

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al crear la membresía de bloque",
        });
      }

      return result;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        personId: z.string().uuid().optional(),
        legislativeTermId: z.string().uuid().optional(),
        blockId: z.string().uuid().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional().nullable(),
        leader: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Get the current membership to validate updates
      const [currentMembership] = await ctx.db
        .select()
        .from(block_membership)
        .where(eq(block_membership.id, id));

      if (!currentMembership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Membresía de bloque no encontrada",
        });
      }

      // If personId or legislativeTermId are being updated, validate the relationship
      const finalPersonId = data.personId ?? currentMembership.personId;
      const finalLegislativeTermId =
        data.legislativeTermId ?? currentMembership.legislativeTermId;

      if (data.personId || data.legislativeTermId) {
        const [term] = await ctx.db
          .select()
          .from(legislativeTerm)
          .where(
            and(
              eq(legislativeTerm.id, finalLegislativeTermId),
              eq(legislativeTerm.personId, finalPersonId)
            )
          );

        if (!term) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "El mandato legislativo no pertenece a la persona especificada",
          });
        }
      }

      // If dates are being updated, validate no overlaps with other memberships
      const finalStartDate = data.startDate ?? currentMembership.startDate;
      const finalEndDate =
        data.endDate !== undefined
          ? data.endDate ?? null
          : currentMembership.endDate;

      if (data.startDate !== undefined || data.endDate !== undefined) {
        const newEndDate = finalEndDate ?? "9999-12-31";

        const overlappingMemberships = await ctx.db
          .select()
          .from(block_membership)
          .where(
            and(
              eq(block_membership.personId, finalPersonId),
              eq(block_membership.legislativeTermId, finalLegislativeTermId),
              ne(block_membership.id, id), // Exclude current membership
              // Two periods overlap if: A_start <= B_end AND B_start <= A_end
              and(
                lte(block_membership.startDate, newEndDate),
                or(
                  isNull(block_membership.endDate),
                  gte(block_membership.endDate, finalStartDate)
                )
              )
            )
          );

        if (overlappingMemberships.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Las fechas de inicio y fin no pueden solaparse con otra membresía existente para el mismo mandato",
          });
        }
      }

      // Prepare update data
      const updateData: {
        personId?: string;
        legislativeTermId?: string;
        blockId?: string;
        startDate?: string;
        endDate?: string | null;
        leader?: boolean;
      } = {};

      if (data.personId !== undefined) updateData.personId = data.personId;
      if (data.legislativeTermId !== undefined)
        updateData.legislativeTermId = data.legislativeTermId;
      if (data.blockId !== undefined) updateData.blockId = data.blockId;
      if (data.startDate !== undefined) updateData.startDate = data.startDate;
      if (data.endDate !== undefined) updateData.endDate = data.endDate;
      if (data.leader !== undefined) updateData.leader = data.leader;

      const [result] = await ctx.db
        .update(block_membership)
        .set(updateData)
        .where(eq(block_membership.id, id))
        .returning();

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error al actualizar la membresía de bloque",
        });
      }

      return result;
    }),
});
