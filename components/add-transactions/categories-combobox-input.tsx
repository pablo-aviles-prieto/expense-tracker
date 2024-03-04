"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
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
import { useAddTransactionTable } from "@/hooks/use-add-transaction-table";
import type { EnhancedCategory } from "@/types";

type CategoriesComboboxInputProps = {
  selectedOptions: string[];
  selectedRow: number;
};

const WIDTH = "w-[225px]";

export const CategoriesComboboxInput = ({
  selectedOptions,
  selectedRow,
}: CategoriesComboboxInputProps) => {
  const [currentInput, setCurrentInput] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { userCategories, setUserCategories, updateTransactionCategories } =
    useAddTransactionTable();

  const categories = React.useMemo(
    () =>
      userCategories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [userCategories],
  );

  const updateUserCategories = React.useCallback(
    (newObj: EnhancedCategory) => {
      setUserCategories((prevState) => [...prevState, newObj]);
    },
    [setUserCategories],
  );

  const handleSelect = React.useCallback(
    (value: string) => {
      const newSelectedOptions = selectedOptions.includes(value)
        ? selectedOptions.filter((option) => option !== value)
        : [...selectedOptions, value];
      updateTransactionCategories(selectedRow, newSelectedOptions);
    },
    [selectedOptions, updateTransactionCategories, selectedRow],
  );

  const renderCreateInput = React.useMemo(
    () =>
      !!currentInput &&
      !categories.some(
        (cat) => cat.label.toLowerCase() === currentInput.toLowerCase(),
      ),
    [currentInput, categories],
  );

  // The user will be able to create always the category and will have to check if
  // that category already exists. In that case, select the existed one instead of
  // creating a new one in the updateUserCategories, since there is a bug that whenever
  // I type an existing category, it wont appear again until I remove the whole searched
  // value, the possibility of create the category
  const onAddNewCategory = () => {
    const newValue = currentInput.trim();
    if (newValue) {
      const newCat = {
        name: newValue,
        id: String(userCategories.length + 1),
        newEntry: true,
      };
      updateTransactionCategories(selectedRow, [...selectedOptions, newValue]);
      updateUserCategories(newCat);
      setCurrentInput("");
    }
  };
  // console.log("userCategories", userCategories);

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
            ? `${selectedOptions.length} categories`
            : `Select categories...`}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${WIDTH} p-0`}>
        <Command>
          <CommandInput
            placeholder={`Search a category...`}
            onValueChange={(value) => setCurrentInput(value)}
            value={currentInput}
          />
          <ScrollArea maxHeight={225}>
            <CommandGroup>
              {categories.map((cat) => (
                <CommandItem
                  key={cat.value}
                  value={cat.label}
                  onSelect={() => handleSelect(cat.label)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOptions.includes(cat.label)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {cat.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {renderCreateInput && (
              <CommandGroup className="border-t">
                <CommandItem
                  onSelect={onAddNewCategory}
                  className="text-green-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add &apos;{currentInput}&apos;
                </CommandItem>
              </CommandGroup>
            )}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
