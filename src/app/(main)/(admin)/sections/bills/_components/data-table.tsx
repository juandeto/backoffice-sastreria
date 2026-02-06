"use client";
"use no memo";

import * as React from "react";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../../components/data-table/table-utils";

import { createBillColumns } from "./columns";
import type { Bill } from "./schema";
import { CreateBillDialog } from "./create-bill-dialog";
import { EditBillDialog } from "./edit-bill-dialog";
import { api } from "@/app/api/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DataTableProps {
  bills: Bill[];
}

export function DataTable({ bills }: DataTableProps) {
  const [editingBill, setEditingBill] = React.useState<Bill | null>(null);
  const router = useRouter();

  const deleteBillMutation = api.bills.delete.useMutation({
    onSuccess: () => {
      toast.success("Proyecto eliminado exitosamente");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al eliminar el proyecto", {
        description: error.message || "No se pudo eliminar el proyecto",
      });
    },
  });

  const handleDelete = async (bill: Bill) => {
    await deleteBillMutation.mutateAsync({ id: bill.id });
  };

  const columns = withDndColumn(
    createBillColumns({
      onEdit: (bill: Bill) => setEditingBill(bill),
      onDelete: handleDelete,
      deleteIsLoading: deleteBillMutation.isPending,
    })
  );

  const table = useDataTableInstance({
    data: bills,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <CreateBillDialog />
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </div>

      {editingBill && (
        <EditBillDialog
          bill={editingBill}
          open={!!editingBill}
          onOpenChange={(open) => !open && setEditingBill(null)}
        />
      )}
    </div>
  );
}
