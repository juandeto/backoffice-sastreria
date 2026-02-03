"use client";
"use no memo";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../../components/data-table/table-utils";

import { createBlockColumns } from "./block-columns";
import { createCoalitionColumns } from "./coalition-columns";
import { createPartyColumns } from "./party-columns";
import type { Block, BlockCoalition, Party } from "./schema";
import { CreateBlockDialog } from "./create-block-dialog";
import { CreateCoalitionDialog } from "./create-coalition-dialog";
import { CreatePartyDialog } from "./create-party-dialog";
import { EditBlockDialog } from "./edit-block-dialog";
import { EditCoalitionDialog } from "./edit-coalition-dialog";
import { EditPartyDialog } from "./edit-party-dialog";

interface DataTableProps {
  blocks: Block[];
  coalitions: BlockCoalition[];
  parties: Party[];
}

export function DataTable({ blocks, coalitions, parties }: DataTableProps) {
  const [activeTab, setActiveTab] = React.useState("blocks");
  const [editingBlock, setEditingBlock] = React.useState<Block | null>(null);
  const [editingCoalition, setEditingCoalition] = React.useState<BlockCoalition | null>(null);
  const [editingParty, setEditingParty] = React.useState<Party | null>(null);

  const blockCols = withDndColumn(
    createBlockColumns({
      onEdit: (block: Block) => setEditingBlock(block),
    })
  );
  const coalitionCols = withDndColumn(
    createCoalitionColumns({
      onEdit: (coalition) => setEditingCoalition(coalition),
    })
  );
  const partyCols = withDndColumn(
    createPartyColumns({
      onEdit: (party) => setEditingParty(party),
    })
  );

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

  const partyTable = useDataTableInstance({ 
    data: parties, 
    columns: partyCols, 
    getRowId: (row) => row.id 
  });

  return (
    <Tabs defaultValue="blocks" onValueChange={setActiveTab} className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="blocks">Bloques</TabsTrigger>
          <TabsTrigger value="coalitions">Interbloques</TabsTrigger>
          <TabsTrigger value="parties">Partidos</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {activeTab === "blocks" && <DataTableViewOptions table={blockTable} />}
          {activeTab === "coalitions" && <DataTableViewOptions table={coalitionTable} />}
          {activeTab === "parties" && <DataTableViewOptions table={partyTable} />}
          {activeTab === "blocks" && <CreateBlockDialog />}
          {activeTab === "coalitions" && <CreateCoalitionDialog />}
          {activeTab === "parties" && <CreatePartyDialog />}
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

      <TabsContent value="parties" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={partyTable} columns={partyCols} />
        </div>
        <DataTablePagination table={partyTable} />
      </TabsContent>

      {editingBlock && (
        <EditBlockDialog
          block={editingBlock}
          open={!!editingBlock}
          onOpenChange={(open) => !open && setEditingBlock(null)}
        />
      )}
      {editingCoalition && (
        <EditCoalitionDialog
          coalition={editingCoalition}
          open={!!editingCoalition}
          onOpenChange={(open) => !open && setEditingCoalition(null)}
        />
      )}
      {editingParty && (
        <EditPartyDialog
          party={editingParty}
          open={!!editingParty}
          onOpenChange={(open) => !open && setEditingParty(null)}
        />
      )}
    </Tabs>
  );
}
