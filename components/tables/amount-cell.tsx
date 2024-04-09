"use client";

import { useCurrency } from "@/hooks/use-currency";
import { formatAmount } from "@/utils/format-amount";
import { parseAmount } from "@/utils/parse-amount";

type AmountCellProps = {
  amount: string;
  textLeft?: boolean;
};

export const AmountCell = ({ amount, textLeft = false }: AmountCellProps) => {
  const { currency } = useCurrency();
  const parsedAmount = parseAmount(String(amount));
  return (
    <p className={`pr-1 ${textLeft ? "text-left" : "text-right"} min-w-[95px]`}>
      {formatAmount(parsedAmount)} {currency}
    </p>
  );
};
