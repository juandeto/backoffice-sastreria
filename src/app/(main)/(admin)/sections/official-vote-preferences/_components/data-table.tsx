"use client";
"use no memo";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { createStrategyColumns } from "./columns";
import { api } from "@/app/api/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CreateStrategyDialog } from "./create-strategy-dialog";
import { EditStrategyDialog } from "./edit-strategy-dialog";
import type { OfficialVotePreferenceRow } from "./types";

export function DataTable() {
  const utils = api.useUtils();
  const { data, isLoading } = api.officialVotePreference.list.useQuery();
  const [tableData, setTableData] = React.useState<OfficialVotePreferenceRow[]>([]);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingStrategy, setEditingStrategy] =
    React.useState<OfficialVotePreferenceRow | null>(null);

  const deleteMutation = api.officialVotePreference.delete.useMutation({
    onSuccess: () => {
      toast.success("Estrategia oficialista eliminada exitosamente");
      utils.officialVotePreference.list.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar la estrategia");
    },
  });

  React.useEffect(() => {
    if (data) {
      setTableData(data as OfficialVotePreferenceRow[]);
    }
  }, [data]);

  const handleDelete = (strategy: OfficialVotePreferenceRow) => {
    deleteMutation.mutate({ id: strategy.id });
  };

  const columns = createStrategyColumns({
    onEdit: (strategy: OfficialVotePreferenceRow) =>
      setEditingStrategy(strategy),
    onDelete: handleDelete,
  });

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
            <span>Agregar Estrategia</span>
          </Button>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </div>

      <CreateStrategyDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {editingStrategy && (
        <EditStrategyDialog
          strategy={editingStrategy}
          open={!!editingStrategy}
          onOpenChange={(open) => !open && setEditingStrategy(null)}
        />
      )}
    </div>
  );
}
