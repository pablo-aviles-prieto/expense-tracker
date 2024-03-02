import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEllipsed } from "@/utils/const";

type TransTypeSelectProps = {
  transType: string;
  onTransTypeChange: (transType: string) => void;
};

export const TransTypeSelect = ({
  transType,
  onTransTypeChange,
}: TransTypeSelectProps) => {
  return (
    <Select
      defaultValue="both"
      value={transType}
      onValueChange={onTransTypeChange}
    >
      <SelectTrigger className={`${getEllipsed} w-[180px]`}>
        <SelectValue placeholder="Filter the transactions" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="both">Incomes & Expenses</SelectItem>
          <SelectItem value="incomes">Incomes</SelectItem>
          <SelectItem value="expenses">Expenses</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
