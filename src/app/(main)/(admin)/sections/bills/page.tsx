import { DataTable } from "./_components/data-table";
import { getServerCaller } from "@/app/api/trpc/server";

export default async function Page() {
  const caller = await getServerCaller();
  const bills = await caller.bills.list();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <DataTable bills={bills} />
    </div>
  );
}
