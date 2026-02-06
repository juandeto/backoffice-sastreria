import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  officialVotePreference,
  officialVotePreferenceRule,
} from "@/lib/db/schema";

const voteChoiceSchema = z.enum([
  "POSITIVE",
  "NEGATIVE",
  "ABSTENTION",
  "ABSENT",
  "INCONCLUSIVE",
]);

const ruleSchema = z.object({
  choice: voteChoiceSchema,
  priority: z.number().int().min(1).max(5),
});

export const officialVotePreferenceRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const preferences = await ctx.db.select().from(officialVotePreference);
    const rules = await ctx.db.select().from(officialVotePreferenceRule);

    return preferences.map((pref) => ({
      ...pref,
      rules: rules
        .filter((rule) => rule.officialVotePreferenceId === pref.id)
        .sort((a, b) => a.priority - b.priority),
    }));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .select()
        .from(officialVotePreference)
        .where(eq(officialVotePreference.id, input.id));
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Official vote preference not found",
        });
      }

      const rules = await ctx.db
        .select()
        .from(officialVotePreferenceRule)
        .where(eq(officialVotePreferenceRule.officialVotePreferenceId, input.id));

      return {
        ...result,
        rules: rules.sort((a, b) => a.priority - b.priority),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(officialVotePreference)
        .values(input)
        .returning();
      return result;
    }),

  createWithRules: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        rules: z.array(ruleSchema).length(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { rules, ...preferenceData } = input;

      const [preference] = await ctx.db
        .insert(officialVotePreference)
        .values(preferenceData)
        .returning();

      if (!preference) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create official vote preference",
        });
      }

      const rulesToInsert = rules.map((rule) => ({
        officialVotePreferenceId: preference.id,
        choice: rule.choice,
        priority: rule.priority,
      }));

      await ctx.db.insert(officialVotePreferenceRule).values(rulesToInsert);

      const insertedRules = await ctx.db
        .select()
        .from(officialVotePreferenceRule)
        .where(
          eq(
            officialVotePreferenceRule.officialVotePreferenceId,
            preference.id,
          ),
        );

      return {
        ...preference,
        rules: insertedRules.sort((a, b) => a.priority - b.priority),
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [result] = await ctx.db
        .update(officialVotePreference)
        .set(data)
        .where(eq(officialVotePreference.id, id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Official vote preference not found",
        });
      }
      return result;
    }),

  updateWithRules: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        rules: z.array(ruleSchema).length(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, rules, ...preferenceData } = input;

      const [preference] = await ctx.db
        .update(officialVotePreference)
        .set(preferenceData)
        .where(eq(officialVotePreference.id, id))
        .returning();

      if (!preference) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Official vote preference not found",
        });
      }

      await ctx.db
        .delete(officialVotePreferenceRule)
        .where(
          eq(officialVotePreferenceRule.officialVotePreferenceId, id),
        );

      const rulesToInsert = rules.map((rule) => ({
        officialVotePreferenceId: id,
        choice: rule.choice,
        priority: rule.priority,
      }));

      await ctx.db.insert(officialVotePreferenceRule).values(rulesToInsert);

      const insertedRules = await ctx.db
        .select()
        .from(officialVotePreferenceRule)
        .where(eq(officialVotePreferenceRule.officialVotePreferenceId, id));

      return {
        ...preference,
        rules: insertedRules.sort((a, b) => a.priority - b.priority),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(officialVotePreferenceRule)
        .where(
          eq(officialVotePreferenceRule.officialVotePreferenceId, input.id),
        );

      const [result] = await ctx.db
        .delete(officialVotePreference)
        .where(eq(officialVotePreference.id, input.id))
        .returning();
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Official vote preference not found",
        });
      }
      return { success: true };
    }),
});

