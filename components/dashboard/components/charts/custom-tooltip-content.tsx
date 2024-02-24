"use client";

import { useDateFormat } from "@/hooks/use-date-format";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import React from "react";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  formatLabelDate?: boolean;
}

export const CustomTooltipContent = ({
  active,
  payload,
  label,
  formatLabelDate = false,
}: CustomTooltipProps) => {
  const { resolvedTheme } = useTheme();
  const { dateFormat } = useDateFormat();

  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor:
            resolvedTheme === "dark" ? "hsl(24 9.8% 10%)" : "hsl(0 0% 100%)",
          borderColor: "var(--border, #000)",
          borderRadius: "var(--radius, 15px)",
          borderStyle: "solid",
          borderWidth: "2px",
          padding: "10px",
        }}
      >
        <p className="font-semibold text-center">
          {formatLabelDate ? format(new Date(label), dateFormat) : label}
        </p>
        {payload.map((entry, index) => (
          <p style={{ color: entry.color }} key={index}>
            {entry.dataKey}:{" "}
            <span className="font-semibold">{entry.value}€</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltipContent;
