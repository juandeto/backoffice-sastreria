ALTER TABLE "block" ALTER COLUMN "chamber" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "legislative_term" ALTER COLUMN "chamber" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "chamber" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."chamber";--> statement-breakpoint
CREATE TYPE "public"."chamber" AS ENUM('DEPUTY', 'SENATOR');--> statement-breakpoint
ALTER TABLE "block" ALTER COLUMN "chamber" SET DATA TYPE "public"."chamber" USING "chamber"::"public"."chamber";--> statement-breakpoint
ALTER TABLE "legislative_term" ALTER COLUMN "chamber" SET DATA TYPE "public"."chamber" USING "chamber"::"public"."chamber";--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "chamber" SET DATA TYPE "public"."chamber" USING "chamber"::"public"."chamber";