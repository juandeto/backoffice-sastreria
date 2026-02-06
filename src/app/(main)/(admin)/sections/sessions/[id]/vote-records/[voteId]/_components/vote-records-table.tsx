"use client";

import * as React from "react";
import { Save } from "lucide-react";
import { api } from "@/app/api/trpc/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { DataTable as DataTableNew } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

type VoteChoice = "POSITIVE" | "NEGATIVE" | "ABSTENTION" | "ABSENT" | "INCONCLUSIVE";

interface LegislatorRow {
  legislativeTermId: string;
  personId: string;
  firstName: string | null;
  lastName: string | null;
  chamber: "DEPUTY" | "SENATOR";
  provinceName: string | null;
  blockName: string | null;
  blockColor: string | null;
  voteRecordId: string | null;
  choice: VoteChoice | null;
}

interface VoteRecordRow extends LegislatorRow {
  existingChoice?: VoteChoice;
  selectedChoice?: VoteChoice;
}

const CHOICE_LABELS: Record<VoteChoice, string> = {
  POSITIVE: "A favor",
  NEGATIVE: "En contra",
  ABSTENTION: "Abstención",
  ABSENT: "Ausente",
  INCONCLUSIVE: "Inconcluso",
};

interface VoteRecordsTableProps {
  voteId: string;
  voteDate: Date | string;
  chamber: "DEPUTY" | "SENATOR";
}

interface VoteChoiceSelectProps {
  value?: VoteChoice;
  placeholder?: string;
  className?: string;
  onChange: (value: VoteChoice) => void;
}

function VoteChoiceSelect({
  value,
  placeholder = "Seleccionar voto",
  className,
  onChange,
}: VoteChoiceSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as VoteChoice)}>
      <SelectTrigger className={className ?? "w-45"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(CHOICE_LABELS).map(([choiceValue, label]) => (
          <SelectItem key={choiceValue} value={choiceValue}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function VoteRecordsTable({
  voteId,
  voteDate,
  chamber,
}: VoteRecordsTableProps) {
  // Convert voteDate to YYYY-MM-DD format for date comparison
  const getDateString = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const voteDateString = getDateString(voteDate);
  
  const { data: rows, isLoading: isLoadingRows } =
    api.voteRecords.listByVoteIdWithLegislators.useQuery({
      voteId,
      voteDate: voteDateString,
      chamber,
    });

  const utils = api.useUtils();
  const createMutation = api.voteRecords.create.useMutation({
    onSuccess: () => {
      toast.success("Voto guardado correctamente");
      void utils.voteRecords.listByVoteIdWithLegislators.invalidate({
        voteId,
        voteDate: voteDateString,
        chamber,
      });
    },
    onError: (error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  const updateMutation = api.voteRecords.update.useMutation({
    onSuccess: () => {
      toast.success("Voto actualizado correctamente");
      void utils.voteRecords.listByVoteIdWithLegislators.invalidate({
        voteId,
        voteDate: voteDateString,
        chamber,
      });
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });

  const bulkUpsertMutation = api.voteRecords.bulkUpsert.useMutation({
    onSuccess: () => {
      toast.success("Votos guardados correctamente");
      void utils.voteRecords.listByVoteIdWithLegislators.invalidate({
        voteId,
        voteDate: voteDateString,
        chamber,
      });
      setLocalChoices({});
    },
    onError: (error) => {
      toast.error(`Error al guardar: ${error.message}`);
    },
  });

  const [localChoices, setLocalChoices] = React.useState<
    Record<string, VoteChoice>
  >({});
  const [bulkChoice, setBulkChoice] = React.useState<VoteChoice | undefined>();
  // Combinar datos con selección local
  const tableData = React.useMemo<VoteRecordRow[]>(() => {
    if (!rows) return [];

    return rows.map((row) => ({
      ...row,
      existingChoice: row.choice ?? undefined,
      selectedChoice: localChoices[row.legislativeTermId],
    }));
  }, [rows, localChoices]);

  const handleChoiceChange = (legislativeTermId: string, choice: VoteChoice) => {
    setLocalChoices((prev) => ({
      ...prev,
      [legislativeTermId]: choice,
    }));
  };


  const handleSaveIndividual = async (row: VoteRecordRow) => {
    const choice = row.selectedChoice;
    if (!choice) {
      toast.error("Debe seleccionar una opción");
      return;
    }

    if (row.voteRecordId) {
      await updateMutation.mutateAsync({
        id: row.voteRecordId,
        choice,
      });
    } else {
      await createMutation.mutateAsync({
        voteId,
        legislativeTermId: row.legislativeTermId,
        choice,
      });
    }

    // Limpiar choice local después de guardar
    setLocalChoices((prev) => {
      const next = { ...prev };
      delete next[row.legislativeTermId];
      return next;
    });
  };


  const columns: ColumnDef<VoteRecordRow>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value);
              }}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
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
        accessorKey: "blockName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Bloque" />
        ),
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Provincia" />
        ),
        cell: ({ row }) => row.original.provinceName ?? "—",
      },
      {
        id: "choice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Voto" />
        ),
        cell: ({ row }) => {
          const { legislativeTermId, existingChoice, selectedChoice } = row.original;
          const currentChoice = selectedChoice ?? existingChoice;

          return (
            <VoteChoiceSelect
              value={currentChoice}
              onChange={(value) => handleChoiceChange(legislativeTermId, value)}
            />
          );
        },
      },
      {
        id: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Estado" />
        ),
        cell: ({ row }) => {
          const { existingChoice } = row.original;
          if (existingChoice) {
            return (
              <Badge variant="default" className="bg-green-600">
                Guardado
              </Badge>
            );
          }
          return <Badge variant="outline">Sin guardar</Badge>;
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const { selectedChoice, existingChoice } = row.original;
          const hasChanges = selectedChoice && selectedChoice !== existingChoice;
          const isSaving =
            createMutation.isPending || updateMutation.isPending;

          return (
            <Button
              size="sm"
              onClick={() => handleSaveIndividual(row.original)}
              disabled={!hasChanges || isSaving}
            >
              <Save className="mr-2 size-4" />
              Guardar
            </Button>
          );
        },
      },
    ],
    [localChoices, createMutation.isPending, updateMutation.isPending],
  );

  const table = useDataTableInstance({
    data: tableData,
    columns,
    getRowId: (row) => row.legislativeTermId,
  });

  const selectedRowIds = React.useMemo(() => {
    return new Set(
      table.getSelectedRowModel().rows.map((row) => row.original.legislativeTermId),
    );
  }, [table, table.getSelectedRowModel().rows]);

  const handleBulkChoiceChange = (choice: VoteChoice) => {
    if (selectedRowIds.size === 0) {
      toast.error("Debe seleccionar al menos un legislador");
      return;
    }

    setBulkChoice(choice);
    setLocalChoices((prev) => {
      const next = { ...prev };
      for (const legislativeTermId of selectedRowIds) {
        next[legislativeTermId] = choice;
      }
      return next;
    });
  };

  const handleBulkSave = async () => {
    if (selectedRowIds.size === 0) {
      toast.error("Debe seleccionar al menos un legislador");
      return;
    }

    const records = Array.from(selectedRowIds)
      .map((legislativeTermId) => {
        const choice = localChoices[legislativeTermId];
        if (!choice) return null;
        return {
          legislativeTermId,
          choice,
        };
      })
      .filter((r): r is { legislativeTermId: string; choice: VoteChoice } => r !== null);

    if (records.length === 0) {
      toast.error("Debe seleccionar una opción para los legisladores seleccionados");
      return;
    }

    await bulkUpsertMutation.mutateAsync({
      voteId,
      records,
    });
  };

  if (isLoadingRows) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  const hasSelectedRows = selectedRowIds.size > 0;
  const isBulkSaving = bulkUpsertMutation.isPending;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasSelectedRows && (
            <VoteChoiceSelect
              value={bulkChoice}
              placeholder="Asignar a seleccionados"
              className="w-52"
              onChange={handleBulkChoiceChange}
            />
          )}
          {hasSelectedRows && (
            <Button
              onClick={handleBulkSave}
              disabled={isBulkSaving}
              variant="default"
            >
              <Save className="mr-2 size-4" />
              Guardar seleccionados ({selectedRowIds.size})
            </Button>
          )}
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew table={table} columns={columns} />
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
