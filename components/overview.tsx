"use client";

import { useFetch } from "@/hooks/use-fetch";
import { useCustomSession } from "@/hooks/user-custom-session";
import type { TransactionObjBack } from "@/types";
import { dateFormat } from "@/utils/const";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

const URL_POST_TRANSACTION = `/api/transactions/filtered`;

type ResponseFilteredDataI = {
  ok: boolean;
  transactions?: TransactionObjBack[];
  error?: string;
};

type Props = {
  from: Date | undefined;
  to: Date | undefined;
};

export function Overview({ from, to }: Props) {
  const { resolvedTheme } = useTheme();
  const { fetchPetition } = useFetch();
  const { data: dataSession } = useCustomSession();

  useEffect(() => {
    if (!from || !to || !dataSession) return;

    const fetchData = async () => {
      const formatedStartDate = format(new Date(from), dateFormat.ISO);
      const formatedEndDate = format(new Date(to), dateFormat.ISO);
      const URL = `${URL_POST_TRANSACTION}?startDate=${formatedStartDate}&endDate=${formatedEndDate}$`;
      const response = await fetchFilteredTransactions(URL);
      console.log("response", response);
    };
    fetchData();
  }, [from, to, dataSession]);

  const fetchFilteredTransactions = async (url: string) => {
    const extraHeaders = {
      Authorization: `Bearer ${dataSession?.accessToken || ""}`,
    };
    return fetchPetition<ResponseFilteredDataI>({
      url,
      method: "GET",
      extraHeaders,
    });
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
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
        <Bar dataKey="total" fill="#1da850" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
