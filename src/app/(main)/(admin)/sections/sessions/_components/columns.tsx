import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/row-actions";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { Session } from "./schema";
import { getChamberLabel } from "@/lib/utils/enums-to-labels";

interface SessionColumnsProps {
  onEdit?: (session: Session) => void;
  onDelete?: (session: Session) => void | Promise<void>;
  deleteIsLoading?: boolean;
}

const statusLabels: Record<string, string> = {
  scheduled: "Programada",
  started: "Iniciada",
  failed_no_quorum: "Sin quórum",
  closed: "Cerrada",
};

const getStatusVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "outline";
  switch (status) {
    case "scheduled":
      return "outline";
    case "started":
      return "default";
    case "failed_no_quorum":
      return "destructive";
    case "closed":
      return "secondary";
    default:
      return "outline";
  }
};

export const createSessionColumns = ({ onEdit, onDelete, deleteIsLoading }: SessionColumnsProps = {}): ColumnDef<Session>[] => [
  {
    accessorKey: "sessionDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
    cell: ({ row }) => row.original.sessionDate ?? "—",
  },
  {
    accessorKey: "chamber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cámara" />,
    cell: ({ row }) => <Badge variant="outline">{getChamberLabel(row.original.chamber)}</Badge>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Título" />,
    cell: ({ row }) => <span className="font-medium">{row.original.title ?? "—"}</span>,
  },
  {
    accessorKey: "sessionType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => row.original.sessionType ?? "—",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => (
      <Badge variant={getStatusVariant(row.original.status)}>
        {statusLabels[row.original.status ?? ""] ?? row.original.status ?? "—"}
      </Badge>
    ),
  },
  {
    accessorKey: "quorumRequired",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quórum Requerido" />,
    cell: ({ row }) => row.original.quorumRequired ?? "—",
  },
  {
    accessorKey: "quorumAchieved",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quórum Alcanzado" />,
    cell: ({ row }) => row.original.quorumAchieved ?? "—",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <RowActions
        onEdit={onEdit ? () => onEdit(row.original) : undefined}
        onDeleteConfirm={onDelete ? () => onDelete(row.original) : undefined}
        deleteTitle="Eliminar sesión"
        deleteDescription="¿Estás seguro de que deseas eliminar esta sesión? Esta acción no se puede deshacer."
        deleteIsLoading={deleteIsLoading}
        onViewMore={`/sections/sessions/${row.original.id}`}
      />
    ),
  },
];
