"use client";

import * as React from "react";
import { EllipsisVertical, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteButton } from "@/components/delete-button";

interface RowActionsProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onDeleteConfirm?: () => void | Promise<void>;
  deleteTitle?: string;
  deleteDescription?: string;
  deleteIsLoading?: boolean;
  onViewMore?: string;
  extraItems?: React.ReactNode;
  menuClassName?: string;
}

export function RowActions({
  onEdit,
  onDuplicate,
  onDelete,
  onDeleteConfirm,
  deleteTitle = "Eliminar elemento",
  deleteDescription = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  deleteIsLoading = false,
  onViewMore,
  extraItems,
  menuClassName,
}: RowActionsProps) {
  const hasActions = !!onEdit || !!onDuplicate || !!onDelete || !!onDeleteConfirm || !!onViewMore;

  if (!extraItems && !hasActions) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
          size="icon"
        >
          <EllipsisVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={menuClassName}>
        {extraItems}
        {extraItems && hasActions ? <DropdownMenuSeparator /> : null}
        {onViewMore ? (
          <DropdownMenuItem asChild>
            <Link href={onViewMore}>
              <ExternalLink className="mr-2 size-4" />
              Ver más
            </Link>
          </DropdownMenuItem>
        ) : null}
        {onEdit ? <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem> : null}
        {onDuplicate ? (
          <DropdownMenuItem onClick={onDuplicate}>Duplicar</DropdownMenuItem>
        ) : null}
        {onDeleteConfirm ? (
          <>
            <DropdownMenuSeparator />
            <DeleteButton
              onConfirm={onDeleteConfirm}
              title={deleteTitle}
              description={deleteDescription}
              isLoading={deleteIsLoading}
              trigger={
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  Eliminar
                </DropdownMenuItem>
              }
            />
          </>
        ) : onDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              Eliminar
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
