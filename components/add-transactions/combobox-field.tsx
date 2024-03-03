"use client";

import { useAddTransactionTable } from "@/hooks/use-add-transaction-table";
import { MultiSelectSearch } from "../combobox/multi-select-search";

type ComboboxFielProps = {
  selectedRow: number;
  selectedCategories: string[] | undefined;
};

export const ComboboxField = ({
  selectedRow,
  selectedCategories,
}: ComboboxFielProps) => {
  const { userCategories, updateTransactionCategories } =
    useAddTransactionTable();

  const handleCategoryChange = (selectedCategories: string[]) => {
    updateTransactionCategories(selectedRow, selectedCategories);
  };

  return (
    <MultiSelectSearch
      label={{ singular: "category", plural: "categories" }}
      selectedOptions={selectedCategories ?? []}
      setSelectedOptions={handleCategoryChange}
      options={userCategories.map((category) => ({
        value: category.name,
        label: category.name,
      }))}
    />
  );
};
