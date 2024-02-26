import { Input } from "@/components/ui/input";
import { TransTypeSelect } from "./inputs/trans-type-select";
import { PaginationState, type Table } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { DEFAULT_PAGE } from "@/utils/const";
import { useState } from "react";

type FilterInputsProps<TData> = {
  searchKey: string;
  table: Table<TData>;
  setPagination: (value: React.SetStateAction<PaginationState>) => void;
  date: DateRange | undefined;
  onSetDate: (dateRange: DateRange | undefined) => Promise<void>;
  createQueryString: (params: Record<string, string | number | null>) => string;
};

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
  const router = useRouter();
  const pathname = usePathname();

  const onTransTypeChange = (filterType: string) => {
    setFilterValue("");
    setFilterType(filterType);
  };

  return (
    <div className="flex items-center justify-between gap-x-2">
      <Input
        placeholder={`Search ${searchKey}...`}
        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn(searchKey)?.setFilterValue(event.target.value);
          router.push(
            `${pathname}?${createQueryString({
              search: event.target.value || null,
            })}`,
            { scroll: false },
          );
          setPagination((prev) => ({ ...prev, pageIndex: DEFAULT_PAGE - 1 }));
        }}
        className="max-w-[200px]"
      />
      <div className="flex items-center gap-x-2">
        {filterType && (
          <Input
            placeholder={
              filterType === "Amount" ? "Filter by amount" : "Filter by name"
            }
            type={filterType === "Amount" ? "number" : "text"}
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              router.push(
                `${pathname}?${createQueryString({
                  filterValue: e.target.value || null,
                })}`,
                { scroll: false },
              );
            }}
            className="max-w-[200px]"
          />
        )}
        <TransTypeSelect
          setFilterType={onTransTypeChange}
          createQueryString={createQueryString}
        />
        <CalendarDateRangePicker date={date} setDate={onSetDate} />
      </div>
    </div>
  );
};
