"use client";
"use no memo";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../../components/data-table/table-utils";
import { createLeaderColumns } from "./columns";
import { api } from "@/app/api/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLeaderDialog } from "./create-leader-dialog";
import { EditLeaderDialog } from "./edit-leader-dialog";
import { ViewLeaderDrawer } from "./view-leader-drawer";
import type { PoliticalLeaderRow } from "./types";

export function DataTable() {
  const { data, isLoading } = api.politicalLeaders.list.useQuery();
  const { data: provinces } = api.provinces.list.useQuery({});
  const [tableData, setTableData] = React.useState<PoliticalLeaderRow[]>([]);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingLeader, setEditingLeader] =
    React.useState<PoliticalLeaderRow | null>(null);
  const [viewingLeader, setViewingLeader] =
    React.useState<PoliticalLeaderRow | null>(null);

  React.useEffect(() => {
    if (data) {
      setTableData(data as PoliticalLeaderRow[]);
    }
  }, [data]);

  const columns = withDndColumn(
    createLeaderColumns({
      onEdit: (leader: PoliticalLeaderRow) => setEditingLeader(leader),
      onView: (leader: PoliticalLeaderRow) => setViewingLeader(leader),
      provinces: provinces as Array<{ id: string; name: string }> | undefined,
    })
  );

  const table = useDataTableInstance({
    data: tableData,
    columns,
    getRowId: (row) => row.id.toString(),
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
          <DataTableViewOptions table={table} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 size-4" />
            <span>Agregar Líder Político</span>
          </Button>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew
            dndEnabled
            table={table}
            columns={columns}
            onReorder={setTableData}
          />
        </div>
        <DataTablePagination table={table} />
      </div>

      <CreateLeaderDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {editingLeader && (
        <EditLeaderDialog
          leader={editingLeader}
          open={!!editingLeader}
          onOpenChange={(open) => !open && setEditingLeader(null)}
        />
      )}

      {viewingLeader && (
        <ViewLeaderDrawer
          leader={viewingLeader}
          open={!!viewingLeader}
          onOpenChange={(open) => !open && setViewingLeader(null)}
        />
      )}
    </div>
  );
}
