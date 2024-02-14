import { useTheme } from "next-themes";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltipContent } from "./custom-tooltip-content";

type Props = {
  data: Record<string, any>[];
};

export const LineChartBlock = ({ data }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          type="category"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
        />
        <YAxis type="number" stroke="#888888" fontSize={12} tickLine={false} />
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
        {/* <Tooltip
          content={<CustomTooltipContent />}
          cursor={{ fill: "transparent" }}
        /> */}
        <Legend />
        <Line
          type="monotone"
          dataKey="incomes"
          stroke="#419644"
          name="Incomes"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#dd3d32"
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
