"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils/utils"

/**
 * Props for DeleteButton.
 *
 * @param onConfirm - Acción que se ejecuta al confirmar la eliminación.
 * @example
 * ```typescript
 * <DeleteButton onConfirm={() => removeItem(id)} />
 * ```
 */
interface DeleteButtonProps {
  onConfirm: () => void | Promise<void>
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  triggerLabel?: string
  triggerVariant?: React.ComponentProps<typeof Button>["variant"]
  triggerSize?: React.ComponentProps<typeof Button>["size"]
  triggerClassName?: string
  trigger?: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  confirmClassName?: string
}

/**
 * Botón reutilizable de eliminación con modal de confirmación.
 *
 * @example
 * ```typescript
 * <DeleteButton
 *   title="Eliminar registro"
 *   description="Esta acción no se puede deshacer."
 *   onConfirm={() => removeItem(id)}
 * />
 * ```
 */
export function DeleteButton({
  onConfirm,
  title = "Eliminar elemento",
  description = "Esta acción no se puede deshacer.",
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  triggerLabel = "Eliminar",
  triggerVariant = "destructive",
  triggerSize = "default",
  triggerClassName,
  trigger,
  isLoading = false,
  disabled = false,
  confirmClassName,
}: DeleteButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant={triggerVariant}
            size={triggerSize}
            className={triggerClassName}
            disabled={isDisabled}
          >
            {triggerLabel}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDisabled}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              buttonVariants({ variant: "destructive" }),
              confirmClassName
            )}
            onClick={onConfirm}
            disabled={isDisabled}
          >
            {isLoading ? (
              <>
                <Spinner className="text-current" />
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
