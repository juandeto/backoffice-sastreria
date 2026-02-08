import type { RouterOutputs } from "@/app/api/trpc/react";

export type OfficialVotePreferenceRow = RouterOutputs["officialVotePreference"]["list"][number];

export type OfficialVotePreferenceRule = OfficialVotePreferenceRow["rules"][number];

export const voteChoices = [
    "POSITIVE",
    "NEGATIVE",
    "ABSTENTION",
    "ABSENT",
    "INCONCLUSIVE",
  ] as const;
  
export  type VoteChoice = (typeof voteChoices)[number];