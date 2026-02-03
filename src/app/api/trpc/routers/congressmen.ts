import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import { 
  person, 
  legislativeTerm, 
  block_membership, 
  block, 
  province, 
  voteRecord, 
  vote, 
  bill,
  party
} from "@/lib/db/schema";

const createLegislatorSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  original_province: z.number().optional(),
  profession: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  tik_tok: z.string().optional(),
  biography: z.string().optional(),
  chamber: z.enum(["DEPUTY", "SENATOR"]),
  termProvince: z.number().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  order_in_list: z.number().min(1, "El orden en la lista es requerido"),
  notes: z.string().optional(),
  partyId: z.string().uuid().optional(),
  blockId: z.string().uuid().optional(),
});

export const congressmenRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    // Subquery to get the latest legislative term for each person
    const latestTermSubquery = ctx.db
      .select({
        personId: legislativeTerm.personId,
        latestStartDate: sql<string>`max(${legislativeTerm.startDate})`.as("latest_start_date"),
      })
      .from(legislativeTerm)
      .groupBy(legislativeTerm.personId)
      .as("latest_term_sub");

    // Main query joining person with their latest term and related info
    const results = await ctx.db
      .select({
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        chamber: legislativeTerm.chamber,
        termStartDate: legislativeTerm.startDate,
        termEndDate: legislativeTerm.endDate,
        provinceName: province.name,
        blockName: block.name,
        blockColor: block.color,
      })
      .from(person)
      .innerJoin(
        legislativeTerm,
        eq(person.id, legislativeTerm.personId)
      )
      .innerJoin(
        latestTermSubquery,
        and(
          eq(legislativeTerm.personId, latestTermSubquery.personId),
          eq(legislativeTerm.startDate, latestTermSubquery.latestStartDate)
        )
      )
      .leftJoin(
        province,
        eq(legislativeTerm.province, province.provinceId)
      )
      .leftJoin(
        block_membership,
        and(
          eq(block_membership.legislativeTermId, legislativeTerm.id),
          sql`${block_membership.endDate} IS NULL OR ${block_membership.endDate} > now()`
        )
      )
      .leftJoin(
        block,
        eq(block_membership.blockId, block.id)
      )
      .orderBy(person.lastName, person.firstName);

    return results;
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

      // Also get the current province name if applicable
      const [provinceInfo] = await ctx.db
        .select({ name: province.name })
        .from(province)
        .where(eq(province.provinceId, result.original_province ?? -1));

      return {
        ...result,
        provinceName: provinceInfo?.name ?? null,
      };
    }),
    
  getVotesByPersonId: protectedProcedure
    .input(z.object({ personId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // Join voteRecord -> vote -> bill
      // We need to filter by legislative terms belonging to this person
      const personTerms = ctx.db
        .select({ id: legislativeTerm.id })
        .from(legislativeTerm)
        .where(eq(legislativeTerm.personId, input.personId));

      return ctx.db
        .select({
          id: voteRecord.id,
          choice: voteRecord.choice,
          voteDate: vote.voteDate,
          voteType: vote.voteType,
          billTitle: bill.title,
        })
        .from(voteRecord)
        .innerJoin(vote, eq(voteRecord.voteId, vote.id))
        .innerJoin(bill, eq(vote.billId, bill.id))
        .where(sql`${voteRecord.legislativeTermId} IN (${personTerms})`)
        .orderBy(desc(vote.voteDate));
    }),

  getBlockHistoryByPersonId: protectedProcedure
    .input(z.object({ personId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const personTerms = ctx.db
        .select({ id: legislativeTerm.id })
        .from(legislativeTerm)
        .where(eq(legislativeTerm.personId, input.personId));

      return ctx.db
        .select({
          id: block_membership.id,
          startDate: block_membership.startDate,
          endDate: block_membership.endDate,
          blockName: block.name,
          blockColor: block.color,
          leader: block_membership.leader,
        })
        .from(block_membership)
        .innerJoin(block, eq(block_membership.blockId, block.id))
        .where(sql`${block_membership.legislativeTermId} IN (${personTerms})`)
        .orderBy(desc(block_membership.startDate));
    }),

  create: protectedProcedure
    .input(createLegislatorSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        firstName,
        lastName,
        birthDate,
        gender,
        original_province,
        profession,
        instagram,
        facebook,
        twitter,
        tik_tok,
        biography,
        chamber,
        termProvince,
        startDate,
        endDate,
        order_in_list,
        notes,
        blockId,
      } = input;

      // Create person
      const [newPerson] = await ctx.db
        .insert(person)
        .values({
          firstName,
          lastName,
          birthDate: birthDate ?? null,
          gender: gender ?? null,
          original_province: original_province ?? null,
          profession: profession ?? null,
          instagram: instagram ?? null,
          facebook: facebook ?? null,
          twitter: twitter ?? null,
          tik_tok: tik_tok ?? null,
          biography: biography ?? null,
        })
        .returning();

      if (!newPerson) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al crear la persona" });
      }

      // Create legislative term
      const [newTerm] = await ctx.db
        .insert(legislativeTerm)
        .values({
          personId: newPerson.id,
          chamber,
          province: termProvince ?? null,
          startDate,
          endDate: endDate ?? null,
          order_in_list,
          notes: notes ?? null,
        })
        .returning();

      if (!newTerm) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al crear el mandato legislativo" });
      }

      // Create block membership if blockId provided
      if (blockId) {
        await ctx.db
          .insert(block_membership)
          .values({
            legislativeTermId: newTerm.id,
            blockId,
            startDate,
            endDate: endDate ?? null,
            leader: false,
          });
      }

      return { person: newPerson, term: newTerm };
    }),

  listProvinces: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        provinceId: province.provinceId,
        name: province.name,
      })
      .from(province)
      .orderBy(province.name);
  }),

  listParties: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: party.id,
        name: party.name,
        abbreviation: party.abbreviation,
        color: party.color,
      })
      .from(party)
      .orderBy(party.name);
  }),

  listBlocks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: block.id,
        name: block.name,
        abbreviation: block.abbreviation,
        color: block.color,
        chamber: block.chamber,
      })
      .from(block)
      .orderBy(block.name);
  }),
});
