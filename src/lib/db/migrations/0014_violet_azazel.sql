CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chamber" "chamber" NOT NULL,
	"session_date" date NOT NULL,
	"session_type" text,
	"title" text,
	"description" text,
	"quorum_required" integer NOT NULL,
	"quorum_achieved" integer,
	"has_quorum" boolean,
	"status" text NOT NULL,
	"source" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "vote_record" DROP COLUMN "type";