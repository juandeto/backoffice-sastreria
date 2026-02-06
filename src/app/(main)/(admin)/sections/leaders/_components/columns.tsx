import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { RowActions } from "@/components/row-actions";
import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";
import type { PoliticalLeaderRow } from "./types";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LeaderColumnsProps {
  onEdit?: (leader: PoliticalLeaderRow) => void;
  onView?: (leader: PoliticalLeaderRow) => void;
  provinces?: Array<{ id: string; name: string }>;
}

export const createLeaderColumns = ({
  onEdit,
  onView,
  provinces = [],
}: LeaderColumnsProps = {}): ColumnDef<PoliticalLeaderRow>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre completo" />
    ),
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
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
  },
  {
    accessorKey: "type_district",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Distrito" />
    ),
    cell: ({ row }) => row.original.type_district ?? "—",
  },
  {
    accessorKey: "name_district",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre de Distrito" />
    ),
    cell: ({ row }) => row.original.name_district ?? "—",
  },
  {
    accessorKey: "province",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provincia" />
    ),
    cell: ({ row }) => {
      const provinceId = row.original.province;
      if (!provinceId) return "—";
      const province = provinces.find(
        (p) => p.id === String(provinceId)
      );
      return province?.name ?? "—";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {onView && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => onView(row.original)}
                >
                  <Eye className="size-4" />
                  <span className="sr-only">Ver detalles</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Ver detalles</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <RowActions
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          menuClassName="w-32"
        />
      </div>
    ),
  },
];

export const leaderColumns = createLeaderColumns();
