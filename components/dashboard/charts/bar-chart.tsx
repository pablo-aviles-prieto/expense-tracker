"use client";

import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type Props = {
  data: Record<string, any>[];
};

export const BarChartBlock = ({ data }: Props) => {
  const { resolvedTheme } = useTheme();

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
          cursor={{ fill: "transparent" }}
          formatter={(value: number, name: string, props: any) => [
            `$${value}`,
            props.payload.name,
          ]}
          contentStyle={{
            backgroundColor:
              resolvedTheme === "dark" ? "hsl(24 9.8% 10%)" : "hsl(0 0% 100%)",
            borderColor: "var(--border, #000)",
            borderRadius: "var(--radius, 15px)",
            borderStyle: "solid",
            borderWidth: "2px",
            color: "var(--foreground, #000)",
          }}
        />
        <Legend />
        <Bar
          dataKey="incomes"
          fill="#419644"
          name="Incomes"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          fill="#dd3d32"
          name="Expenses"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
