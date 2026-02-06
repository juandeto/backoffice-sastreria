"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/app/api/trpc/react";
import type { PoliticalLeaderRow } from "./types";
import SelectInputWithDynamicSearch from "@/components/select-input-with-dynamic-search/select-input-with-dynamic-search";

const formSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  role: z.string().min(1, "El rol es requerido"),
  type_district: z.string().optional(),
  name_district: z.string().optional(),
  province: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLeaderDialogProps {
  leader: PoliticalLeaderRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditLeaderDialog({
  leader,
  open,
  onOpenChange,
}: EditLeaderDialogProps) {
  const utils = api.useUtils();

  const updateMutation = api.politicalLeaders.update.useMutation({
    onSuccess: () => {
      toast.success("Líder político actualizado exitosamente");
      utils.politicalLeaders.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error al actualizar el líder político", {
        description: error.message || "No se pudo actualizar el líder político",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: leader.firstName,
      lastName: leader.lastName,
      role: leader.role,
      type_district: leader.type_district || "",
      name_district: leader.name_district || "",
      province: leader.province ? String(leader.province) : "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        firstName: leader.firstName,
        lastName: leader.lastName,
        role: leader.role,
        type_district: leader.type_district || "",
        name_district: leader.name_district || "",
        province: leader.province ? String(leader.province) : "",
      });
    }
  }, [leader, open, form]);

  const onSubmit = async (data: FormValues) => {
    updateMutation.mutate({
      id: leader.id,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      type_district: data.type_district || undefined,
      name_district: data.name_district || undefined,
      province: data.province ? Number.parseInt(data.province) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Líder Político</DialogTitle>
          <DialogDescription>
            Modifica los datos del líder político.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido *</FormLabel>
                    <FormControl>
                      <Input placeholder="Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Gobernador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type_district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Distrito</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Nacional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de Distrito</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Distrito 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provincia</FormLabel>
                  <FormControl>
                    <SelectInputWithDynamicSearch
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Seleccionar provincia"
                      useQueryHook={api.provinces.list.useQuery}
                      searchPlaceholder="Buscar provincia..."
                      emptyMessage="No se encontraron provincias."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
