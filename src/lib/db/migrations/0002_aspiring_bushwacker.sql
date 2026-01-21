CREATE TABLE "block_coalition" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_id" uuid NOT NULL,
	"name" text NOT NULL,
	"person" uuid,
	"start_date" date NOT NULL,
	"end_date" date,
	"color" text NOT NULL,
	"legislative_term_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "block" ADD COLUMN "legislative_term_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "block_coalition" ADD CONSTRAINT "block_coalition_block_id_block_id_fk" FOREIGN KEY ("block_id") REFERENCES "public"."block"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_coalition" ADD CONSTRAINT "block_coalition_person_person_id_fk" FOREIGN KEY ("person") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block_coalition" ADD CONSTRAINT "block_coalition_legislative_term_id_legislative_term_id_fk" FOREIGN KEY ("legislative_term_id") REFERENCES "public"."legislative_term"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_legislative_term_id_legislative_term_id_fk" FOREIGN KEY ("legislative_term_id") REFERENCES "public"."legislative_term"("id") ON DELETE no action ON UPDATE no action;