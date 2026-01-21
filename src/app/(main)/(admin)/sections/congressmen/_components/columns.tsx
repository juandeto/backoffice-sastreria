import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import { TableCellViewer } from "./table-cell-viewer";
import type { person } from "@/lib/db/schema";

type PersonRow = typeof person.$inferSelect;

export const dashboardColumns: ColumnDef<PersonRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableSorting: false,
  },
  {
    accessorKey: "birthDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nacimiento" />,
    cell: ({ row }) => row.original.birthDate ?? "—",
    enableSorting: false,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Genero" />,
    cell: ({ row }) => row.original.gender ?? "—",
    enableSorting: false,
  },
  {
    accessorKey: "original_province",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Provincia" />,
    cell: ({ row }) => row.original.original_province ?? "—",
    enableSorting: false,
  },
  {
    accessorKey: "instagram",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Instagram" />,
    cell: ({ row }) => row.original.instagram ?? "—",
    enableSorting: false,
  },
  {
    accessorKey: "facebook",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Facebook" />,
    cell: ({ row }) => row.original.facebook ?? "—",
    enableSorting: false,
  },
  {
    accessorKey: "twitter",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Twitter" />,
    cell: ({ row }) => row.original.twitter ?? "—",
    enableSorting: false,
  },
  {
    accessorKey: "tik_tok",
    header: ({ column }) => <DataTableColumnHeader column={column} title="TikTok" />,
    cell: ({ row }) => row.original.tik_tok ?? "—",
    enableSorting: false,
  },
  {
    accessorKey: "biography",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Biografia" />,
    cell: ({ row }) => (
      <span className="block max-w-[240px] truncate text-muted-foreground">{row.original.biography ?? "—"}</span>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Editar</DropdownMenuItem>
          <DropdownMenuItem>Duplicar</DropdownMenuItem>
          <DropdownMenuItem>Favorito</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];
