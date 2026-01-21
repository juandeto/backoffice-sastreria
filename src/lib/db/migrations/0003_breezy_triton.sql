ALTER TABLE "block" DROP CONSTRAINT "block_legislative_term_id_legislative_term_id_fk";
--> statement-breakpoint
ALTER TABLE "block_coalition" DROP CONSTRAINT "block_coalition_block_id_block_id_fk";
--> statement-breakpoint
ALTER TABLE "block_coalition" DROP CONSTRAINT "block_coalition_legislative_term_id_legislative_term_id_fk";
--> statement-breakpoint
ALTER TABLE "block" ADD COLUMN "block_coalition_id" uuid;--> statement-breakpoint
ALTER TABLE "block_membership" ADD COLUMN "leader" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_block_coalition_id_block_coalition_id_fk" FOREIGN KEY ("block_coalition_id") REFERENCES "public"."block_coalition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block" DROP COLUMN "legislative_term_id";--> statement-breakpoint
ALTER TABLE "block_coalition" DROP COLUMN "block_id";--> statement-breakpoint
ALTER TABLE "block_coalition" DROP COLUMN "legislative_term_id";