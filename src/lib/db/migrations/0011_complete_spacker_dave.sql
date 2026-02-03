-- Step 1: Add column as nullable first
ALTER TABLE "block_membership" ADD COLUMN "person_id" uuid;

-- Step 2: Populate person_id from legislative_term
UPDATE "block_membership" 
SET "person_id" = (
  SELECT "person_id" 
  FROM "legislative_term" 
  WHERE "legislative_term"."id" = "block_membership"."legislative_term_id"
);

-- Step 3: Make it NOT NULL (now that all rows have values)
ALTER TABLE "block_membership" ALTER COLUMN "person_id" SET NOT NULL;

-- Step 4: Add the foreign key constraint
ALTER TABLE "block_membership" ADD CONSTRAINT "block_membership_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;