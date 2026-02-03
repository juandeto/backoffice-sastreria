"use client";

import { api } from "@/app/api/trpc/react";
import { LegislatorHeader } from "./_components/legislator-header";
import { DetailTabs } from "./_components/detail-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";

export default function CongressmanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  
  const { data: person, isLoading, error } = api.congressmen.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-50 w-full" />
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="flex h-100 items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Legislador no encontrado</h2>
          <p className="text-muted-foreground">No se pudo cargar la información del legislador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <LegislatorHeader person={person} />
      <DetailTabs personId={id} />
    </div>
  );
}
