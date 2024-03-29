"use client";

import { useDateFormat } from "@/hooks/use-date-format";
import { format } from "date-fns";

type DateCellProps = {
  date: string;
  center?: boolean;
};

export const DateCell = ({ date, center = false }: DateCellProps) => {
  const { dateFormat } = useDateFormat();
  return (
    <p className={`w-[90px] ${center ? "text-center" : ""}`}>
      {format(new Date(date), dateFormat)}
    </p>
  );
};
