import { DataTable } from "./_components/data-table";
import { getServerCaller } from "@/app/api/trpc/server";

export default async function Page() {
  const caller = await getServerCaller();
  
  const [blocks, coalitions, parties] = await Promise.all([
    caller.blocks.list(),
    caller.blockCoalitions.list(),
    caller.parties.list(),
  ]);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <DataTable blocks={blocks} coalitions={coalitions} parties={parties} />
    </div>
  );
}
