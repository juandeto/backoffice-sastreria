import type { RouterOutputs } from "@/app/api/trpc/react";

export type OfficialVotePreferenceRow = RouterOutputs["officialVotePreference"]["list"][number];

export type OfficialVotePreferenceRule = OfficialVotePreferenceRow["rules"][number];
