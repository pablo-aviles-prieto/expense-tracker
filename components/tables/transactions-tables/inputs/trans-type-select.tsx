import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

type TransTypeSelectProps = {
  createQueryString: (params: Record<string, string | number | null>) => string;
  setFilterType: (filterType: string) => void;
};

export const TransTypeSelect = ({
  createQueryString,
  setFilterType,
}: TransTypeSelectProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      onValueChange={(filterType) => {
        setFilterType(filterType);
        router.push(
          `${pathname}?${createQueryString({
            filterType: filterType || null,
            filterValue: null,
          })}`,
          { scroll: false },
        );
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Filter type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Name">Name</SelectItem>
          <SelectItem value="Amount">Amount</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
