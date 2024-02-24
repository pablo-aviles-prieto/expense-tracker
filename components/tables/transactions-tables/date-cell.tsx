"use client";

import { useDateFormat } from "@/hooks/use-date-format";
import { format } from "date-fns";

type DateCellProps = {
  date: string;
};

export const DateCell = ({ date }: DateCellProps) => {
  const { dateFormat } = useDateFormat();
  return <p className="min-w-[90px]">{format(new Date(date), dateFormat)}</p>;
};
