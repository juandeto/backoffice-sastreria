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

const partyFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es requerido" }),
  abbreviation: z.string().min(1, { message: "La abreviación es requerida" }),
  color: z.string().min(1, { message: "El color es requerido" }),
  logo: z.string().optional(),
  partyType: z.string().optional(),
});

type PartyFormValues = z.infer<typeof partyFormSchema>;

export function CreatePartyDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const createPartyMutation = api.parties.create.useMutation({
    onSuccess: () => {
      toast.success("Partido creado exitosamente");
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al crear el partido", {
        description: error.message || "No se pudo crear el partido",
      });
    },
  });

  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      color: "",
      logo: "",
      partyType: "",
    },
  });

  const onSubmit = async (data: PartyFormValues) => {
    createPartyMutation.mutate({
      name: data.name,
      abbreviation: data.abbreviation,
      color: data.color,
      logo: data.logo || undefined,
      partyType: data.partyType || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          Crear Partido
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Partido</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo partido político.
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
                      placeholder="Ej: La Libertad Avanza"
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
                      placeholder="Ej: LLA"
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
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo (URL)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Partido</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Nacional"
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
                disabled={createPartyMutation.isPending}
              >
                {createPartyMutation.isPending ? "Creando..." : "Crear Partido"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
