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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { api } from "@/app/api/trpc/react";
import { toast } from "sonner";
import { getVoteChoiceLabel } from "@/lib/utils/enums-to-labels";
import type { OfficialVotePreferenceRow } from "./types";
import type { VoteChoice } from "./types";
import { voteChoices } from "./types";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  rules: z
    .array(
      z.object({
        choice: z.enum([
          "POSITIVE",
          "NEGATIVE",
          "ABSTENTION",
          "ABSENT",
          "INCONCLUSIVE",
        ]),
        value: z.string().min(1, "El valor es requerido"),
      }),
    )
    .length(5)
    .superRefine((rules, ctx) => {
      rules.forEach((rule, index) => {
        const num = Number.parseFloat(rule.value);
        if (rule.choice === "INCONCLUSIVE") {
          if (num !== -1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [index, "value"],
              message: "El valor debe ser -1 para INCONCLUSIVE",
            });
          }
        } else {
          if (Number.isNaN(num) || num < 0 || num > 1) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [index, "value"],
              message: "El valor debe ser entre 0 y 1",
            });
          }
        }
      });
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface EditStrategyDialogProps {
  strategy: OfficialVotePreferenceRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStrategyDialog({
  strategy,
  open,
  onOpenChange,
}: EditStrategyDialogProps) {
  const utils = api.useUtils();

  const updateMutation =
    api.officialVotePreference.updateWithRules.useMutation({
      onSuccess: () => {
        toast.success("Estrategia oficialista actualizada exitosamente");
        utils.officialVotePreference.list.invalidate();
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Error al actualizar la estrategia");
      },
    });

  const initialChoicesFromStrategy = React.useMemo((): FormValues["rules"] => {
    if (strategy.rules && strategy.rules.length === 5) {
      return strategy.rules.map((rule: { choice: string; value: string | null }) => ({
        choice: rule.choice as VoteChoice,
        value: rule.choice === "INCONCLUSIVE" ? "-1" : rule.value ?? "0",
      })) as FormValues["rules"];
    }
    return [
      { choice: "POSITIVE", value: "0" },
      { choice: "NEGATIVE", value: "0" },
      { choice: "ABSTENTION", value: "0" },
      { choice: "ABSENT", value: "0" },
      { choice: "INCONCLUSIVE", value: "-1" },
    ];
  }, [strategy]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: strategy.name,
      description: strategy.description ?? "",
      rules: initialChoicesFromStrategy,
    },
  });

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate({
      id: strategy.id,
      name: values.name,
      description: values.description || undefined,
      rules: values.rules,
    });
  };

  React.useEffect(() => {
    if (open) {
      const choices = initialChoicesFromStrategy;
      form.reset({
        name: strategy.name,
        description: strategy.description ?? "",
        rules: choices,
      });
    }
  }, [open, strategy, initialChoicesFromStrategy, form]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Estrategia Oficialista</DialogTitle>
          <DialogDescription>
            Modifique los datos de la estrategia y asigne un valor entre 0 y 1
            para cada preferencia de voto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Estrategia conservadora" {...field} />
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
                      placeholder="Descripción de la estrategia..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Valores de Preferencia de Voto</FormLabel>
              <p className="text-sm text-muted-foreground">
                Asigne un valor entre 0 y 1 para cada preferencia de voto. Un
                valor mayor indica mayor preferencia.
              </p>
              <div className="space-y-3">
                {form.watch("rules").map((rule, index) => {
                  const isInconclusive = rule.choice === "INCONCLUSIVE";
                  return (
                    <FormField
                      key={rule.choice}
                      control={form.control}
                      name={`rules.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getVoteChoiceLabel(rule.choice)}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min={isInconclusive ? "-1" : "0"}
                              max={isInconclusive ? "-1" : "1"}
                              placeholder={isInconclusive ? "-1" : "0.00"}
                              disabled={isInconclusive}
                              {...field}
                              value={isInconclusive ? "-1" : field.value}
                              onChange={(e) => {
                                if (isInconclusive) {
                                  field.onChange("-1");
                                } else {
                                  field.onChange(e.target.value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
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
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending
                  ? "Actualizando..."
                  : "Actualizar Estrategia"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
