"use client";

import { api } from "@/app/api/trpc/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function VotesTable({ personId }: { personId: string }) {
  const { data: votes, isLoading } = api.congressmen.getVotesByPersonId.useQuery({ personId });

  if (isLoading) {
    return <Skeleton className="h-50 w-full" />;
  }

  if (!votes || votes.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">No se encontraron votaciones.</div>;
  }

  const getChoiceVariant = (choice: string) => {
    switch (choice) {
      case "POSITIVE": return "default";
      case "NEGATIVE": return "destructive";
      case "ABSTENTION": return "outline";
      case "ABSENT": return "secondary";
      default: return "outline";
    }
  };

  const getChoiceLabel = (choice: string) => {
    switch (choice) {
      case "POSITIVE": return "Afirmativo";
      case "NEGATIVE": return "Negativo";
      case "ABSTENTION": return "Abstención";
      case "ABSENT": return "Ausente";
      default: return choice;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ley</TableHead>
            <TableHead>Fecha de votación</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Voto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {votes.map((vote) => (
            <TableRow key={vote.id}>
              <TableCell className="max-w-md font-medium">{vote.billTitle}</TableCell>
              <TableCell>{new Date(vote.voteDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{vote.voteType}</TableCell>
              <TableCell>
                <Badge variant={getChoiceVariant(vote.choice)}>
                  {getChoiceLabel(vote.choice)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
