import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TransTypeSelectProps = {
  filterOperator: string;
  onFilterOperatorChange: (filterOperator: string) => void;
};

export const FilterOperatorSelect = ({
  filterOperator,
  onFilterOperatorChange,
}: TransTypeSelectProps) => {
  return (
    <Select
      defaultValue="gt"
      value={filterOperator}
      onValueChange={onFilterOperatorChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filter the transactions" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="gt">{">"}</SelectItem>
          <SelectItem value="lt">{"<"}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
