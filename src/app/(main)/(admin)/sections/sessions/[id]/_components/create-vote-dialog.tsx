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

type VoteFormValues = z.infer<typeof voteFormSchema>;

interface CreateVoteDialogProps {
  sessionId: string;
  sessionDate?: string;
  sessionChamber?: "DEPUTY" | "SENATOR";
}

export function CreateVoteDialog({ sessionId, sessionDate, sessionChamber }: CreateVoteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const utils = api.useUtils();

  const { data: preferences, isLoading: preferencesLoading } =
    api.officialVotePreference.list.useQuery();

  const { data: bills, isLoading: billsLoading } = api.bills.list.useQuery();

  const createVoteMutation = api.votations.create.useMutation({
    onSuccess: () => {
      toast.success("Votación creada exitosamente");
      setOpen(false);
      form.reset();
      utils.votations.listBySessionId.invalidate({ sessionId });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Error al crear la votación", {
        description: error.message || "No se pudo crear la votación",
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
      billId: undefined,
      chamber: sessionChamber,
      voteDate: sessionDate ? formatDateForInput(sessionDate) : "",
      voteType: undefined,
      officialVotePreferenceId: undefined,
      comments: "",
      result: undefined,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        billId: undefined,
        chamber: sessionChamber,
        voteDate: sessionDate ? formatDateForInput(sessionDate) : "",
        voteType: undefined,
        officialVotePreferenceId: undefined,
        comments: "",
        result: undefined,
      });
    }
  }, [open, sessionDate, sessionChamber, form]);

  const onSubmit = async (data: VoteFormValues) => {
    createVoteMutation.mutate({
      sessionId,
      billId: data.billId || undefined,
      chamber: data.chamber,
      voteDate: data.voteDate,
      voteType: data.voteType,
      officialVotePreferenceId: data.officialVotePreferenceId,
      comments: data.comments || undefined,
      result: data.result,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Crear nueva votación</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Crear Nueva Votación</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear una nueva votación para esta sesión.
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
                    disabled={billsLoading}
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
                        <SelectItem value="none" disabled>
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
                      value={field.value || "none"}
                      disabled={!!sessionChamber}
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
                      <Input type="datetime-local" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      disabled={preferencesLoading}
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
                disabled={createVoteMutation.isPending}
              >
                {createVoteMutation.isPending ? "Creando..." : "Crear Votación"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
