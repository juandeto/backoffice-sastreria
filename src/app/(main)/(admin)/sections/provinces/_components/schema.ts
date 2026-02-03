import type { province } from "@/lib/db/schema";

type ProvinceFromDb = typeof province.$inferSelect;

export type Province = Pick<
  ProvinceFromDb,
  "name" | "isoCode" | "region" | "nationalDeputiesCount" | "senatorsCount"
> & {
  id: string;
};
