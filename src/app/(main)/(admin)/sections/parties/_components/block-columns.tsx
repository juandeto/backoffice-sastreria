import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/row-actions";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { Block } from "./schema";

interface BlockColumnsProps {
  onEdit?: (block: Block) => void;
}

export const createBlockColumns = ({ onEdit }: BlockColumnsProps = {}): ColumnDef<Block>[] => [
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
    accessorKey: "abbreviation",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sigla" />,
  },
  {
    accessorKey: "chamber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cámara" />,
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.chamber === "DEPUTY" ? "Diputados" : "Senadores"}
      </Badge>
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
        menuClassName="w-32"
      />
    ),
  },
];

export const blockColumns = createBlockColumns();
