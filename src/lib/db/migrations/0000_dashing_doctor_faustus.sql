CREATE TYPE "public"."bill_type" AS ENUM('LAW', 'RESOLUTION', 'DECLARATION', 'DECREE');--> statement-breakpoint
CREATE TYPE "public"."chamber" AS ENUM('DEPUTIES', 'SENATE');--> statement-breakpoint
CREATE TYPE "public"."session_result" AS ENUM('OFFICIALISM_SUCCESS', 'OFFICIALISM_FAILURE', 'NO_QUORUM', 'POSTPONED', 'INCONCLUSIVE');--> statement-breakpoint
CREATE TYPE "public"."vote_choice" AS ENUM('POSITIVE', 'NEGATIVE', 'ABSTENTION', 'ABSENT');--> statement-breakpoint
CREATE TYPE "public"."vote_result" AS ENUM('APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."vote_type" AS ENUM('GENERAL', 'PARTICULAR', 'MOTION');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"action" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45)
);
--> statement-breakpoint
CREATE TABLE "bill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"file_number" text,
	"bill_type" "bill_type" NOT NULL,
	"introduced_date" date,
	"status" text,
	"summary" text,
	"description" text,
	"link" text
);
--> statement-breakpoint
CREATE TABLE "block" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"abbreviation" text NOT NULL,
	"chamber" "chamber" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "block_membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legislative_term_id" uuid NOT NULL,
	"block_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date
);
--> statement-breakpoint
CREATE TABLE "block_party" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" uuid NOT NULL,
	"party_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date
);
--> statement-breakpoint
CREATE TABLE "legislative_term" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"chamber" "chamber" NOT NULL,
	"district" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date
);
--> statement-breakpoint
CREATE TABLE "official_vote_preference" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "official_vote_preference_rule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"official_vote_preference_id" uuid NOT NULL,
	"priority" integer NOT NULL,
	"choice" "vote_choice" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"abbreviation" text NOT NULL,
	"color" text NOT NULL,
	"logo" text,
	"party_type" text
);
--> statement-breakpoint
CREATE TABLE "party_membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legislative_term_id" uuid NOT NULL,
	"party_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"birth_date" date,
	"gender" text,
	"original_district" text,
	"instagram" text,
	"facebook" text,
	"twitter" text,
	"tik_tok" text,
	"biography" text
);
--> statement-breakpoint
CREATE TABLE "political_leader" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" text NOT NULL,
	"type_district" text,
	"name_district" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"stripe_product_id" varchar(255),
	"plan_name" varchar(100),
	"subscription_status" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bill_id" uuid NOT NULL,
	"chamber" "chamber" NOT NULL,
	"vote_date" timestamp NOT NULL,
	"vote_type" "vote_type" NOT NULL,
	"official_vote_preference_id" uuid,
	"comments" text,
	"result" "vote_result"
);
--> statement-breakpoint
CREATE TABLE "vote_record" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vote_id" uuid NOT NULL,
	"legislative_term_id" uuid NOT NULL,
	"choice" "vote_choice" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_membership" ADD CONSTRAINT "block_membership_legislative_term_id_legislative_term_id_fk" FOREIGN KEY ("legislative_term_id") REFERENCES "public"."legislative_term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_membership" ADD CONSTRAINT "block_membership_block_id_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."block"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_party" ADD CONSTRAINT "block_party_block_id_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."block"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_party" ADD CONSTRAINT "block_party_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD CONSTRAINT "legislative_term_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_vote_preference_rule" ADD CONSTRAINT "official_vote_preference_rule_official_vote_preference_id_official_vote_preference_id_fk" FOREIGN KEY ("official_vote_preference_id") REFERENCES "public"."official_vote_preference"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_membership" ADD CONSTRAINT "party_membership_legislative_term_id_legislative_term_id_fk" FOREIGN KEY ("legislative_term_id") REFERENCES "public"."legislative_term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_membership" ADD CONSTRAINT "party_membership_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_bill_id_bill_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bill"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_official_vote_preference_id_official_vote_preference_id_fk" FOREIGN KEY ("official_vote_preference_id") REFERENCES "public"."official_vote_preference"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_record" ADD CONSTRAINT "vote_record_vote_id_vote_id_fk" FOREIGN KEY ("vote_id") REFERENCES "public"."vote"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_record" ADD CONSTRAINT "vote_record_legislative_term_id_legislative_term_id_fk" FOREIGN KEY ("legislative_term_id") REFERENCES "public"."legislative_term"("id") ON DELETE no action ON UPDATE no action;