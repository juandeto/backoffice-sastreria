import type { ColumnDef } from "@tanstack/react-table";

import { RowActions } from "@/components/row-actions";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { Province } from "./schema";

interface ProvinceColumnsProps {
  onEdit?: (province: Province) => void;
}

export const createProvinceColumns = ({
  onEdit,
}: ProvinceColumnsProps = {}): ColumnDef<Province>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "isoCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => row.original.isoCode ?? "-",
  },
  {
    accessorKey: "region",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Región" />,
    cell: ({ row }) => row.original.region ?? "-",
  },
  {
    accessorKey: "nationalDeputiesCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diputados Nacionales" />
    ),
    cell: ({ row }) => row.original.nationalDeputiesCount ?? "-",
  },
  {
    accessorKey: "senatorsCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Senadores" />
    ),
    cell: ({ row }) => row.original.senatorsCount ?? "-",
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

export const provinceColumns = createProvinceColumns();
