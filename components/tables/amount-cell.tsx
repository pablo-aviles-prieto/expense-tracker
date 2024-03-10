"use client";

import { useCurrency } from "@/hooks/use-currency";
import { formatterUS } from "@/utils/const";
import { parseAmount } from "@/utils/parse-amount";

type AmountCellProps = {
  amount: string;
};

export const AmountCell = ({ amount }: AmountCellProps) => {
  const { currency } = useCurrency();
  const parsedAmount = parseAmount(String(amount));
  return (
    <p className="pr-1 text-right min-w-[75px]">
      {formatterUS.format(parsedAmount)} {currency}
    </p>
  );
};
