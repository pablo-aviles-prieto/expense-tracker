"use client";

import { useCurrency } from "@/hooks/use-currency";

type AmountCellProps = {
  amount: string;
};

export const AmountCell = ({ amount }: AmountCellProps) => {
  const { currency } = useCurrency();
  return (
    <p className="pr-1 text-right">
      {amount} {currency}
    </p>
  );
};
