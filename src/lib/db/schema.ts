import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  uuid,
  date,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  chamberEnum,
  voteResultEnum,
  voteTypeEnum,
  billTypeEnum,
  voteChoiceEnum,
  sessionResultEnum,
} from './enums';

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripeProductId: varchar('stripe_product_id', { length: 255 }),
  planName: varchar('plan_name', { length: 100 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const activityLogs = pgTable('activity_logs', {
  id: varchar('id').primaryKey(),
  userId: varchar('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  activityLogs: many(activityLogs),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
}

// usiness related tables

export const person = pgTable('person', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  birthDate: date('birth_date'),
  gender: text('gender'),
  original_province: integer('original_province').references(() => province.provinceId),
  instagram: text('instagram'),
  facebook: text('facebook'),
  twitter: text('twitter'),
  tik_tok: text('tik_tok'),
  biography: text('biography'),
});

export const legislativeTerm = pgTable('legislative_term', {
  id: uuid('id').primaryKey().defaultRandom(),
  personId: uuid('person_id')
    .notNull()
    .references(() => person.id),
  chamber: chamberEnum('chamber').notNull(),
  province: integer('province').references(() => province.provinceId),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
});

// export const party = pgTable('party', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   name: text('name').notNull(),
//   abbreviation: text('abbreviation').notNull(),
//   color: text('color').notNull(),
//   logo: text('logo'),
//   partyType: text('party_type'),
// });

// export const partyMembership = pgTable('party_membership', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   legislativeTermId: uuid('legislative_term_id')
//     .notNull()
//     .references(() => legislativeTerm.id),
//   partyId: uuid('party_id')
//     .notNull()
//     .references(() => party.id),
//   startDate: date('start_date').notNull(),
//   endDate: date('end_date'),
// });

export const block = pgTable('block', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  abbreviation: text('abbreviation').notNull(),
  chamber: chamberEnum('chamber').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  color: text('color').notNull(),
  block_coalition_id: uuid('block_coalition_id').references(() => block_coalition.id),
});

export const block_coalition = pgTable('block_coalition', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  leader: uuid('person').references(() => person.id),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  color: text('color').notNull(),
});

export const blockMembership = pgTable('block_membership', {
  id: uuid('id').primaryKey().defaultRandom(),
  legislativeTermId: uuid('legislative_term_id')
    .notNull()
    .references(() => legislativeTerm.id),
  blockId: uuid('block_id')
    .notNull()
    .references(() => block.id),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  leader: boolean().default(false)
});

// export const block_coalition_membership = pgTable('block_coalition_membership', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   legislativeTermId: uuid('legislative_term_id')
//     .notNull()
//     .references(() => legislativeTerm.id),
//   blockCoalitionId: uuid('block_coalition_id')
//     .notNull()
//     .references(() => block_coalition.id),
//   startDate: date('start_date').notNull(),
//   endDate: date('end_date'),
// });

// export const blockParty = pgTable('block_party', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   blockId: uuid('block_id')
//     .notNull()
//     .references(() => block.id),
//   partyId: uuid('party_id')
//     .notNull()
//     .references(() => party.id),
//   startDate: date('start_date').notNull(),
//   endDate: date('end_date'),
// });

export const politicalLeader = pgTable('political_leader', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').notNull(),
  type_district: text('type_district'),
  name_district: text('name_district'),
  province: integer('province').references(() => province.provinceId),
});

// Bills, Sessions, Votes

export const bill = pgTable('bill', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  fileNumber: text('file_number'),
  billType: billTypeEnum('bill_type').notNull(),
  introducedDate: date('introduced_date'),
  status: text('status'),
  summary: text('summary'),
  description: text('description'),
  link: text('link'),
});

export const vote = pgTable('vote', {
  id: uuid('id').primaryKey().defaultRandom(),

  billId: uuid('bill_id')
    .notNull()
    .references(() => bill.id),

  chamber: chamberEnum('chamber').notNull(),

  voteDate: timestamp('vote_date').notNull(),

  voteType: voteTypeEnum('vote_type').notNull(),

  officialVotePreferenceId: uuid('official_vote_preference_id').references(
    () => officialVotePreference.id,
  ),

  comments: text('comments'),

  result: voteResultEnum('result'),
});

export const voteRecord = pgTable('vote_record', {
  id: uuid('id').primaryKey().defaultRandom(),

  voteId: uuid('vote_id')
    .notNull()
    .references(() => vote.id),

  legislativeTermId: uuid('legislative_term_id')
    .notNull()
    .references(() => legislativeTerm.id),

  choice: voteChoiceEnum('choice').notNull(),
});

export const officialVotePreference = pgTable('official_vote_preference', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
});

export const officialVotePreferenceRule = pgTable(
  'official_vote_preference_rule',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    officialVotePreferenceId: uuid('official_vote_preference_id')
      .notNull()
      .references(() => officialVotePreference.id),

    priority: integer('priority').notNull(), // 1 = highest priority

    choice: voteChoiceEnum('choice').notNull(),
  },
);

export const province = pgTable("province", {
  provinceId: serial("province_id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  isoCode: varchar("iso_code", { length: 10 }).notNull().unique(),
  region: varchar("region", { length: 100 }),
  nationalDeputiesCount: integer("national_deputies_count"),
  senatorsCount: integer("senators_count"),
  senatorialGroup: integer("senatorial_group"),
  isProvincialBicameral: boolean("is_provincial_bicameral").default(false),
  hasLeyDeLemas: boolean("has_ley_de_lemas").default(false),
  geojson: text("geojson"), // Usamos text o jsonb dependiendo de tu necesidad
});