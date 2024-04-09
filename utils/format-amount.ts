"use client";

import { formatterUSTwoDecimals, formatterUSNoDecimals } from "./const";

export const formatAmount = (price: number) => {
  return price % 1 === 0
    ? formatterUSNoDecimals.format(price)
    : formatterUSTwoDecimals.format(price);
};
