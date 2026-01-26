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
CREATE TABLE "province" (
	"province_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"iso_code" varchar(10) NOT NULL,
	"region" varchar(100),
	"national_deputies_count" integer,
	"senators_count" integer,
	"senatorial_group" integer,
	"is_provincial_bicameral" boolean DEFAULT false,
	"has_ley_de_lemas" boolean DEFAULT false,
	"geojson" text,
	CONSTRAINT "province_name_unique" UNIQUE("name"),
	CONSTRAINT "province_iso_code_unique" UNIQUE("iso_code")
);
--> statement-breakpoint
ALTER TABLE "block" ADD COLUMN "party_id" uuid;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD COLUMN "province" integer;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD COLUMN "legislative_period_id" uuid;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD COLUMN "order_in_list" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "person" ADD COLUMN "original_province" integer;--> statement-breakpoint
ALTER TABLE "political_leader" ADD COLUMN "province" integer;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD CONSTRAINT "legislative_term_province_province_province_id_fk" FOREIGN KEY ("province") REFERENCES "public"."province"("province_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD CONSTRAINT "legislative_term_legislative_period_id_legislative_period_id_fk" FOREIGN KEY ("legislative_period_id") REFERENCES "public"."legislative_period"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_original_province_province_province_id_fk" FOREIGN KEY ("original_province") REFERENCES "public"."province"("province_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "political_leader" ADD CONSTRAINT "political_leader_province_province_province_id_fk" FOREIGN KEY ("province") REFERENCES "public"."province"("province_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term" DROP COLUMN "district";--> statement-breakpoint
ALTER TABLE "person" DROP COLUMN "original_district";