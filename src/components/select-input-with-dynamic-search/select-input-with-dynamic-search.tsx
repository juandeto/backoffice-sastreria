"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import fromServerToOptions from "@/lib/utils/select-utils";

interface SelectInputWithDynamicSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  defaultValue?: string;
  useQueryHook: (params: { name?: string; take?: number }) => {
    data: unknown;
    isLoading: boolean;
    isError: boolean;
  };
  take?: number;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

export default function SelectInputWithDynamicSearch({
  value,
  onChange,
  placeholder,
  defaultValue,
  useQueryHook,
  take = 10,
  emptyMessage = "No se encontraron resultados.",
  searchPlaceholder = "Buscar...",
}: SelectInputWithDynamicSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(undefined);

  // Debounce search value
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Measure trigger width
  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  const { data, isLoading } = useQueryHook({
    name: debouncedSearch || undefined,
    take,
  });

  const options = React.useMemo(() => fromServerToOptions((data as unknown[]) ?? []), [data]);

  // Find selected option for display
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label ?? placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: triggerWidth ? `${triggerWidth}px` : undefined }}
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Cargando..." : emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  keywords={[option.value]}
                  onSelect={() => {
                    onChange(option.value === value ? "" : option.value);
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}