"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/app/api/trpc/react";
import { toast } from "sonner";
import SelectInputWithDynamicSearch from "@/components/select-input-with-dynamic-search/select-input-with-dynamic-search";

const termFormSchema = z.object({
  chamber: z.enum(["DEPUTY", "SENATOR"]),
  province: z.string().optional(),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  order_in_list: z.string().min(1, "El orden en la lista es requerida"),
  notes: z.string().optional(),
  partyId: z.string().optional(),
});

type TermFormValues = z.infer<typeof termFormSchema>;

interface CreateTermDialogProps {
  personId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Permite crear un nuevo mandato legislativo para una persona.
 */
export function CreateTermDialog({
  personId,
  open,
  onOpenChange,
}: CreateTermDialogProps) {
  const utils = api.useUtils();

  const { data: provinces, isLoading: provincesLoading } =
    api.congressmen.listProvinces.useQuery();

  const { data: partiesData } = api.parties.list.useQuery({
    take: 100,
  });

  const createTermMutation = api.legislativeTerms.create.useMutation({
    onSuccess: () => {
      toast.success("Mandato creado exitosamente");
      utils.legislativeTerms.listByPersonId.invalidate({
        personId,
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Error al crear el mandato", {
        description: error.message || "No se pudo crear el mandato",
        duration: 5000,
      });
    },
  });

  const form = useForm<TermFormValues>({
    resolver: zodResolver(termFormSchema),
    defaultValues: {
      chamber: "DEPUTY",
      province: "",
      startDate: "",
      endDate: "",
      order_in_list: "",
      notes: "",
      partyId: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        chamber: "DEPUTY",
        province: "",
        startDate: "",
        endDate: "",
        order_in_list: "",
        notes: "",
        partyId: "",
      });
    }
  }, [open, form]);

  const onSubmit = async (values: TermFormValues) => {
    // Convertir el ID del partido a su nombre
    const partyName = values.partyId
      ? partiesData?.find((p) => p.id === values.partyId)?.name
      : undefined;

    await createTermMutation.mutateAsync({
      personId,
      chamber: values.chamber,
      province: values.province ? Number(values.province) : undefined,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      order_in_list: Number(values.order_in_list),
      notes: values.notes || undefined,
      elected_in_party: partyName || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear mandato</DialogTitle>
          <DialogDescription>
            Agrega un nuevo mandato legislativo para esta persona.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chamber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cámara *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia</FormLabel>
                    {provincesLoading ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar provincia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces?.map((p) => (
                            <SelectItem
                              key={p.provinceId}
                              value={String(p.provinceId)}
                            >
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <FormLabel>Fecha de Fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="order_in_list"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden en la Lista *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Ej: 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partido por el que fue Electo</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    (Partido político por el que fue electo en este mandato)
                  </p>
                  <FormControl>
                    <SelectInputWithDynamicSearch
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Seleccionar partido"
                      useQueryHook={api.parties.list.useQuery}
                      searchPlaceholder="Buscar partido..."
                      emptyMessage="No se encontraron partidos."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre el mandato"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createTermMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createTermMutation.isPending}>
                {createTermMutation.isPending ? "Creando..." : "Crear"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
