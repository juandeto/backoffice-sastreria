"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";

type BillDetail = inferRouterOutputs<AppRouter>["bills"]["getById"];

const billTypeLabels: Record<string, string> = {
  LAW: "Ley",
  RESOLUTION: "Resolución",
  DECLARATION: "Declaración",
  DECREE: "Decreto",
};

export function BillHeader({ bill }: { bill: BillDetail }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start gap-6 space-y-0">
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-3xl font-bold">{bill.title}</CardTitle>
            <Badge variant="outline">
              {billTypeLabels[bill.billType] ?? bill.billType}
            </Badge>
          </div>
          {bill.summary && (
            <CardDescription className="text-base">
              {bill.summary}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Expediente</p>
            <p className="font-medium">{bill.fileNumber || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fecha de Presentación</p>
            <p className="font-medium">{bill.introducedDate || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Estado</p>
            <p className="font-medium">{bill.status || "—"}</p>
          </div>
          {bill.link && (
            <div>
              <p className="text-muted-foreground">Enlace</p>
              <a
                href={bill.link}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Ver documento
              </a>
            </div>
          )}
        </div>
        {bill.description && (
          <div className="mt-4">
            <p className="text-muted-foreground mb-2">Descripción</p>
            <p className="text-sm">{bill.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
