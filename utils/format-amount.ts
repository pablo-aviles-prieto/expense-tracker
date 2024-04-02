"use client";

import { formatterUS } from "./const";

export const formatAmount = (price: number) => {
  return price % 1 === 0 ? price : formatterUS.format(price);
};
