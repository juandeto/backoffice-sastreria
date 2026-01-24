import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { Block } from "./schema";

export const blockColumns: ColumnDef<Block>[] = [
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
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
