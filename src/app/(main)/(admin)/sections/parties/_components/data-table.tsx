"use client";
"use no memo";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../../components/data-table/table-utils";

import { blockColumns } from "./block-columns";
import { coalitionColumns } from "./coalition-columns";
import type { Block, BlockCoalition } from "./schema";

interface DataTableProps {
  blocks: Block[];
  coalitions: BlockCoalition[];
}

export function DataTable({ blocks, coalitions }: DataTableProps) {
  const [activeTab, setActiveTab] = React.useState("blocks");

  const blockCols = withDndColumn(blockColumns);
  const coalitionCols = withDndColumn(coalitionColumns);

  const blockTable = useDataTableInstance({ 
    data: blocks, 
    columns: blockCols, 
    getRowId: (row) => row.id 
  });

  const coalitionTable = useDataTableInstance({ 
    data: coalitions, 
    columns: coalitionCols, 
    getRowId: (row) => row.id 
  });

  return (
    <Tabs defaultValue="blocks" onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="blocks">Bloques</TabsTrigger>
          <TabsTrigger value="coalitions">Interbloques</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {activeTab === "blocks" ? (
            <DataTableViewOptions table={blockTable} />
          ) : (
            <DataTableViewOptions table={coalitionTable} />
          )}
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" />
            <span>Agregar {activeTab === "blocks" ? "Bloque" : "Interbloque"}</span>
          </Button>
        </div>
      </div>

      <TabsContent value="blocks" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={blockTable} columns={blockCols} />
        </div>
        <DataTablePagination table={blockTable} />
      </TabsContent>

      <TabsContent value="coalitions" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={coalitionTable} columns={coalitionCols} />
        </div>
        <DataTablePagination table={coalitionTable} />
      </TabsContent>
    </Tabs>
  );
}
