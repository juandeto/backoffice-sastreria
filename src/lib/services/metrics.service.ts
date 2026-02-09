import { eq, and, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { db } from "@/lib/db/drizzle";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@/lib/db/schema";
import {
  voteRecord,
  vote,
  legislativeTerm,
  officialVotePreferenceRule,
  legislativeMetric,
  chamberMetric,
  legislativeTermMetric,
} from "@/lib/db/schema";

type DbType = PostgresJsDatabase<typeof schema>;

const CALCULATION_VERSION = "v1";

type VoteChoice = "POSITIVE" | "NEGATIVE" | "ABSTENTION" | "ABSENT" | "INCONCLUSIVE";
type Chamber = "DEPUTY" | "SENATOR";

/**
 * Pure function to compute PAE score from a vote choice and preference rules.
 * Returns the value from the matching rule, or null if not found.
 */
function computePaeScore(
  choice: VoteChoice,
  rules: Array<{ choice: VoteChoice; value: string }>
): { paeScore: string; isInconclusive: boolean } {
  const rule = rules.find((r) => r.choice === choice);
  
  if (!rule) {
    return { paeScore: "0.00", isInconclusive: true };
  }

  // Special case: INCONCLUSIVE choice is always inconclusive
  if (choice === "INCONCLUSIVE") {
    return { paeScore: rule.value, isInconclusive: true };
  }

  return { paeScore: rule.value, isInconclusive: false };
}

/**
 * Computes IP score based on vote choice.
 * Returns 1.00 for present, 0.00 for absent.
 */
function computeIpScore(choice: VoteChoice): string {
  return choice === "ABSENT" ? "0.00" : "1.00";
}

/**
 * Applies a delta update to legislativeTermMetric.
 * Subtracts old values (if they existed and were conclusive) and adds new values (if conclusive).
 */
async function updateLegislativeTermMetric(
  dbInstance: DbType,
  params: {
    personId: string;
    legislativeTermId: string;
    chamber: Chamber;
    oldMetric: { paeScore: string; ipScore: string; isInconclusive: boolean } | null;
    newMetric: { paeScore: string; ipScore: string; isInconclusive: boolean };
  }
): Promise<void> {
  const { personId, legislativeTermId, chamber, oldMetric, newMetric } = params;

  // Get existing term metric or create defaults
  const [existing] = await dbInstance
    .select()
    .from(legislativeTermMetric)
    .where(
      and(
        eq(legislativeTermMetric.personId, personId),
        eq(legislativeTermMetric.legislativeTermId, legislativeTermId)
      )
    );

  let paeSum = existing?.paeSum ? parseFloat(existing.paeSum) : 0;
  let paeCount = existing?.paeCount ?? 0;
  let ipSum = existing?.ipSum ? parseFloat(existing.ipSum) : 0;
  let ipCount = existing?.ipCount ?? 0;

  // Subtract old values if they existed and were conclusive
  if (oldMetric && !oldMetric.isInconclusive) {
    paeSum -= parseFloat(oldMetric.paeScore);
    paeCount -= 1;
    ipSum -= parseFloat(oldMetric.ipScore);
    ipCount -= 1;
  }

  // Add new values if conclusive
  if (!newMetric.isInconclusive) {
    paeSum += parseFloat(newMetric.paeScore);
    paeCount += 1;
    ipSum += parseFloat(newMetric.ipScore);
    ipCount += 1;
  }

  // Calculate averages (guard against division by zero)
  const paeAverage = paeCount > 0 ? (paeSum / paeCount).toFixed(2) : "0.00";
  const ipAverage = ipCount > 0 ? (ipSum / ipCount).toFixed(2) : "0.00";

  // Upsert the term metric (check if exists, then update or insert)
  if (existing) {
    await dbInstance
      .update(legislativeTermMetric)
      .set({
        paeSum: paeSum.toFixed(4),
        paeCount,
        ipSum: ipSum.toFixed(4),
        ipCount,
        paeAverage,
        ipAverage,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(legislativeTermMetric.personId, personId),
          eq(legislativeTermMetric.legislativeTermId, legislativeTermId)
        )
      );
  } else {
    await dbInstance.insert(legislativeTermMetric).values({
      personId,
      legislativeTermId,
      chamber,
      paeSum: paeSum.toFixed(4),
      paeCount,
      ipSum: ipSum.toFixed(4),
      ipCount,
      paeAverage,
      ipAverage,
      updatedAt: new Date(),
    });
  }
}

/**
 * Calculates and upserts a single legislativeMetric, then delta-updates the legislativeTermMetric.
 */
export async function calculateLegislativeMetric(
  dbInstance: DbType,
  voteRecordData: { voteId: string; legislativeTermId: string }
): Promise<void> {
  const { voteId, legislativeTermId } = voteRecordData;

  // Get vote record
  const [record] = await dbInstance
    .select()
    .from(voteRecord)
    .where(
      and(
        eq(voteRecord.voteId, voteId),
        eq(voteRecord.legislativeTermId, legislativeTermId)
      )
    );

  if (!record) {
    // No vote record exists, skip calculation
    return;
  }

  // Get vote details (sessionId, chamber, officialVotePreferenceId)
  const [voteData] = await dbInstance
    .select()
    .from(vote)
    .where(eq(vote.id, voteId));

  if (!voteData) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Vote ${voteId} not found`,
    });
  }

  // Get legislative term (personId, chamber)
  const [term] = await dbInstance
    .select()
    .from(legislativeTerm)
    .where(eq(legislativeTerm.id, legislativeTermId));

  if (!term) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Legislative term ${legislativeTermId} not found`,
    });
  }

  // Get existing metric (if any) to track old values for delta update
  const [existingMetric] = await dbInstance
    .select()
    .from(legislativeMetric)
    .where(
      and(
        eq(legislativeMetric.voteId, voteId),
        eq(legislativeMetric.legislativeTermId, legislativeTermId)
      )
    );

  const oldMetric = existingMetric
    ? {
        paeScore: existingMetric.paeScore,
        ipScore: existingMetric.ipScore,
        isInconclusive: existingMetric.isInconclusive ?? false,
      }
    : null;

  // Calculate PAE score
  let paeScore = "0.00";
  let isInconclusive = true;

  if (voteData.officialVotePreferenceId) {
    // Get preference rules
    const rules = await dbInstance
      .select()
      .from(officialVotePreferenceRule)
      .where(eq(officialVotePreferenceRule.officialVotePreferenceId, voteData.officialVotePreferenceId));

    const computed = computePaeScore(record.choice as VoteChoice, rules);
    paeScore = computed.paeScore;
    isInconclusive = computed.isInconclusive;
  }

  // Calculate IP score
  const ipScore = computeIpScore(record.choice as VoteChoice);

  // Upsert legislative metric (check if exists, then update or insert)
  if (existingMetric) {
    await dbInstance
      .update(legislativeMetric)
      .set({
        paeScore,
        ipScore,
        isInconclusive,
        calculatedAt: new Date(),
        calculationVersion: CALCULATION_VERSION,
      })
      .where(
        and(
          eq(legislativeMetric.voteId, voteId),
          eq(legislativeMetric.legislativeTermId, legislativeTermId)
        )
      );
  } else {
    await dbInstance.insert(legislativeMetric).values({
      personId: term.personId,
      legislativeTermId,
      voteId,
      chamber: term.chamber as Chamber,
      paeScore,
      ipScore,
      isInconclusive,
      calculatedAt: new Date(),
      calculationVersion: CALCULATION_VERSION,
      sessionId: voteData.sessionId,
    });
  }

  // Update legislative term metric incrementally
  await updateLegislativeTermMetric(dbInstance, {
    personId: term.personId,
    legislativeTermId,
    chamber: term.chamber as Chamber,
    oldMetric,
    newMetric: { paeScore, ipScore, isInconclusive },
  });
}

/**
 * Recalculates all legislativeMetrics for every vote that uses a given officialVotePreference.
 */
export async function recalculateMetricsForPreference(
  dbInstance: DbType,
  officialVotePreferenceId: string
): Promise<void> {
  // Find all votes that use this preference
  const votes = await dbInstance
    .select({ id: vote.id })
    .from(vote)
    .where(eq(vote.officialVotePreferenceId, officialVotePreferenceId));

  // For each vote, find all vote records and recalculate metrics
  for (const voteItem of votes) {
    const voteRecords = await dbInstance
      .select({ legislativeTermId: voteRecord.legislativeTermId })
      .from(voteRecord)
      .where(eq(voteRecord.voteId, voteItem.id));

    for (const vr of voteRecords) {
      await calculateLegislativeMetric(dbInstance, {
        voteId: voteItem.id,
        legislativeTermId: vr.legislativeTermId,
      });
    }
  }
}

/**
 * Calculates the chamberMetric (IAO) for a session+chamber.
 * IAO = AVG(paeScore) WHERE isInconclusive = false AND ipScore = 1.00
 */
export async function calculateChamberMetric(
  dbInstance: DbType,
  sessionId: string,
  chamber: Chamber
): Promise<void> {
  // Calculate IAO: average of paeScore for conclusive, present legislators
  const [result] = await dbInstance
    .select({
      iao: sql<string>`COALESCE(AVG(${legislativeMetric.paeScore}::numeric), 0.00)`,
    })
    .from(legislativeMetric)
    .where(
      and(
        eq(legislativeMetric.sessionId, sessionId),
        eq(legislativeMetric.chamber, chamber),
        eq(legislativeMetric.isInconclusive, false),
        // eq(legislativeMetric.ipScore, "1.00") 
        // lo comento porque ABSENT puede tener value
      )
    );

  const iao = result?.iao ?? "0.00";

  // Upsert chamber metric (check if exists, then update or insert)
  const [existingChamberMetric] = await dbInstance
    .select()
    .from(chamberMetric)
    .where(
      and(
        eq(chamberMetric.sessionId, sessionId),
        eq(chamberMetric.chamber, chamber)
      )
    );

  if (existingChamberMetric) {
    await dbInstance
      .update(chamberMetric)
      .set({
        iao,
        calculatedAt: new Date(),
        calculationVersion: CALCULATION_VERSION,
      })
      .where(
        and(
          eq(chamberMetric.sessionId, sessionId),
          eq(chamberMetric.chamber, chamber)
        )
      );
  } else {
    await dbInstance.insert(chamberMetric).values({
      chamber,
      iao,
      calculatedAt: new Date(),
      sessionId,
      calculationVersion: CALCULATION_VERSION,
    });
  }
}
