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
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/app/api/trpc/router";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type VoteFormValues = z.infer<typeof voteFormSchema>;

type Vote = RouterOutputs["votations"]["getById"];

const voteFormSchema = z.object({
  billId: z.string().uuid().optional(),
  chamber: z.enum(["DEPUTY", "SENATOR"], {
    required_error: "La cámara es requerida",
  }),
  voteDate: z.string().min(1, { message: "La fecha es requerida" }),
  voteType: z.enum(["GENERAL", "PARTICULAR", "MOTION"], {
    required_error: "El tipo de votación es requerido",
  }),
  officialVotePreferenceId: z.string().uuid().optional(),
  comments: z.string().optional(),
  result: z.enum(["APPROVED", "REJECTED"]).optional(),
});


interface EditVoteDialogProps {
  voteId: string;
  mode: "edit" | "view";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionChamber?: "DEPUTY" | "SENATOR";
}

export function EditVoteDialog({
  voteId,
  mode,
  open,
  onOpenChange,
  sessionChamber,
}: EditVoteDialogProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const isViewMode = mode === "view";

  const { data: vote, isLoading: voteLoading } = api.votations.getById.useQuery({ id: voteId }, { enabled: !!voteId });

  const { data: preferences, isLoading: preferencesLoading } =
    api.officialVotePreference.list.useQuery();

  const { data: bills, isLoading: billsLoading } = api.bills.list.useQuery();

  const updateVoteMutation = api.votations.update.useMutation({
    onSuccess: () => {
      toast.success("Votación actualizada exitosamente");
      if (vote?.sessionId) {
        utils.votations.listBySessionId.invalidate({ sessionId: vote.sessionId });
      }
      router.refresh();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error al actualizar la votación", {
        description: error.message || "No se pudo actualizar la votación",
      });
    },
  });

  const formatDateForInput = (date: Date | string | null | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const form = useForm<VoteFormValues>({
    resolver: zodResolver(voteFormSchema),
    defaultValues: {
      billId: vote?.billId || undefined,
      chamber: sessionChamber || "DEPUTY",
      voteDate: formatDateForInput(vote?.voteDate),
      voteType: vote?.voteType || "GENERAL",
      officialVotePreferenceId: vote?.officialVotePreferenceId || 'none',
      comments: vote?.comments ?? undefined,
      result: vote?.result || undefined,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        billId: vote?.billId || undefined,
        chamber: vote?.chamber,
        voteDate: formatDateForInput(vote?.voteDate),
        voteType: vote?.voteType,
        officialVotePreferenceId: vote?.officialVotePreferenceId || undefined,
        comments: vote?.comments || "",
        result: vote?.result || undefined,
      });
    }
  }, [vote, open, form]);

  const onSubmit = async (data: VoteFormValues) => {
    if (isViewMode) return;

    updateVoteMutation.mutate({
      id: vote?.id || "",
      billId: data.billId || undefined,
      chamber: sessionChamber,
      voteDate: data.voteDate,
      voteType: data.voteType,
      officialVotePreferenceId: data.officialVotePreferenceId,
      comments: data.comments || undefined,
      result: data.result,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!vote || voteLoading ? (
        <DialogContent className="sm:max-w-150">
          <DialogHeader>
            <DialogTitle>Cargando...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? "Ver Votación" : "Editar Votación"}
          </DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Visualiza los detalles de la votación."
              : "Modifica los datos de la votación."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="billId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ley (Opcional)</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? undefined : value);
                    }}
                    value={field.value || "none"}
                    disabled={isViewMode || billsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ley (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin ley asociada</SelectItem>
                      {bills?.map((bill) => (
                        <SelectItem key={bill.id} value={bill.id}>
                          {bill.title}
                        </SelectItem>
                      ))}
                      {(!bills || bills.length === 0) && (
                        <SelectItem value="none-disabled" disabled>
                          No hay leyes disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chamber"
                
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cámara *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={sessionChamber}
                      disabled={true}
                    >
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
                name="voteDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Votación *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={isViewMode}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="voteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Votación *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isViewMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="PARTICULAR">Particular</SelectItem>
                        <SelectItem value="MOTION">Moción</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officialVotePreferenceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferencia del Oficialismo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isViewMode || preferencesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar preferencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {preferences?.map((pref) => (
                          <SelectItem key={pref.id} value={pref.id}>
                            {pref.name}
                          </SelectItem>
                        ))}
                        {(!preferences || preferences.length === 0) && (
                          <SelectItem value="none" disabled>
                            No hay preferencias disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === "NONE" ? undefined : value);
                    }}
                    value={field.value || "NONE"}
                    disabled={isViewMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar resultado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NONE">No aconteció</SelectItem>
                      <SelectItem value="APPROVED">Aprobado</SelectItem>
                      <SelectItem value="REJECTED">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentarios</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Comentarios adicionales sobre la votación..."
                      className="resize-none"
                      disabled={isViewMode}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isViewMode && (
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
                  disabled={updateVoteMutation.isPending}
                >
                  {updateVoteMutation.isPending
                    ? "Guardando..."
                    : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            )}
            {isViewMode && (
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cerrar
                </Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
      )}
    </Dialog>
  );
}
