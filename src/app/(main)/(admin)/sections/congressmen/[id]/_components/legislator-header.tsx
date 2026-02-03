"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";
import { EditPersonDialog } from "./edit-person-dialog";

type PersonDetail = inferRouterOutputs<AppRouter>["congressmen"]["getById"];

export function LegislatorHeader({ person }: { person: PersonDetail }) {
  const initials = `${person.firstName[0]}${person.lastName[0]}`;
  const fullName = `${person.firstName} ${person.lastName}`;
  const [editOpen, setEditOpen] = React.useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start gap-6 space-y-0">
        <Avatar className="size-24 border-2 border-muted">
          <AvatarImage src={person.image_url ?? ""} alt={fullName} />
          <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-3xl font-bold">{fullName}</CardTitle>
            {person.provinceName && (
              <Badge variant="secondary" className="text-sm">
                {person.provinceName}
              </Badge>
            )}
          </div>
          <CardDescription className="text-base italic">
            {person.biography || "Sin biografía disponible."}
          </CardDescription>
          <div className="mt-2 flex gap-4">
            {person.instagram && (
              <a href={`https://instagram.com/${person.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Instagram className="size-5" />
              </a>
            )}
            {person.twitter && (
              <a href={`https://twitter.com/${person.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Twitter className="size-5" />
              </a>
            )}
            {person.facebook && (
              <a href={`https://facebook.com/${person.facebook}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Facebook className="size-5" />
              </a>
            )}
            {person.tik_tok && (
              <a href={`https://tiktok.com/@${person.tik_tok.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <LinkIcon className="size-5" />
              </a>
            )}
          </div>
        </div>
        <Button onClick={() => setEditOpen(true)}>
          Editar datos personales
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Fecha de Nacimiento</p>
            <p className="font-medium">{person.birthDate || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Género</p>
            <p className="font-medium">{person.gender === "M" ? "Masculino" : person.gender === "F" ? "Femenino" : "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Distrito de Origen</p>
            <p className="font-medium">{person.provinceName || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Profesión</p>
            <p className="font-medium">{person.profession || "—"}</p>
          </div>
        </div>
      </CardContent>
      <EditPersonDialog person={person} open={editOpen} onOpenChange={setEditOpen} />
    </Card>
  );
}
