"use client";

import * as React from "react";
import { api } from "@/app/api/trpc/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";
import { RowActions } from "@/components/row-actions";
import { CreateBlockMembershipDialog } from "./create-block-membership-dialog";
import { EditBlockMembershipDialog } from "./edit-block-membership-dialog";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type BlockMembership = RouterOutputs["blockMemberships"]["listByPersonId"][number];

export function BlockHistoryTable({ personId }: { personId: string }) {
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedMembership, setSelectedMembership] = React.useState<BlockMembership | null>(null);

  const { data: history, isLoading } = api.blockMemberships.listByPersonId.useQuery({ personId });

  const handleEdit = (item: BlockMembership) => {
    setSelectedMembership(item);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return <Skeleton className="h-50 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="size-4" />
          Crear membresía
        </Button>
      </div>

      {!history || history.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground rounded-md border">
          No se encontró historial de bloques.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bloque</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="w-25"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="size-2 rounded-full" 
                        style={{ backgroundColor: item.blockColor }} 
                      />
                      <span className="font-medium">{item.blockName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.startDate}</TableCell>
                  <TableCell>{item.endDate || "Actualidad"}</TableCell>
                  <TableCell>
                    {item.leader && (
                      <Badge variant="secondary" className="gap-1">
                        <Star className="size-3 fill-current" />
                        Presidente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      onEdit={() => handleEdit(item)}
                      menuClassName="w-32"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateBlockMembershipDialog
        personId={personId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {selectedMembership && (
        <EditBlockMembershipDialog
          membership={selectedMembership}
          personId={personId}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  );
}
