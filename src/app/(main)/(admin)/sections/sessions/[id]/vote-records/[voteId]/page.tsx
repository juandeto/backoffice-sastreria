"use client";

import { api } from "@/app/api/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import { VoteRecordsTable } from "./_components/vote-records-table";

export default function VoteRecordsPage({
  params,
}: {
  params: Promise<{ id: string; voteId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { id: billId, voteId } = resolvedParams;

  const { data: vote, isLoading, error } = api.votations.getById.useQuery({
    id: voteId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-50 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  if (error || !vote) {
    return (
      <div className="flex h-100 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Votación no encontrada</h2>
          <p className="text-muted-foreground">
            No se pudo cargar la información de la votación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Gestionar Votos</h2>
        <p className="text-muted-foreground">
          Gestione los votos individuales de los legisladores para esta votación.
        </p>
      </div>
      <VoteRecordsTable 
        voteId={voteId} 
        voteDate={vote.voteDate}
        chamber={vote.chamber} 
      />
    </div>
  );
}
