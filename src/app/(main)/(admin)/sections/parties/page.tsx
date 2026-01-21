import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import data from "./_components/data.json";
import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";
import { CreateBlockDialog } from "./_components/create-block-dialog";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* <SectionCards />
      <ChartAreaInteractive /> */}
      <div className="flex justify-end">
        <CreateBlockDialog />
      </div>
      <DataTable data={data} />
    </div>
  );
}
