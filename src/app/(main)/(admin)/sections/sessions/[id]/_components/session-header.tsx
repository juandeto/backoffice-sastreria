"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";
import { getChamberLabel } from "@/lib/utils/enums-to-labels";

type SessionDetail = inferRouterOutputs<AppRouter>["sessions"]["getById"];

const statusLabels: Record<string, string> = {
  scheduled: "Programada",
  started: "Iniciada",
  failed_no_quorum: "Sin quórum",
  closed: "Cerrada",
};

const getStatusVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "outline";
  switch (status) {
    case "scheduled":
      return "outline";
    case "started":
      return "default";
    case "failed_no_quorum":
      return "destructive";
    case "closed":
      return "secondary";
    default:
      return "outline";
  }
};

export function SessionHeader({ session }: { session: SessionDetail }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start gap-6 space-y-0">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-3xl font-bold">
              {session.title || `Sesión ${session.sessionDate ? new Date(session.sessionDate).toLocaleDateString() : ""}`}
            </CardTitle>
            <Badge variant={getStatusVariant(session.status)}>
              {statusLabels[session.status ?? ""] ?? session.status ?? "—"}
            </Badge>
            <Badge variant="outline">
              {getChamberLabel(session.chamber)}
            </Badge>
          </div>
          {session.description && (
            <CardDescription className="text-base">
              {session.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Fecha de Sesión</p>
            <p className="font-medium">{session.sessionDate || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p className="font-medium">{session.sessionType || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quórum Requerido</p>
            <p className="font-medium">{session.quorumRequired ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quórum Alcanzado</p>
            <p className="font-medium">{session.quorumAchieved ?? "—"}</p>
          </div>
        </div>
        {session.source && (
          <div className="mt-4">
            <p className="text-muted-foreground mb-2">Fuente</p>
            <a
              href={session.source}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver documento oficial
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
