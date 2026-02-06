import { createTRPCRouter } from "./init";
import { personsRouter } from "./routers/persons";
import { legislativeTermsRouter } from "./routers/legislativeTerms";
import { partiesRouter } from "./routers/parties";
import { blocksRouter } from "./routers/blocks";
import { blockCoalitionsRouter } from "./routers/blockCoalitions";
import { billsRouter } from "./routers/bills";
import { votationsRouter } from "./routers/votations";
import { voteRecordsRouter } from "./routers/voteRecords";
import { politicalLeadersRouter } from "./routers/politicalLeaders";
import { officialVotePreferenceRouter } from "./routers/officialVotePreference";
import { usersRouter } from "./routers/users";
import { congressmenRouter } from "./routers/congressmen";
import { provincesRouter } from "./routers/provinces";
import { blockMembershipsRouter } from "./routers/block_memberships";
import { sessionsRouter } from "./routers/sessions";

export const appRouter = createTRPCRouter({
  persons: personsRouter,
  legislativeTerms: legislativeTermsRouter,
  parties: partiesRouter,
  blocks: blocksRouter,
  blockCoalitions: blockCoalitionsRouter,
  bills: billsRouter,
  votations: votationsRouter,
  voteRecords: voteRecordsRouter,
  politicalLeaders: politicalLeadersRouter,
  officialVotePreference: officialVotePreferenceRouter,
  users: usersRouter,
  congressmen: congressmenRouter,
  provinces: provincesRouter,
  blockMemberships: blockMembershipsRouter,
  sessions: sessionsRouter,
});

export type AppRouter = typeof appRouter;

