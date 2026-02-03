import type { ColumnDef } from "@tanstack/react-table";

import { RowActions } from "@/components/row-actions";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { Party } from "./schema";

interface PartyColumnsProps {
  onEdit?: (party: Party) => void;
}

export const createPartyColumns = ({ onEdit }: PartyColumnsProps = {}): ColumnDef<Party>[] => [
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
    accessorKey: "partyType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de Partido" />,
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

export const partyColumns = createPartyColumns();
