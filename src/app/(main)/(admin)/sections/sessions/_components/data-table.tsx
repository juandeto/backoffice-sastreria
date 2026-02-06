"use client";
"use no memo";

import * as React from "react";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../../components/data-table/table-utils";

import { createSessionColumns } from "./columns";
import type { Session } from "./schema";
import { CreateSessionDialog } from "./create-session-dialog";
import { EditSessionDialog } from "./edit-session-dialog";
import { api } from "@/app/api/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DataTableProps {
  sessions: Session[];
}

export function DataTable({ sessions }: DataTableProps) {
  const [editingSession, setEditingSession] = React.useState<Session | null>(null);
  const router = useRouter();

  const deleteSessionMutation = api.sessions.delete.useMutation({
    onSuccess: () => {
      toast.success("Sesión eliminada exitosamente");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al eliminar la sesión", {
        description: error.message || "No se pudo eliminar la sesión",
      });
    },
  });

  const handleDelete = async (session: Session) => {
    await deleteSessionMutation.mutateAsync({ id: session.id });
  };

  const columns = withDndColumn(
    createSessionColumns({
      onEdit: (session: Session) => setEditingSession(session),
      onDelete: handleDelete,
      deleteIsLoading: deleteSessionMutation.isPending,
    })
  );

  const table = useDataTableInstance({
    data: sessions,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
          <CreateSessionDialog />
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </div>

      {editingSession && (
        <EditSessionDialog
          session={editingSession}
          open={!!editingSession}
          onOpenChange={(open) => !open && setEditingSession(null)}
        />
      )}
    </div>
  );
}
