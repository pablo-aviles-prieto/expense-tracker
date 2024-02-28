import { Input } from "@/components/ui/input";
import { FilterTypeSelect } from "./inputs/filter-type-select";
import { TransTypeSelect } from "./inputs/trans-type-select";
import { PaginationState, type Table } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { DEFAULT_PAGE } from "@/utils/const";
import { useState } from "react";
import { FilterOperatorSelect } from "./inputs/filter-operator-select";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type FilterInputsProps<TData> = {
  searchKey: string;
  table: Table<TData>;
  setPagination: (value: React.SetStateAction<PaginationState>) => void;
  date: DateRange | undefined;
  onSetDate: (dateRange: DateRange | undefined) => Promise<void>;
  createQueryString: (params: Record<string, string | number | null>) => string;
};

// TODO: Add a button on the input text to clear the data (Maybe in the Input itself,
// but it might be too hard to handle the setler, since i need to set null the query param)
// TODO: Add a select input when the filterType === 'Amount' to select > or <
// (this input could be inside the input type number of filterValue)
// TODO: Add a multiple select to filter by categories
// Remove the search name and move the filterValue to the left
// TODO: Style for mobile (tiny width)!
export const FilterInputs = <TData,>({
  searchKey,
  table,
  setPagination,
  date,
  createQueryString,
  onSetDate,
}: FilterInputsProps<TData>) => {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterValue, setFilterValue] = useState("");
  const [transType, setTransType] = useState("both");
  const [filterOperator, setFilterOperator] = useState("gt");
  const router = useRouter();
  const pathname = usePathname();

  const onFilterTypeChange = (filterType: string) => {
    setFilterValue("");
    setFilterType(filterType);

    router.push(
      `${pathname}?${createQueryString({
        filterType: filterType || null,
        filterValue: null,
        filterOperator: filterType === "Amount" ? filterOperator : null,
      })}`,
      { scroll: false },
    );
  };

  const onTransTypeChange = (transType: string) => {
    const resetFilterTypeAndValue =
      transType !== "both" && filterType === "Amount";
    if (resetFilterTypeAndValue) {
      setFilterValue("");
      setFilterType(undefined);
    }

    setTransType(transType);
    router.push(
      `${pathname}?${createQueryString({
        transType: transType === "both" ? null : transType,
        filterOperator: null,
        ...(resetFilterTypeAndValue ? { filterType: null } : {}),
        ...(resetFilterTypeAndValue ? { filterValue: null } : {}),
      })}`,
      { scroll: false },
    );
  };

  const onFilterOperatorChange = (filterOperator: string) => {
    setFilterOperator(filterOperator);
    router.push(`${pathname}?${createQueryString({ filterOperator })}`, {
      scroll: false,
    });
  };

  const onResetFilters = () => {
    // TODO: Clear the categories
    setFilterValue("");
    setFilterType(undefined);
    setTransType("both");

    router.push(
      `${pathname}?${createQueryString({
        filterType: null,
        filterValue: null,
        filterOperator: null,
        transType: null,
      })}`,
      { scroll: false },
    );
  };

  return (
    <ScrollArea className="pb-3 overflow-y-hidden">
      <div className="flex items-center justify-between gap-x-2 min-h-[40px]">
        <div className="flex items-center gap-x-2">
          {(filterType || filterValue || transType !== "both") && (
            <Button
              variant="destructive"
              className="text-[13px]"
              onClick={onResetFilters}
            >
              Remove filters
            </Button>
          )}
          <TransTypeSelect
            transType={transType}
            onTransTypeChange={onTransTypeChange}
          />
          <FilterTypeSelect
            filterType={filterType}
            onFilterTypeChange={onFilterTypeChange}
          />
          {filterType && (
            <div className="relative">
              <Input
                placeholder={
                  filterType === "Amount"
                    ? "Filter by amount"
                    : "Filter by name"
                }
                type={filterType === "Amount" ? "number" : "text"}
                value={filterValue}
                onChange={(e) => {
                  const resetTransType =
                    filterType === "Amount" && e.target.value;
                  if (resetTransType) {
                    setTransType("both");
                  }
                  setFilterValue(e.target.value);
                  router.push(
                    `${pathname}?${createQueryString({
                      filterValue: e.target.value || null,
                      ...(resetTransType ? { transType: null } : {}),
                    })}`,
                    { scroll: false },
                  );
                }}
                className={`max-w-[200px] ${
                  filterType === "Amount" ? "pl-11" : ""
                }`}
              />
              {filterType === "Amount" && (
                <div className="absolute top-0 left-0 w-[37px]">
                  <FilterOperatorSelect
                    filterOperator={filterOperator}
                    onFilterOperatorChange={onFilterOperatorChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <CalendarDateRangePicker date={date} setDate={onSetDate} />
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
};
