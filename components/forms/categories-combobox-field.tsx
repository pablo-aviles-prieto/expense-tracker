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
import type { Categories, EnhancedCategory } from "@/types";

type CategoriesComboboxFieldProps = {
  selectedCategories: Categories[];
  userCats: Categories[];
  updateSelectedCategories: (cat: Categories[]) => void;
};

export const CategoriesComboboxField = ({
  selectedCategories,
  userCats,
  updateSelectedCategories,
}: CategoriesComboboxFieldProps) => {
  const [currentInput, setCurrentInput] = React.useState("");
  const [userCategories, setUserCategories] =
    React.useState<Categories[]>(userCats);
  const [open, setOpen] = React.useState(false);

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
    (catObj: { value: string; label: string }) => {
      const isAlreadySelected = selectedCategories.some(
        (cat) => cat.id === catObj.value,
      );

      let newSelectedCategories: EnhancedCategory[];
      if (isAlreadySelected) {
        newSelectedCategories = selectedCategories.filter(
          (cat) => cat.id !== catObj.value,
        );
      } else {
        const categoryToAdd = userCategories.find(
          (cat) => cat.id === catObj.value,
        );
        if (categoryToAdd) {
          newSelectedCategories = [...selectedCategories, categoryToAdd];
        } else {
          newSelectedCategories = [
            ...selectedCategories,
            { id: catObj.value, name: catObj.label },
          ];
        }
      }

      updateSelectedCategories(newSelectedCategories);
    },
    [selectedCategories, userCategories],
  );

  const onAddNewCategory = React.useCallback(() => {
    const newValue = currentInput.trim();
    if (!newValue) return;

    const existingCategory = userCategories.find(
      (cat) => cat.name.toLowerCase() === newValue.toLowerCase(),
    );

    if (existingCategory) {
      // Handle as if this existing category was selected
      handleSelect({
        value: existingCategory.id,
        label: existingCategory.name,
      });
    } else {
      // Create a new category and add it
      const newCat: EnhancedCategory = {
        id: String(userCategories.length + 1),
        name: newValue,
        newEntry: true,
      };

      updateUserCategories(newCat);
      updateSelectedCategories([...selectedCategories, newCat]);
    }

    setCurrentInput("");
  }, [
    currentInput,
    userCategories,
    updateUserCategories,
    setCurrentInput,
    handleSelect,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${getEllipsed}`}
        >
          {selectedCategories.length === 1
            ? `${selectedCategories[0].name} selected`
            : selectedCategories.length > 1
            ? `${selectedCategories.length} categories`
            : `Select categories...`}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command className="z-[99999]">
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
                  onSelect={() => handleSelect(cat)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.find(
                        (category) => category.id === cat.value,
                      )
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {cat.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup className="border-t">
              <CommandItem
                onSelect={onAddNewCategory}
                className="text-green-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add &apos;{currentInput}&apos;
              </CommandItem>
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
