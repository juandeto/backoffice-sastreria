"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { api } from "@/app/api/trpc/react";
import { toast } from "sonner";
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

interface CreateLeaderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLeaderDialog({
  open,
  onOpenChange,
}: CreateLeaderDialogProps) {
  const utils = api.useUtils();

  const createMutation = api.politicalLeaders.create.useMutation({
    onSuccess: () => {
      toast.success("Líder político creado exitosamente");
      utils.politicalLeaders.list.invalidate();
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el líder político");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "",
      type_district: "",
      name_district: "",
      province: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role,
      type_district: values.type_district || undefined,
      name_district: values.name_district || undefined,
      province: values.province ? Number.parseInt(values.province) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Líder Político</DialogTitle>
          <DialogDescription>
            Complete los datos del líder político.
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear Líder"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
