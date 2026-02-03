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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/app/api/trpc/react";
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

export function CreateBlockDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();


  const createBlockMutation = api.blocks.create.useMutation({
    onSuccess: () => {
      toast.success("Bloque creado exitosamente");
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al crear el bloque", {
        description: error.message || "No se pudo crear el bloque",
      });
    },
  });

  const form = useForm<BlockFormValues>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      chamber: "DEPUTY",
      startDate: "",
      endDate: "",
      color: "",
      partyId: undefined,
      block_coalition_id: undefined,
    },
  });

  const onSubmit = async (data: BlockFormValues) => {
    createBlockMutation.mutate({
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  size="sm">Crear Bloque</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Bloque</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo bloque político.
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
                    defaultValue={field.value}
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
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createBlockMutation.isPending}
              >
                {createBlockMutation.isPending ? "Creando..." : "Crear Bloque"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
