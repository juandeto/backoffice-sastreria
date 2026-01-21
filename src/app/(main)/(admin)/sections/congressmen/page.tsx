import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import data from "./_components/data.json";
import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";
import type { person } from "@/lib/db/schema";

type DbPerson = typeof person.$inferSelect;
type PersonSeed = Omit<DbPerson, "birthDate"> & { birthDate: string | null };

export default function Page() {
  const rawData: PersonSeed[] = data;
  const seededData: DbPerson[] = rawData;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* <SectionCards />
      <ChartAreaInteractive /> */}
      <DataTable data={seededData} />
    </div>
  );
}
