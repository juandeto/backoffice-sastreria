"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TermsTable } from "./terms-table";
import { VotesTable } from "./votes-table";
import { BlockHistoryTable } from "./block-history-table";

export function DetailTabs({ personId }: { personId: string }) {
  return (
    <Tabs defaultValue="mandatos" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="mandatos">Mandatos</TabsTrigger>
        <TabsTrigger value="votaciones">Votaciones</TabsTrigger>
        <TabsTrigger value="bloques">Histórico de Bloques</TabsTrigger>
      </TabsList>
      
      <TabsContent value="mandatos" className="space-y-4">
        <TermsTable personId={personId} />
      </TabsContent>
      
      <TabsContent value="votaciones" className="space-y-4">
        <VotesTable personId={personId} />
      </TabsContent>
      
      <TabsContent value="bloques" className="space-y-4">
        <BlockHistoryTable personId={personId} />
      </TabsContent>
    </Tabs>
  );
}
