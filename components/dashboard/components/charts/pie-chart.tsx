"use client";

import { PieChart, Pie, ResponsiveContainer, Sector } from "recharts";
import type { PieChartData } from "../../types/pie-chart";
import { useState } from "react";
import { useCurrency } from "@/hooks/use-currency";
import { getEllipsed } from "@/utils/const";
import { formatAmount } from "@/utils/format-amount";

type PieChartBlockProps = {
  data: PieChartData;
  pieColor: string;
};

type RenderActiveShapeProps = {
  props: any;
  pieColor: string;
  currency: string;
};

const RADIAN = Math.PI / 180;

const renderActiveShape = ({
  props,
  pieColor,
  currency,
}: RenderActiveShapeProps) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <foreignObject x={cx - 50} y={cy - 8} width="95" height="40">
        <div
          className={`w-full text-sm text-[14px] text-center ${getEllipsed}`}
          style={{ color: fill.slice(0, -2) }}
        >
          {payload.name}
        </div>
      </foreignObject>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={pieColor}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#727272"
      >{`${formatAmount(value)}${currency}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${formatAmount(percent * 100)}%)`}
      </text>
    </g>
  );
};

export const PieChartBlock = ({ data, pieColor }: PieChartBlockProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { currency } = useCurrency();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={(props: any) =>
            renderActiveShape({ props, pieColor, currency })
          }
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={60}
          fill={`${pieColor}80`}
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
