"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import type { PoliticalLeaderRow } from "./types";
import { api } from "@/app/api/trpc/react";

interface ViewLeaderDrawerProps {
  leader: PoliticalLeaderRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewLeaderDrawer({
  leader,
  open,
  onOpenChange,
}: ViewLeaderDrawerProps) {
  const isMobile = useIsMobile();
  const fullName = `${leader.lastName}, ${leader.firstName}`;

  const { data: provinces } = api.provinces.list.useQuery({});
  const provinceName =
    leader.province && provinces
      ? provinces.find((p) => p.id === String(leader.province))?.name ?? "—"
      : "—";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={isMobile ? "bottom" : "right"}>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{fullName}</DrawerTitle>
          <DrawerDescription>
            Detalles del líder político
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="first-name">Nombre</Label>
                <Input id="first-name" defaultValue={leader.firstName} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="last-name">Apellido</Label>
                <Input id="last-name" defaultValue={leader.lastName} readOnly />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="role">Rol</Label>
              <Input id="role" defaultValue={leader.role} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type-district">Tipo de Distrito</Label>
                <Input
                  id="type-district"
                  defaultValue={leader.type_district ?? ""}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name-district">Nombre de Distrito</Label>
                <Input
                  id="name-district"
                  defaultValue={leader.name_district ?? ""}
                  readOnly
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="province">Provincia</Label>
              <Input id="province" defaultValue={provinceName} readOnly />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
