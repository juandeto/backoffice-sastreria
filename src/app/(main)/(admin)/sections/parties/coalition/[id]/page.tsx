import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Users } from "lucide-react";
import Link from "next/link";

// Mock data for the coalition
const mockCoalitions = [
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Juntos por el Cambio",
    startDate: "2019-12-10",
    color: "#ffcc00",
    description: "Coalición política de tendencia centro-derecha."
  }
];

export default async function CoalitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coalition = mockCoalitions.find(c => c.id === id);

  if (!coalition) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/sections/parties">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{coalition.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Coalición</CardTitle>
            <CardDescription>Información general sobre el interbloque.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded-full" style={{ backgroundColor: coalition.color }} />
              <span className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Color Distintivo</span>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Fecha de Inicio</p>
              <p>{coalition.startDate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Descripción</p>
              <p>{coalition.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bloques Miembros</CardTitle>
            <CardDescription>Lista de bloques que integran esta coalición.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Aquí iría la lista de bloques que referencian a esta coalición */}
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="size-10 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">No hay bloques asignados todavía.</p>
              <Button variant="outline" size="sm" className="mt-4">
                Asignar Bloque
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membresía (block_membership)</CardTitle>
          <CardDescription>Legisladores que pertenecen a los bloques de esta coalición.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <p className="text-sm text-muted-foreground">Esta sección mostrará los datos de block_membership.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
