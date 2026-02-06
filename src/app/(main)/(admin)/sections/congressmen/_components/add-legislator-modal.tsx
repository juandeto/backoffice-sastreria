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

const formSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  original_province: z.string().optional(),
  image_url: z.string().optional(),
  profession: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  tik_tok: z.string().optional(),
  biography: z.string().optional(),
  chamber: z.enum(["DEPUTY", "SENATOR"]),
  termProvince: z.string().optional(),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  order_in_list: z.string().min(1, "El orden en la lista es requerido"),
  notes: z.string().optional(),
  partyId: z.string().optional(),
  blockId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddLegislatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLegislatorModal({ open, onOpenChange }: AddLegislatorModalProps) {
  const utils = api.useUtils();

  const { data: provinces, isLoading: provincesLoading } = api.congressmen.listProvinces.useQuery();

  const createMutation = api.congressmen.create.useMutation({
    onSuccess: () => {
      toast.success("Legislador creado exitosamente");
      utils.congressmen.list.invalidate();
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el legislador");
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      original_province: "",
      image_url: "",
      profession: "",
      instagram: "",
      facebook: "",
      twitter: "",
      tik_tok: "",
      biography: "",
      chamber: "DEPUTY",
      termProvince: "",
      startDate: "",
      endDate: "",
      order_in_list: "",
      notes: "",
      partyId: "",
      blockId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      birthDate: values.birthDate || undefined,
      gender: values.gender || undefined,
      original_province: values.original_province ? Number.parseInt(values.original_province) : undefined,
      image_url: values.image_url || undefined,
      profession: values.profession || undefined,
      instagram: values.instagram || undefined,
      facebook: values.facebook || undefined,
      twitter: values.twitter || undefined,
      tik_tok: values.tik_tok || undefined,
      biography: values.biography || undefined,
      chamber: values.chamber,
      termProvince: values.termProvince ? Number.parseInt(values.termProvince) : undefined,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      order_in_list: Number.parseInt(values.order_in_list),
      notes: values.notes || undefined,
      partyId: values.partyId || undefined,
      blockId: values.blockId || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Legislador</DialogTitle>
          <DialogDescription>
            Complete los datos del legislador y su mandato legislativo actual.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Información Personal</h3>
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                          <SelectItem value="O">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="original_province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provincia de Origen</FormLabel>
                    {provincesLoading ? (
                      <Skeleton className="h-9 w-full" />
                    ) : (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar provincia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces?.map((p) => (
                            <SelectItem key={p.provinceId} value={String(p.provinceId)}>
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

                {/* Image URL */}
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profesión</FormLabel>
                    <FormControl>
                      <Input placeholder="Profesión" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Breve biografía del legislador..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter/X</FormLabel>
                      <FormControl>
                        <Input placeholder="@usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="@usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="URL o usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tik_tok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TikTok</FormLabel>
                      <FormControl>
                        <Input placeholder="@usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Legislative Term Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Mandato Legislativo</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="chamber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cámara *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                  name="termProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia del Mandato</FormLabel>
                      {provincesLoading ? (
                        <Skeleton className="h-9 w-full" />
                      ) : (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar provincia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces?.map((p) => (
                              <SelectItem key={p.provinceId} value={String(p.provinceId)}>
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

              <div className="grid grid-cols-3 gap-4">
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
                <FormField
                  control={form.control}
                  name="order_in_list"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orden en Lista *</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notas adicionales sobre el mandato..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Party and Block (Skeleton for now) */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Afiliación Política</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="partyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partido Político</FormLabel>
                      <p className="text-xs text-muted-foreground">(Partido por el que fue electo)</p>
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
                  name="blockId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloque</FormLabel>
                      <p className="text-xs text-muted-foreground">(Bloque al que pertenece actualmente)</p>
                      <FormControl>
                        <SelectInputWithDynamicSearch
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          placeholder="Seleccionar bloque"
                          useQueryHook={api.blocks.list.useQuery}
                          searchPlaceholder="Buscar bloque..."
                          emptyMessage="No se encontraron bloques."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creando..." : "Crear Legislador"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
