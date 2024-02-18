"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import CustomTooltipContent from "./custom-tooltip-content";
import { EXPENSES_CHART_COLOR, INCOMES_CHART_COLOR } from "../../utils/const";

type Props = {
  data: Record<string, any>[];
};

export const BarChartBlock = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="horizontal">
        <XAxis
          type="category"
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltipContent />}
          cursor={{ fill: "rgba(119, 118, 118, 0.07)" }}
        />
        <Legend />
        <Bar
          dataKey="incomes"
          fill={INCOMES_CHART_COLOR}
          name="Incomes"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          fill={EXPENSES_CHART_COLOR}
          name="Expenses"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
