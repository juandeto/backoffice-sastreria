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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/app/api/trpc/react";
import { toast } from "sonner";
import SelectInputWithDynamicSearch from "@/components/select-input-with-dynamic-search/select-input-with-dynamic-search";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type BlockMembership = RouterOutputs["blockMemberships"]["listByPersonId"][number];

const blockMembershipFormSchema = z.object({
  legislativeTermId: z.string().uuid("El mandato legislativo es requerido"),
  blockId: z.string().uuid("El bloque es requerido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional().nullable(),
  leader: z.boolean().default(false),
});

type BlockMembershipFormValues = z.infer<typeof blockMembershipFormSchema>;

interface EditBlockMembershipDialogProps {
  membership: BlockMembership;
  personId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBlockMembershipDialog({
  membership,
  personId,
  open,
  onOpenChange,
}: EditBlockMembershipDialogProps) {
  const utils = api.useUtils();

  const { data: legislativeTerms, isLoading: termsLoading } =
    api.legislativeTerms.listByPersonId.useQuery({ personId });

  const { data: blocksData } = api.blocks.list.useQuery({});

  const updateMembershipMutation = api.blockMemberships.update.useMutation({
    onSuccess: () => {
      toast.success("Membresía de bloque actualizada exitosamente");
      utils.blockMemberships.listByPersonId.invalidate({ personId });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error al actualizar la membresía", {
        description: error.message || "No se pudo actualizar la membresía de bloque",
        duration: 5000,
      });
    },
  });

  const form = useForm<BlockMembershipFormValues>({
    resolver: zodResolver(blockMembershipFormSchema),
    defaultValues: {
      legislativeTermId: membership.legislativeTermId,
      blockId: "",
      startDate: membership.startDate,
      endDate: membership.endDate || null,
      leader: membership.leader,
    },
  });

  React.useEffect(() => {
    if (open && membership) {
      form.reset({
        legislativeTermId: membership.legislativeTermId,
        blockId: membership.blockId,
        startDate: membership.startDate,
        endDate: membership.endDate || null,
        leader: membership.leader,
      });
    }
  }, [open, membership, form]);

  const onSubmit = async (values: BlockMembershipFormValues) => {
    await updateMembershipMutation.mutateAsync({
      id: membership.id,
      personId,
      legislativeTermId: values.legislativeTermId,
      blockId: values.blockId,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
      leader: values.leader,
    });
  };

  // Transform legislative terms for Select
  const legislativeTermsOptions = React.useMemo(() => {
    if (!legislativeTerms) return [];
    return legislativeTerms.map((term) => ({
      id: term.id,
      label: `${term.chamber === "DEPUTY" ? "Diputado" : "Senador"} - ${term.startDate}${term.endDate ? ` a ${term.endDate}` : ""}${term.provinceName ? ` (${term.provinceName})` : ""}`,
    }));
  }, [legislativeTerms]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Editar membresía de bloque</DialogTitle>
          <DialogDescription>
            Modifica los datos de la membresía de bloque.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="legislativeTermId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mandato legislativo *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={termsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar mandato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {legislativeTermsOptions.map((term) => (
                        <SelectItem key={term.id} value={term.id}>
                          {term.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blockId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bloque *</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio *</FormLabel>
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
                    <FormLabel>Fecha de fin</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="leader"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Presidente del bloque</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMembershipMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateMembershipMutation.isPending}
              >
                {updateMembershipMutation.isPending ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
