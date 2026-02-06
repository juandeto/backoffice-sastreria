import { pgEnum } from 'drizzle-orm/pg-core';

export const chamberEnum = pgEnum('chamber', ['DEPUTY', 'SENATOR']);

export const voteChoiceEnum = pgEnum('vote_choice', [
  'POSITIVE',
  'NEGATIVE',
  'ABSTENTION',
  'ABSENT',
  'INCONCLUSIVE',
]);

export const voteResultEnum = pgEnum('vote_result', ['APPROVED', 'REJECTED']);

export const billTypeEnum = pgEnum('bill_type', [
  'LAW',
  'RESOLUTION',
  'DECLARATION',
  'DECREE',
]);

export const voteTypeEnum = pgEnum('vote_type', [
  'GENERAL',
  'PARTICULAR',
  'MOTION',
]);

export const sessionResultEnum = pgEnum('session_result', [
  'OFFICIALISM_SUCCESS',
  'OFFICIALISM_FAILURE',
  'NO_QUORUM',
  'POSTPONED',
  'INCONCLUSIVE',
]);
