"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/app/api/trpc/react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";

type PersonDetail = inferRouterOutputs<AppRouter>["congressmen"]["getById"];

const personFormSchema = z.object({
  firstName: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "El apellido es requerido" }),
  image_url: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  original_province: z.string().optional(),
  profession: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  tik_tok: z.string().optional(),
  biography: z.string().optional(),
});

type PersonFormValues = z.infer<typeof personFormSchema>;

interface EditPersonDialogProps {
  person: PersonDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toDateInputValue(value: unknown): string {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

/**
 * Permite editar los datos personales del legislador.
 */
export function EditPersonDialog({
  person,
  open,
  onOpenChange,
}: EditPersonDialogProps) {
  const utils = api.useUtils();
  const { data: provinces, isLoading: provincesLoading } =
    api.congressmen.listProvinces.useQuery();

  const updatePersonMutation = api.persons.update.useMutation({
    onSuccess: () => {
      toast.success("Datos actualizados exitosamente");
      utils.congressmen.getById.invalidate({ id: person.id });
      utils.congressmen.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error al actualizar los datos", {
        description: error.message || "No se pudo actualizar el legislador",
      });
    },
  });

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      firstName: person.firstName,
      lastName: person.lastName,
      image_url: person.image_url ?? "",
      birthDate: toDateInputValue(person.birthDate),
      gender: person.gender ?? "",
      original_province: person.original_province
        ? String(person.original_province)
        : "",
      profession: person.profession ?? "",
      instagram: person.instagram ?? "",
      facebook: person.facebook ?? "",
      twitter: person.twitter ?? "",
      tik_tok: person.tik_tok ?? "",
      biography: person.biography ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        firstName: person.firstName,
        lastName: person.lastName,
        image_url: person.image_url ?? "",
        birthDate: toDateInputValue(person.birthDate),
        gender: person.gender ?? "",
        original_province: person.original_province
          ? String(person.original_province)
          : "",
        profession: person.profession ?? "",
        instagram: person.instagram ?? "",
        facebook: person.facebook ?? "",
        twitter: person.twitter ?? "",
        tik_tok: person.tik_tok ?? "",
        biography: person.biography ?? "",
      });
    }
  }, [form, open, person]);

  const onSubmit = (values: PersonFormValues) => {
    updatePersonMutation.mutate({
      id: person.id,
      firstName: values.firstName,
      lastName: values.lastName,
      image_url: values.image_url || undefined,
      birthDate: values.birthDate || undefined,
      gender: values.gender || undefined,
      original_province: values.original_province
        ? Number.parseInt(values.original_province)
        : undefined,
      profession: values.profession || undefined,
      instagram: values.instagram || undefined,
      facebook: values.facebook || undefined,
      twitter: values.twitter || undefined,
      tik_tok: values.tik_tok || undefined,
      biography: values.biography || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar datos</DialogTitle>
          <DialogDescription>
            Actualiza la información personal del legislador.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        {provinces?.map((province) => (
                          <SelectItem
                            key={province.provinceId}
                            value={String(province.provinceId)}
                          >
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
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
                    <Textarea
                      placeholder="Breve biografía del legislador..."
                      {...field}
                    />
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updatePersonMutation.isPending}>
                {updatePersonMutation.isPending
                  ? "Guardando..."
                  : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
