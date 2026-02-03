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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/app/api/trpc/react";
import type { Block } from "./schema";
import { useRouter } from "next/navigation";

const blockFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  abbreviation: z.string().min(1, { message: "La abreviación es requerida" }),
  chamber: z.enum(["DEPUTY", "SENATOR"], {
    required_error: "La cámara es requerida",
  }),
  startDate: z.string().min(1, { message: "La fecha de inicio es requerida" }),
  endDate: z.string().optional(),
  color: z.string().min(1, { message: "El color es requerido" }),
  partyId: z.string().uuid().optional(),
  block_coalition_id: z.string().uuid().optional(),
});

type BlockFormValues = z.infer<typeof blockFormSchema>;

interface EditBlockDialogProps {
  block: Block;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBlockDialog({ block, open, onOpenChange }: EditBlockDialogProps) {
  const utils = api.useUtils();
  const router = useRouter();

  const updateBlockMutation = api.blocks.update.useMutation({
    onSuccess: () => {
      toast.success("Bloque actualizado exitosamente");
      router.refresh();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error al actualizar el bloque", {
        description: error.message || "No se pudo actualizar el bloque",
      });
    },
  });

  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      name: block.name,
      abbreviation: block.abbreviation,
      chamber: block.chamber,
      startDate: block.startDate,
      endDate: block.endDate || "",
      color: block.color,
      partyId: block.partyId || undefined,
      block_coalition_id: block.block_coalition_id || undefined,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: block.name,
        abbreviation: block.abbreviation,
        chamber: block.chamber,
        startDate: block.startDate,
        endDate: block.endDate || "",
        color: block.color,
        partyId: block.partyId || undefined,
        block_coalition_id: block.block_coalition_id || undefined,
      });
    }
  }, [block, open, form]);

  const onSubmit = async (data: BlockFormValues) => {
    updateBlockMutation.mutate({
      id: block.id,
      name: data.name,
      abbreviation: data.abbreviation,
      chamber: data.chamber,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      color: data.color,
      partyId: data.partyId || undefined,
      block_coalition_id: data.block_coalition_id || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Bloque</DialogTitle>
          <DialogDescription>
            Modifica los datos del bloque político.
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
                      placeholder="Ej: Frente de Todos"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="abbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abreviación</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: FdT"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chamber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cámara</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una cámara" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DEPUTY">Diputados</SelectItem>
                      <SelectItem value="SENATOR">Senadores</SelectItem>
                    </SelectContent>
                  </Select>
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
                disabled={updateBlockMutation.isPending}
              >
                {updateBlockMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
