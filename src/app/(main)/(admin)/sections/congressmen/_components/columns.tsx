import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Eye } from "lucide-react";
import Link from "next/link";

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
import type { CongressmanListRow } from "./types";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const dashboardColumns: ColumnDef<CongressmanListRow>[] = [
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
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre completo" />,
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return (
        <div className="font-medium">
          {lastName}, {firstName}
        </div>
      );
    },
  },
  {
    accessorKey: "chamber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cámara" />,
    cell: ({ row }) => {
      const chamber = row.original.chamber;
      return (
        <Badge variant="outline">
          {chamber === "DEPUTY" ? "Diputados" : "Senadores"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "blockName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bloque" />,
    cell: ({ row }) => {
      const { blockName, blockColor } = row.original;
      if (!blockName) return "—";
      return (
        <div className="flex items-center gap-2">
          {blockColor && (
            <div 
              className="size-2 rounded-full" 
              style={{ backgroundColor: blockColor }} 
            />
          )}
          <span>{blockName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "provinceName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Provincia" />,
    cell: ({ row }) => row.original.provinceName ?? "—",
  },
  {
    accessorKey: "termStartDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inicio Mandato" />,
    cell: ({ row }) => row.original.termStartDate,
  },
  {
    accessorKey: "termEndDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fin Mandato" />,
    cell: ({ row }) => row.original.termEndDate ?? "—",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/sections/congressmen/${row.original.id}`} className="cursor-pointer">
              <Eye className="mr-2 size-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <span>Ver más</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  },
];
