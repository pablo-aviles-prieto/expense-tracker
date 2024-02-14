import { useTheme } from "next-themes";
import React from "react";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltipContent = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const { resolvedTheme } = useTheme();

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
          // color: "var(--foreground, #000)",
          padding: "10px",
        }}
      >
        <p>{label}</p>
        {payload.map((entry, index) => (
          <p key={index}>${entry.value}</p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomTooltipContent;
