export const parseAmount = (numStr: string) => {
  // Remove any spaces to handle formats like "20 000,50"
  numStr = numStr.replace(/\s/g, "");

  // Determine the separator for the decimal point
  const lastCommaIndex = numStr.lastIndexOf(",");
  const lastPeriodIndex = numStr.lastIndexOf(".");
  let decimalSeparator = lastCommaIndex > lastPeriodIndex ? "," : ".";

  // Replace all separators that are not the decimal separator
  let thousandsSeparator = decimalSeparator === "." ? "," : ".";
  let cleanStr = numStr.replace(new RegExp(`\\${thousandsSeparator}`, "g"), "");

  // Replace the decimal separator with a period if it's a comma
  if (decimalSeparator === ",") {
    cleanStr = cleanStr.replace(",", ".");
  }

  // Parse the clean string to a number
  return parseFloat(cleanStr);
};
