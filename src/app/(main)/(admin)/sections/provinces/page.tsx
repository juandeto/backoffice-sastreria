import { DataTable } from "./_components/data-table";
import { getServerCaller } from "@/app/api/trpc/server";

export default async function ProvincesPage() {
  const caller = await getServerCaller();
  const provinces = await caller.provinces.list();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <DataTable provinces={provinces} />
    </div>
  );
}