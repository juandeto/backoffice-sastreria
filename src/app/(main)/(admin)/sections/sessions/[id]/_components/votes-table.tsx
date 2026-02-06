"use client";

import { api } from "@/app/api/trpc/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/components/row-actions";
import { CreateVoteDialog } from "./create-vote-dialog";
import { EditVoteDialog } from "./edit-vote-dialog";
import * as React from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  getChamberLabel,
  getVoteTypeLabel,
  getResultVariant,
  getResultLabel,
} from "@/lib/utils/enums-to-labels";

export function VotesTable({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const utils = api.useUtils();
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedVoteId, setSelectedVoteId] = React.useState<string | null>(null);

  const { data: votes, isLoading } = api.votations.listBySessionId.useQuery({ sessionId });
  const { data: session } = api.sessions.getById.useQuery({ id: sessionId });

  const deleteVoteMutation = api.votations.delete.useMutation({
    onSuccess: () => {
      toast.success("Votación eliminada exitosamente");
      utils.votations.listBySessionId.invalidate({ sessionId });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al eliminar la votación", {
        description: error.message || "No se pudo eliminar la votación",
      });
    },
  });

  const handleEdit = (voteId: string) => {
    setSelectedVoteId(voteId);
    setEditDialogOpen(true);
  };

  const handleView = (voteId: string) => {
    setSelectedVoteId(voteId);
    setViewDialogOpen(true);
  };

  const handleManageVotes = (voteId: string) => {
    router.push(`/sections/sessions/${sessionId}/vote-records/${voteId}`);
  };

  const handleDelete = async (voteId: string) => {
    deleteVoteMutation.mutate({ id: voteId });
  };

  if (isLoading) {
    return <Skeleton className="h-50 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Votaciones</h2>
        <CreateVoteDialog 
          sessionId={sessionId} 
          sessionDate={session?.sessionDate}
          sessionChamber={session?.chamber}
        />
      </div>

      {!votes || votes.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground rounded-md border">
          No se encontraron votaciones.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha de votación</TableHead>
                <TableHead>Cámara</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Comentarios</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {votes.map((vote) => (
                <TableRow key={vote.id}>
                  <TableCell>
                    {vote.voteDate ? new Date(vote.voteDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>{getChamberLabel(vote.chamber)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getVoteTypeLabel(vote.voteType)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getResultVariant(vote.result)}>
                      {getResultLabel(vote.result)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    {vote.comments ? (
                      <p className="text-sm text-muted-foreground truncate" title={vote.comments}>
                        {vote.comments}
                      </p>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      onEdit={() => handleEdit(vote.id)}
                      onDeleteConfirm={() => handleDelete(vote.id)}
                      deleteTitle="Eliminar votación"
                      deleteDescription="¿Estás seguro de que deseas eliminar esta votación? Esta acción no se puede deshacer."
                      deleteIsLoading={deleteVoteMutation.isPending}
                      extraItems={
                        <>
                          <DropdownMenuItem onClick={() => handleView(vote.id)}>
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManageVotes(vote.id)}>
                            Gestionar votos
                          </DropdownMenuItem>
                        </>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {viewDialogOpen && selectedVoteId && (
        <EditVoteDialog
            voteId={selectedVoteId}
            mode="view"
            open={viewDialogOpen}
            onOpenChange={(open) => {
              setViewDialogOpen(open);
              if (!open) setSelectedVoteId(null);
            }}
            sessionChamber={session?.chamber}
          />
      )}
      {editDialogOpen && selectedVoteId && (
        <EditVoteDialog
          voteId={selectedVoteId}
          mode="edit"
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setSelectedVoteId(null);
          }}
          sessionChamber={session?.chamber}
        />
      )}
    </div>
  );
}
