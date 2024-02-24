"use client";

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltipContent } from "./custom-tooltip-content";
import { format } from "date-fns";
import { useDateFormat } from "@/hooks/use-date-format";
import { getShorthandedDate } from "@/utils/get-shorthanded-date";

type Props = {
  data: Record<string, any>[];
};

export const LineChartBlock = ({ data }: Props) => {
  const { dateFormat, availableDateFormatTypes } = useDateFormat();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          type="category"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          tickFormatter={(date) => {
            return format(
              new Date(date),
              getShorthandedDate({
                dateTypeOptions: availableDateFormatTypes,
                dateValue: dateFormat,
              }),
            );
          }}
        />
        <YAxis type="number" stroke="#888888" fontSize={12} tickLine={false} />
        <Tooltip
          content={<CustomTooltipContent formatLabelDate />}
          cursor={{ stroke: "rgba(136, 136, 136, 0.9)", strokeWidth: 0.2 }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="incomes"
          stroke="#419644"
          name="Incomes"
          dot={{ stroke: "#419644", strokeWidth: 0, fill: "transparent" }}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#dd3d32"
          name="Expenses"
          dot={{ stroke: "#dd3d32", strokeWidth: 0, fill: "transparent" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
