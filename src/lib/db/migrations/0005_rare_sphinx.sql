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
ALTER TABLE "legislative_term" ADD COLUMN "province" uuid;--> statement-breakpoint
ALTER TABLE "person" ADD COLUMN "original_province" uuid;--> statement-breakpoint
ALTER TABLE "political_leader" ADD COLUMN "province" uuid;--> statement-breakpoint
ALTER TABLE "legislative_term" ADD CONSTRAINT "legislative_term_province_province_province_id_fk" FOREIGN KEY ("province") REFERENCES "public"."province"("province_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person" ADD CONSTRAINT "person_original_province_province_province_id_fk" FOREIGN KEY ("original_province") REFERENCES "public"."province"("province_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "political_leader" ADD CONSTRAINT "political_leader_province_province_province_id_fk" FOREIGN KEY ("province") REFERENCES "public"."province"("province_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legislative_term" DROP COLUMN "district";--> statement-breakpoint
ALTER TABLE "person" DROP COLUMN "original_district";