"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DEVICE_TYPE } from "@/types/device";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (e: DateRange | undefined) => void;
  viewport?: string;
}

export function CalendarDateRangePicker({
  date,
  setDate,
  className,
  viewport,
}: Props) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(e) => {
                setDate(e);
              }}
              numberOfMonths={viewport === DEVICE_TYPE.mobile ? 1 : 2}
            />
            <Button
              variant="secondary"
              className="self-center mb-1"
              onClick={() => setDate(undefined)}
            >
              Clear Dates
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
