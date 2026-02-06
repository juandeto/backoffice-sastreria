import type { ColumnDef } from "@tanstack/react-table";

import { RowActions } from "@/components/row-actions";
import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { OfficialVotePreferenceRow } from "./types";
import { Badge } from "@/components/ui/badge";
import { getVoteChoiceLabel } from "@/lib/utils/enums-to-labels";

interface StrategyColumnsProps {
  onEdit?: (strategy: OfficialVotePreferenceRow) => void;
  onDelete?: (strategy: OfficialVotePreferenceRow) => void;
}

export const createStrategyColumns = ({
  onEdit,
  onDelete,
}: StrategyColumnsProps = {}): ColumnDef<OfficialVotePreferenceRow>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => row.original.description ?? "—",
  },
  {
    id: "priorities",
    header: "Prioridades",
    cell: ({ row }) => {
      const rules = row.original.rules ?? [];
      return (
        <div className="flex flex-wrap gap-1">
          {rules.map((rule, index) => (
            <Badge key={rule.id} variant="outline" className="text-xs">
              {index + 1}. {getVoteChoiceLabel(rule.choice)}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <RowActions
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          onDeleteConfirm={
            onDelete
              ? () => onDelete(row.original)
              : undefined
          }
          deleteTitle="Eliminar estrategia oficialista"
          deleteDescription="¿Estás seguro de que deseas eliminar esta estrategia? Esta acción no se puede deshacer."
          menuClassName="w-32"
        />
      </div>
    ),
  },
];

export const strategyColumns = createStrategyColumns();
