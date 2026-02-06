import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/row-actions";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { Bill } from "./schema";

interface BillColumnsProps {
  onEdit?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void | Promise<void>;
  deleteIsLoading?: boolean;
}

const billTypeLabels: Record<string, string> = {
  LAW: "Ley",
  RESOLUTION: "Resolución",
  DECLARATION: "Declaración",
  DECREE: "Decreto",
};

export const createBillColumns = ({ onEdit, onDelete, deleteIsLoading }: BillColumnsProps = {}): ColumnDef<Bill>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "fileNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expediente" />,
    cell: ({ row }) => row.original.fileNumber ?? "—",
  },
  {
    accessorKey: "billType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => (
      <Badge variant="outline">
        {billTypeLabels[row.original.billType] ?? row.original.billType}
      </Badge>
    ),
  },
  {
    accessorKey: "introducedDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de Presentación" />,
    cell: ({ row }) => row.original.introducedDate ?? "—",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => row.original.status ?? "—",
  },
  {
    accessorKey: "summary",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Resumen" />,
    cell: ({ row }) => {
      const summary = row.original.summary;
      if (!summary) return "—";
      return (
        <p className="max-w-60 overflow-hidden text-ellipsis truncate" title={summary}>
          {summary}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <RowActions
        onEdit={onEdit ? () => onEdit(row.original) : undefined}
        onDeleteConfirm={onDelete ? () => onDelete(row.original) : undefined}
        deleteTitle="Eliminar proyecto"
        deleteDescription="¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
        deleteIsLoading={deleteIsLoading}
        onViewMore={`/sections/bills/${row.original.id}`}
      />
    ),
  },
];
