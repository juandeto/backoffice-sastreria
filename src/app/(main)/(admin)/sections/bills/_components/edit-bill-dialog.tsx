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
import type { Bill } from "./schema";
import { useRouter } from "next/navigation";

const billFormSchema = z.object({
  title: z.string().min(1, { message: "El título es requerido" }),
  fileNumber: z.string().optional(),
  billType: z.enum(["LAW", "RESOLUTION", "DECLARATION", "DECREE"], {
    required_error: "El tipo de proyecto es requerido",
  }),
  introducedDate: z.string().optional(),
  status: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  link: z.string().optional(),
});

type BillFormValues = z.infer<typeof billFormSchema>;

interface EditBillDialogProps {
  bill: Bill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBillDialog({ bill, open, onOpenChange }: EditBillDialogProps) {
  const router = useRouter();

  const updateBillMutation = api.bills.update.useMutation({
    onSuccess: () => {
      toast.success("Proyecto actualizado exitosamente");
      router.refresh();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Error al actualizar el proyecto", {
        description: error.message || "No se pudo actualizar el proyecto",
      });
    },
  });

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      title: bill.title,
      fileNumber: bill.fileNumber || "",
      billType: bill.billType,
      introducedDate: bill.introducedDate || "",
      status: bill.status || "",
      summary: bill.summary || "",
      description: bill.description || "",
      link: bill.link || "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        title: bill.title,
        fileNumber: bill.fileNumber || "",
        billType: bill.billType,
        introducedDate: bill.introducedDate || "",
        status: bill.status || "",
        summary: bill.summary || "",
        description: bill.description || "",
        link: bill.link || "",
      });
    }
  }, [bill, open, form]);

  const onSubmit = async (data: BillFormValues) => {
    updateBillMutation.mutate({
      id: bill.id,
      title: data.title,
      fileNumber: data.fileNumber || undefined,
      billType: data.billType,
      introducedDate: data.introducedDate || undefined,
      status: data.status || undefined,
      summary: data.summary || undefined,
      description: data.description || undefined,
      link: data.link || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>
            Modifica los datos del proyecto de ley.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ley de Presupuesto 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Expediente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 1234-D-2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Proyecto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LAW">Ley</SelectItem>
                      <SelectItem value="RESOLUTION">Resolución</SelectItem>
                      <SelectItem value="DECLARATION">Declaración</SelectItem>
                      <SelectItem value="DECREE">Decreto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="introducedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Presentación</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: En comisión" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Breve resumen del proyecto..."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción detallada del proyecto..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enlace</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/proyecto"
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
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateBillMutation.isPending}>
                {updateBillMutation.isPending ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
