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
import type { BlockCoalition } from "./schema";
import { useRouter } from "next/navigation";

const coalitionFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  startDate: z.string().min(1, { message: "La fecha de inicio es requerida" }),
  endDate: z.string().optional(),
  color: z.string().min(1, { message: "El color es requerido" }),
  leader: z.string().uuid().optional(),
});

type CoalitionFormValues = z.infer<typeof coalitionFormSchema>;

interface EditCoalitionDialogProps {
  coalition: BlockCoalition;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCoalitionDialog({ coalition, open, onOpenChange }: EditCoalitionDialogProps) {
  const router = useRouter();


  const updateCoalitionMutation = api.blockCoalitions.update.useMutation({
    onSuccess: () => {
      toast.success("Interbloque actualizado exitosamente");
      router.refresh();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error al actualizar el interbloque", {
        description: error.message || "No se pudo actualizar el interbloque",
      });
    },
  });

  const form = useForm<CoalitionFormValues>({
    resolver: zodResolver(coalitionFormSchema),
    defaultValues: {
      name: coalition.name,
      startDate: coalition.startDate,
      endDate: coalition.endDate || "",
      color: coalition.color,
      leader: coalition.leader || undefined,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: coalition.name,
        startDate: coalition.startDate,
        endDate: coalition.endDate || "",
        color: coalition.color,
        leader: coalition.leader || undefined,
      });
    }
  }, [coalition, open, form]);

  const onSubmit = async (data: CoalitionFormValues) => {
    updateCoalitionMutation.mutate({
      id: coalition.id,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      color: data.color,
      leader: data.leader || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Interbloque</DialogTitle>
          <DialogDescription>
            Modifica los datos del interbloque político.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Juntos por el Cambio"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Inicio</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Fin (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input
                      type="color"
                      className="h-10 w-full"
                      {...field}
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
                disabled={updateCoalitionMutation.isPending}
              >
                {updateCoalitionMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
