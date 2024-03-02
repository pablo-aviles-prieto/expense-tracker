"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "../ui/scroll-area";

type LabelsObj = { singular: string; plural: string };

type MultiSelectSearchProps = {
  options: { value: string; label: string }[];
  label?: LabelsObj;
};

const WIDTH = "w-[225px]";

export const MultiSelectSearch = ({
  options,
  label,
}: MultiSelectSearchProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const handleSelect = (value: string) => {
    setSelectedValues((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((currentValue) => currentValue !== value)
        : [...currentValues, value],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${WIDTH} justify-between`}
        >
          {selectedValues.length === 1
            ? `${selectedValues[0]} selected`
            : selectedValues.length > 1
            ? `${selectedValues.length} ${label?.plural ?? "options"} selecteds`
            : `Select ${label?.plural ?? "options"}...`}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${WIDTH} p-0`}>
        <Command>
          <CommandInput
            placeholder={`Search a ${label?.singular ?? "option"}...`}
          />
          <ScrollArea maxHeight={225}>
            <CommandEmpty>No {label?.plural ?? "options"} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
