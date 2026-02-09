"use client";
"use no memo";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../../components/data-table/table-utils";
import { dashboardColumns } from "./columns";
import { api } from "@/app/api/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { AddLegislatorModal } from "./add-legislator-modal";

export function DataTable() {
  const [chamber, setChamber] = React.useState<"DEPUTY" | "SENATOR">("DEPUTY");
  const { data, isLoading } = api.congressmen.list.useQuery({ chamber });
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const columns = withDndColumn(dashboardColumns);
  const table = useDataTableInstance({ 
    data: tableData, 
    columns, 
    getRowId: (row) => row.id.toString() 
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={chamber}
            onValueChange={(value) => {
              if (value === "DEPUTY" || value === "SENATOR") {
                setChamber(value);
              }
            }}
            variant="outline"
          >
            <ToggleGroupItem value="DEPUTY" aria-label="Diputados" className="data-[state=on]:bg-primary data-[state=on]:text-white">
              Diputados
            </ToggleGroupItem>
            <ToggleGroupItem value="SENATOR" aria-label="Senadores" className="data-[state=on]:bg-primary data-[state=on]:text-white">
              Senadores
            </ToggleGroupItem>
          </ToggleGroup>
          <DataTableViewOptions table={table} />
          <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 size-4" />
            <span>Agregar Legislador</span>
          </Button>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setTableData} />
        </div>
        <DataTablePagination table={table} />
      </div>

      <AddLegislatorModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
