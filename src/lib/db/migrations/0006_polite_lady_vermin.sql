CREATE TABLE "legislative_period" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"mid_term" boolean DEFAULT false
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
ALTER TABLE "legislative_term" ALTER COLUMN "province" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "person" ALTER COLUMN "original_province" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "political_leader" ALTER COLUMN "province" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "block" ADD COLUMN "party_id" uuid;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD COLUMN "legislative_period_id" uuid;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD COLUMN "order_in_list" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD CONSTRAINT "legislative_term_legislative_period_id_legislative_period_id_fk" FOREIGN KEY ("legislative_period_id") REFERENCES "public"."legislative_period"("id") ON DELETE no action ON UPDATE no action;