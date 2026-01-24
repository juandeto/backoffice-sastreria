import { DataTable } from "./_components/data-table";
import { CreateBlockDialog } from "./_components/create-block-dialog";
import type { Block, BlockCoalition } from "./_components/schema";

// Mock data for initial development
const mockBlocks: Block[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "La Libertad Avanza",
    abbreviation: "LLA",
    chamber: "DEPUTY",
    startDate: "2023-12-10",
    color: "#800080",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Unión por la Patria",
    abbreviation: "UP",
    chamber: "DEPUTY",
    startDate: "2023-12-10",
    color: "#00aae4",
  }
];

const mockCoalitions: BlockCoalition[] = [
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Juntos por el Cambio",
    startDate: "2019-12-10",
    color: "#ffcc00",
  }
];

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex justify-end">
        <CreateBlockDialog />
      </div>
      <DataTable blocks={mockBlocks} coalitions={mockCoalitions} />
    </div>
  );
}
