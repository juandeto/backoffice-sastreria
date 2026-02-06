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
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { getVoteChoiceLabel } from "@/lib/utils/enums-to-labels";

const voteChoices = [
  "POSITIVE",
  "NEGATIVE",
  "ABSTENTION",
  "ABSENT",
  "INCONCLUSIVE",
] as const;

type VoteChoice = (typeof voteChoices)[number];

interface SortableChoiceItemProps {
  choice: VoteChoice;
  priority: number;
}

function SortableChoiceItem({ choice, priority }: SortableChoiceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: choice });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="size-6 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4 text-muted-foreground" />
      </Button>
      <div className="flex flex-1 items-center justify-between">
        <span className="font-medium">{getVoteChoiceLabel(choice)}</span>
        <span className="text-sm text-muted-foreground">
          Prioridad {priority}
        </span>
      </div>
    </div>
  );
}

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
        priority: z.number().int().min(1).max(5),
      }),
    )
    .length(5),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStrategyDialog({
  open,
  onOpenChange,
}: CreateStrategyDialogProps) {
  const utils = api.useUtils();

  const createMutation = api.officialVotePreference.createWithRules.useMutation({
    onSuccess: () => {
      toast.success("Estrategia oficialista creada exitosamente");
      utils.officialVotePreference.list.invalidate();
      onOpenChange(false);
      form.reset();
      setOrderedChoices(initialChoices);
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear la estrategia");
    },
  });

  const initialChoices: Array<{ choice: VoteChoice; priority: number }> = [
    { choice: "POSITIVE", priority: 1 },
    { choice: "NEGATIVE", priority: 2 },
    { choice: "ABSTENTION", priority: 3 },
    { choice: "ABSENT", priority: 4 },
    { choice: "INCONCLUSIVE", priority: 5 },
  ];

  const [orderedChoices, setOrderedChoices] = React.useState(initialChoices);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      rules: initialChoices,
    },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = orderedChoices.findIndex(
        (item) => item.choice === active.id,
      );
      const newIndex = orderedChoices.findIndex(
        (item) => item.choice === over.id,
      );

      const newOrder = arrayMove(orderedChoices, oldIndex, newIndex);
      const reorderedWithPriority = newOrder.map((item, index) => ({
        ...item,
        priority: index + 1,
      }));

      setOrderedChoices(reorderedWithPriority);
      form.setValue("rules", reorderedWithPriority);
    }
  };

  const onSubmit = (values: FormValues) => {
    createMutation.mutate({
      name: values.name,
      description: values.description || undefined,
      rules: orderedChoices,
    });
  };

  React.useEffect(() => {
    if (open) {
      setOrderedChoices(initialChoices);
      form.reset({
        name: "",
        description: "",
        rules: initialChoices,
      });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Estrategia Oficialista</DialogTitle>
          <DialogDescription>
            Complete los datos de la estrategia y ordene las preferencias de
            voto según la prioridad del oficialismo.
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

            <div className="space-y-2">
              <FormLabel>Orden de Prioridad de Votos</FormLabel>
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta para reordenar las preferencias. La primera
                opción tiene la mayor prioridad (1).
              </p>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                sensors={sensors}
              >
                <SortableContext
                  items={orderedChoices.map((item) => item.choice)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {orderedChoices.map((item) => (
                      <SortableChoiceItem
                        key={item.choice}
                        choice={item.choice}
                        priority={item.priority}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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
                {createMutation.isPending ? "Creando..." : "Crear Estrategia"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
