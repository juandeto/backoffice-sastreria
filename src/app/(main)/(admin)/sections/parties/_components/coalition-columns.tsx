import type { ColumnDef } from "@tanstack/react-table";

import { RowActions } from "@/components/row-actions";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { BlockCoalition } from "./schema";

interface CoalitionColumnsProps {
  onEdit?: (coalition: BlockCoalition) => void;
}

export const createCoalitionColumns = ({ onEdit }: CoalitionColumnsProps = {}): ColumnDef<BlockCoalition>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div 
          className="size-3 rounded-full" 
          style={{ backgroundColor: row.original.color }} 
        />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Inicio" />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <RowActions
        onEdit={onEdit ? () => onEdit(row.original) : undefined}
        menuClassName="w-40"
        onViewMore={`/sections/parties/coalition/${row.original.id}`}
      />
    ),
  },
];

export const coalitionColumns = createCoalitionColumns();
