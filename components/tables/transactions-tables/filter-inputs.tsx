import { Input } from "@/components/ui/input";
import { FilterTypeSelect } from "./inputs/filter-type-select";
import { TransTypeSelect } from "./inputs/trans-type-select";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { DEFAULT_PAGE } from "@/utils/const";
import { useMemo, useState } from "react";
import { FilterOperatorSelect } from "./inputs/filter-operator-select";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MultiSelectSearch } from "@/components/combobox/multi-select-search";
import type { Categories } from "@/types";

type FilterInputsProps = {
  date: DateRange | undefined;
  userCategories: Categories[];
  onSetDate: (dateRange: DateRange | undefined) => Promise<void>;
  createQueryString: (params: Record<string, string | number | null>) => string;
};

// TODO: Look at the searchParams to initiate the states so the filters might be
// populated from queryParams if proceed
// TODO: Add a multiple select to filter by categories!
export const FilterInputs = ({
  date,
  userCategories,
  createQueryString,
  onSetDate,
}: FilterInputsProps) => {
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterValue, setFilterValue] = useState("");
  const [transType, setTransType] = useState("both");
  const [filterOperator, setFilterOperator] = useState("gt");
  const router = useRouter();
  const pathname = usePathname();

  const parsedCategories = useMemo(
    () => userCategories.map((cat) => ({ value: cat.name, label: cat.name })),
    [userCategories],
  );

  const onFilterTypeChange = (filterType: string) => {
    setFilterValue("");
    setFilterType(filterType);

    router.push(
      `${pathname}?${createQueryString({
        page: DEFAULT_PAGE,
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
        page: DEFAULT_PAGE,
        transType: transType === "both" ? null : transType,
        filterOperator: null,
        ...(resetFilterTypeAndValue ? { filterType: null } : {}),
        ...(resetFilterTypeAndValue ? { filterValue: null } : {}),
      })}`,
      { scroll: false },
    );
  };

  const onFilterOperatorChange = async (filterOperator: string) => {
    setFilterOperator(filterOperator);
    // setPagination({ pageIndex: 0, pageSize: 20 });
    router.push(
      `${pathname}?${createQueryString({
        filterOperator,
        page: DEFAULT_PAGE,
      })}`,
      {
        scroll: false,
      },
    );
    // setPagination((prev) => ({ ...prev, pageIndex: DEFAULT_PAGE - 1 }));
    // resetPagination();
  };

  const onResetFilters = () => {
    // TODO: Clear the categories!
    setFilterValue("");
    setFilterType(undefined);
    setTransType("both");

    router.push(
      `${pathname}?${createQueryString({
        page: DEFAULT_PAGE,
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
                      page: DEFAULT_PAGE,
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
          <MultiSelectSearch
            label={{ singular: "category", plural: "categories" }}
            options={parsedCategories}
          />
        </div>
        <CalendarDateRangePicker date={date} setDate={onSetDate} />
        <ScrollBar orientation="horizontal" />
      </div>
    </ScrollArea>
  );
};
