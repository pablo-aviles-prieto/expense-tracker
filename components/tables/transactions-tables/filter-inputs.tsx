import { Input } from "@/components/ui/input";
import { FilterTypeSelect } from "./inputs/filter-type-select";
import { TransTypeSelect } from "./inputs/trans-type-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { DEFAULT_PAGE } from "@/utils/const";
import { useMemo, useState } from "react";
import { FilterOperatorSelect } from "./inputs/filter-operator-select";
import { buttonVariants } from "@/components/ui/button";
import { MultiSelectSearch } from "@/components/combobox/multi-select-search";
import type { Categories } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterInputsProps = {
  date: DateRange | undefined;
  userCategories: Categories[];
  viewport: string | undefined;
  onSetDate: (dateRange: DateRange | undefined) => Promise<void>;
  createQueryString: (params: Record<string, string | number | null>) => string;
};

export const FilterInputs = ({
  date,
  userCategories,
  viewport,
  createQueryString,
  onSetDate,
}: FilterInputsProps) => {
  const searchParams = useSearchParams();
  const categoriesParam = searchParams.get("categories");
  const [filterType, setFilterType] = useState<string | undefined>(
    searchParams.get("filterType") ?? undefined,
  );
  const [filterValue, setFilterValue] = useState(
    searchParams.get("filterValue") ?? "",
  );
  const [transType, setTransType] = useState(
    searchParams.get("transType") ?? "both",
  );
  const [filterOperator, setFilterOperator] = useState(
    searchParams.get("filterOperator") ?? "gt",
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoriesParam ? categoriesParam.split(",") : [],
  );
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

  const onFilterOperatorChange = (filterOperator: string) => {
    setFilterOperator(filterOperator);
    router.push(
      `${pathname}?${createQueryString({
        filterOperator,
        page: DEFAULT_PAGE,
      })}`,
      {
        scroll: false,
      },
    );
  };

  const onCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    router.push(
      `${pathname}?${createQueryString({
        page: DEFAULT_PAGE,
        categories: categories.length > 0 ? categories.join(",") : null,
      })}`,
      {
        scroll: false,
      },
    );
  };

  const onResetFilters = () => {
    setFilterValue("");
    setFilterType(undefined);
    setTransType("both");
    setSelectedCategories([]);

    router.push(
      `${pathname}?${createQueryString({
        page: DEFAULT_PAGE,
        filterType: null,
        filterValue: null,
        filterOperator: null,
        transType: null,
        categories: null,
      })}`,
      { scroll: false },
    );
  };

  return (
    <div className="flex items-center justify-between gap-x-2 min-h-[40px]">
      <div className="flex items-center gap-x-2">
        {(filterType ||
          filterValue ||
          transType !== "both" ||
          selectedCategories.length > 0) && (
          <Tooltip>
            <TooltipTrigger>
              <div
                onClick={onResetFilters}
                className={cn(
                  buttonVariants({ variant: "destructive", size: "icon" }),
                )}
              >
                <X className="w-5 h-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-bold">Reset all filters</p>
            </TooltipContent>
          </Tooltip>
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
                filterType === "Amount" ? "Filter by amount" : "Filter by name"
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
          selectedOptions={selectedCategories}
          setSelectedOptions={onCategoryChange}
          options={parsedCategories}
        />
      </div>
      <CalendarDateRangePicker
        viewport={viewport}
        date={date}
        setDate={onSetDate}
      />
    </div>
  );
};
