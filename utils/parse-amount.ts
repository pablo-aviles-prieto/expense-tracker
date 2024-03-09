export const parseAmount = (amountString: string) => {
  const normalizedAmountString = amountString
    .replace(/,/g, ".")
    .replace(/[^\d.-]/g, "");
  const parsedAmount = Number(normalizedAmountString);
  return isNaN(parsedAmount) ? 0 : parsedAmount;
};
