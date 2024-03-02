"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { getEllipsed } from "@/utils/const";

type LabelsObj = { singular: string; plural: string };

type MultiSelectSearchProps = {
  options: { value: string; label: string }[];
  selectedOptions: string[];
  setSelectedOptions: (selectedOptions: string[]) => void;
  label?: LabelsObj;
};

const WIDTH = "w-[225px]";

export const MultiSelectSearch = ({
  options,
  selectedOptions,
  setSelectedOptions,
  label,
}: MultiSelectSearchProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((option) => option !== value)
      : [...selectedOptions, value];
    setSelectedOptions(newSelectedOptions);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`${WIDTH} justify-between ${getEllipsed}`}
        >
          {selectedOptions.length === 1
            ? `${selectedOptions[0]} selected`
            : selectedOptions.length > 1
            ? `${selectedOptions.length} ${label?.plural ?? "options"}`
            : `Select ${label?.plural ?? "options"}...`}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${WIDTH} p-0`}>
        <Command>
          <CommandInput
            placeholder={`Search a ${label?.singular ?? "option"}...`}
          />
          {selectedOptions.length > 0 && (
            <CommandGroup className="border-b">
              <CommandItem
                onSelect={() => setSelectedOptions([])}
                className="text-red-500 aria-selected:text-destructive-foreground aria-selected:bg-destructive"
              >
                <X className={cn("mr-2 h-4 w-4")} />
                Clear{" "}
                {selectedOptions.length > 1
                  ? label?.plural ?? "options"
                  : label?.singular ?? "option"}
              </CommandItem>
            </CommandGroup>
          )}
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
                      selectedOptions.includes(option.value)
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
