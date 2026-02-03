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
  DialogTrigger,
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
import { useRouter } from "next/navigation";

const coalitionFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  startDate: z.string().min(1, { message: "La fecha de inicio es requerida" }),
  endDate: z.string().optional(),
  color: z.string().min(1, { message: "El color es requerido" }),
  leader: z.string().uuid().optional(),
});

type CoalitionFormValues = z.infer<typeof coalitionFormSchema>;

export function CreateCoalitionDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const createCoalitionMutation = api.blockCoalitions.create.useMutation({
    onSuccess: () => {
      toast.success("Interbloque creado exitosamente");
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al crear el interbloque", {
        description: error.message || "No se pudo crear el interbloque",
      });
    },
  });

  const form = useForm<CoalitionFormValues>({
    resolver: zodResolver(coalitionFormSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      color: "",
      leader: undefined,
    },
  });

  const onSubmit = async (data: CoalitionFormValues) => {
    createCoalitionMutation.mutate({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      color: data.color,
      leader: data.leader || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          Crear Interbloque
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Interbloque</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo interbloque político.
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
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createCoalitionMutation.isPending}
              >
                {createCoalitionMutation.isPending ? "Creando..." : "Crear Interbloque"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
