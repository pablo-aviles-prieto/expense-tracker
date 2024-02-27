import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterTypeSelectProps = {
  filterType: string | undefined;
  onFilterTypeChange: (filterType: string) => void;
};

export const FilterTypeSelect = ({
  filterType,
  onFilterTypeChange,
}: FilterTypeSelectProps) => {
  const [resetKey, setResetKey] = React.useState(0);

  // Work around to force the Select component to remount and show the placeholder
  // and not keep any selected value when set to undefined
  React.useEffect(() => {
    if (filterType === undefined) {
      setResetKey((prevKey) => prevKey + 1);
    }
  }, [filterType]);

  return (
    <Select
      key={resetKey}
      value={filterType}
      onValueChange={onFilterTypeChange}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Filter by..." />
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
