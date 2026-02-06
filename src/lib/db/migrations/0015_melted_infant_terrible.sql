ALTER TABLE "vote" RENAME COLUMN "bill_id" TO "session_id";--> statement-breakpoint
ALTER TABLE "vote" DROP CONSTRAINT "vote_bill_id_bill_id_fk";
--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;