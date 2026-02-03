"use client";

import * as React from "react";
import { api } from "@/app/api/trpc/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/row-actions";
import { EditTermDialog } from "./edit-term-dialog";
import { CreateTermDialog } from "./create-term-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function TermsTable({ personId }: { personId: string }) {
  const [editingTermId, setEditingTermId] = React.useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const utils = api.useUtils();

  const { data: terms, isLoading } = api.legislativeTerms.listByPersonId.useQuery({ personId });
  const { data: partiesData } = api.parties.list.useQuery({ take: 100 });

  const deleteTermMutation = api.legislativeTerms.delete.useMutation({
    onSuccess: () => {
      utils.legislativeTerms.listByPersonId.invalidate({ personId });
    },
  });

  const handleDelete = async (termId: string) => {
    await deleteTermMutation.mutateAsync({ id: termId });
  };

  const editingTerm = terms?.find((term) => term.id === editingTermId);

  // Encontrar el ID del partido actual por nombre
  const currentPartyId = React.useMemo(() => {
    if (!editingTerm?.elected_in_party || !partiesData) return "";
    const party = partiesData.find((p) => p.name === editingTerm.elected_in_party);
    return party?.id ?? "";
  }, [editingTerm?.elected_in_party, partiesData]);

  if (isLoading) {
    return <Skeleton className="h-50 w-full" />;
  }

  return (
    <>
      {/* Terms toolbar */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="size-4" />
          Agregar mandato
        </Button>
      </div>

      {!terms || terms.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground">
          No se encontraron mandatos.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cámara</TableHead>
                <TableHead>Provincia</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Partido Electo</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terms.map((term) => (
                <TableRow key={term.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {term.chamber === "DEPUTY" ? "Diputados" : "Senadores"}
                    </Badge>
                  </TableCell>
                  <TableCell>{term.provinceName || "—"}</TableCell>
                  <TableCell>{term.startDate}</TableCell>
                  <TableCell>{term.endDate || "Actualidad"}</TableCell>
                  <TableCell>{term.order_in_list || "—"}</TableCell>
                  <TableCell>{term.elected_in_party || "—"}</TableCell>
                  <TableCell>
                    <RowActions
                      onEdit={() => setEditingTermId(term.id)}
                      onDeleteConfirm={() => handleDelete(term.id)}
                      deleteTitle="Eliminar mandato"
                      deleteDescription="¿Estás seguro de que deseas eliminar este mandato? Esta acción no se puede deshacer."
                      deleteIsLoading={deleteTermMutation.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateTermDialog
        personId={personId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {editingTerm && (
        <EditTermDialog
          term={{
            id: editingTerm.id,
            chamber: editingTerm.chamber,
            provinceId: editingTerm.provinceId,
            startDate: editingTerm.startDate,
            endDate: editingTerm.endDate,
            order_in_list: editingTerm.order_in_list,
            notes: editingTerm.notes ?? undefined,
            partyId: currentPartyId,
          }}
          personId={personId}
          open={editingTermId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingTermId(null);
            }
          }}
        />
      )}
    </>
  );
}
