"use client";

import { api } from "@/app/api/trpc/react";
import { SessionHeader } from "./_components/session-header";
import { VotesTable } from "./_components/votes-table";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const { data: session, isLoading, error } = api.sessions.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-50 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-100 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Sesión no encontrada</h2>
          <p className="text-muted-foreground">No se pudo cargar la información de la sesión.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SessionHeader session={session} />
      <VotesTable sessionId={id} />
    </div>
  );
}
