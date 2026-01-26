ALTER TABLE "legislative_period" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "legislative_period" CASCADE;--> statement-breakpoint
ALTER TABLE "legislative_term" DROP CONSTRAINT "legislative_term_legislative_period_id_legislative_period_id_fk";
--> statement-breakpoint
ALTER TABLE "legislative_term" DROP COLUMN "legislative_period_id";