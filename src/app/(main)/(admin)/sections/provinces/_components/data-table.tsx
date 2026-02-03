"use client";
"use no memo";

import * as React from "react";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../../components/data-table/table-utils";
import { createProvinceColumns } from "./columns";
import type { Province } from "./schema";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  provinces: Province[];
}

export function DataTable({ provinces }: DataTableProps) {
  const [tableData, setTableData] = React.useState<Province[]>([]);

  React.useEffect(() => {
    if (provinces) {
      setTableData(provinces);
    }
  }, [provinces]);

  const columns = withDndColumn(createProvinceColumns());
  const table = useDataTableInstance({
    data: tableData,
    columns,
    getRowId: (row) => row.id,
  });

  if (!provinces || provinces.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setTableData} />
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
