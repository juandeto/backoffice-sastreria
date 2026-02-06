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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/app/api/trpc/react";
import { useRouter } from "next/navigation";

const sessionFormSchema = z.object({
  chamber: z.enum(["DEPUTY", "SENATOR"], {
    required_error: "La cámara es requerida",
  }),
  sessionDate: z.string().min(1, { message: "La fecha es requerida" }),
  sessionType: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  quorumRequired: z.number().int().min(1, { message: "El quórum requerido debe ser mayor a 0" }),
  quorumAchieved: z.number().int().optional(),
  hasQuorum: z.boolean().optional(),
  status: z.enum(["scheduled", "started", "failed_no_quorum", "closed"], {
    required_error: "El estado es requerido",
  }),
  source: z.string().optional(),
});

type SessionFormValues = z.infer<typeof sessionFormSchema>;

export function CreateSessionDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const createSessionMutation = api.sessions.create.useMutation({
    onSuccess: () => {
      toast.success("Sesión creada exitosamente");
      setOpen(false);
      form.reset();
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al crear la sesión", {
        description: error.message || "No se pudo crear la sesión",
      });
    },
  });

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: {
      chamber: undefined,
      sessionDate: "",
      sessionType: "",
      title: "",
      description: "",
      quorumRequired: 1,
      quorumAchieved: undefined,
      hasQuorum: undefined,
      status: "scheduled",
      source: "",
    },
  });

  const onSubmit = async (data: SessionFormValues) => {
    createSessionMutation.mutate({
      chamber: data.chamber,
      sessionDate: data.sessionDate,
      sessionType: data.sessionType || undefined,
      title: data.title || undefined,
      description: data.description || undefined,
      quorumRequired: data.quorumRequired,
      quorumAchieved: data.quorumAchieved,
      hasQuorum: data.hasQuorum,
      status: data.status,
      source: data.source || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Crear</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Sesión</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear una nueva sesión legislativa.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chamber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cámara *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cámara" />
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
                name="sessionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Sesión *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sessionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Sesión</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Ordinaria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Programada</SelectItem>
                        <SelectItem value="started">Iniciada</SelectItem>
                        <SelectItem value="failed_no_quorum">Sin quórum</SelectItem>
                        <SelectItem value="closed">Cerrada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Sesión especial por Ley Bases" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quorumRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quórum Requerido *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quorumAchieved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quórum Alcanzado</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasQuorum"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Tiene Quórum</FormLabel>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la sesión..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuente</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/diario-sesiones"
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
              <Button type="submit" disabled={createSessionMutation.isPending}>
                {createSessionMutation.isPending ? "Creando..." : "Crear Sesión"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
