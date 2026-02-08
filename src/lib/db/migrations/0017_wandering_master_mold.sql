CREATE TABLE "chamber_metric" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chamber" "chamber" NOT NULL,
	"iao" numeric(5, 2) NOT NULL,
	"calculated_at" timestamp DEFAULT now(),
	"session_id" uuid NOT NULL,
	"calculation_version" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legislative_metric" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"legislative_term_id" uuid NOT NULL,
	"vote_id" uuid NOT NULL,
	"chamber" "chamber" NOT NULL,
	"pae_score" numeric(5, 2) NOT NULL,
	"ip_score" numeric(5, 2) NOT NULL,
	"is_inconclusive" boolean DEFAULT false,
	"calculated_at" timestamp DEFAULT now(),
	"calculation_version" text NOT NULL,
	"session_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legislative_term_metric" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"legislative_term_id" uuid NOT NULL,
	"chamber" "chamber" NOT NULL,
	"pae_sum" numeric(10, 4) NOT NULL,
	"pae_count" integer NOT NULL,
	"ip_sum" numeric(10, 4) NOT NULL,
	"ip_count" integer NOT NULL,
	"pae_average" numeric(5, 2) NOT NULL,
	"ip_average" numeric(5, 2) NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "official_vote_preference_rule" ADD COLUMN "value" numeric(5, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "chamber_metric" ADD CONSTRAINT "chamber_metric_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_metric" ADD CONSTRAINT "legislative_metric_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_metric" ADD CONSTRAINT "legislative_metric_legislative_term_id_legislative_term_id_fk" FOREIGN KEY ("legislative_term_id") REFERENCES "public"."legislative_term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_metric" ADD CONSTRAINT "legislative_metric_vote_id_vote_id_fk" FOREIGN KEY ("vote_id") REFERENCES "public"."vote"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_metric" ADD CONSTRAINT "legislative_metric_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term_metric" ADD CONSTRAINT "legislative_term_metric_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term_metric" ADD CONSTRAINT "legislative_term_metric_legislative_term_id_legislative_term_id_fk" FOREIGN KEY ("legislative_term_id") REFERENCES "public"."legislative_term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "official_vote_preference_rule" DROP COLUMN "priority";--> statement-breakpoint
ALTER TABLE "vote_record" DROP COLUMN "contributed_to_quorum";