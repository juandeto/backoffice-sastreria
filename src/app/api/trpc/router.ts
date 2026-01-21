import { createTRPCRouter } from "./init";
import { personsRouter } from "./routers/persons";
import { legislativeTermsRouter } from "./routers/legislativeTerms";
import { partiesRouter } from "./routers/parties";
import { blocksRouter } from "./routers/blocks";
import { billsRouter } from "./routers/bills";
import { votationsRouter } from "./routers/votations";
import { voteRecordsRouter } from "./routers/voteRecords";
import { politicalLeadersRouter } from "./routers/politicalLeaders";
import { officialVotePreferenceRouter } from "./routers/officialVotePreference";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  persons: personsRouter,
  legislativeTerms: legislativeTermsRouter,
  parties: partiesRouter,
  blocks: blocksRouter,
  bills: billsRouter,
  votations: votationsRouter,
  voteRecords: voteRecordsRouter,
  politicalLeaders: politicalLeadersRouter,
  officialVotePreference: officialVotePreferenceRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

