// Split the string at each uppercase letter and join with a space,
// then capitalize the first letter of each word
export const formatEnumKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getEnumKeyByEnumValue = (
  enumObj: any,
  enumValue: string,
): string | null => {
  const keys = Object.keys(enumObj).filter((x) => enumObj[x] === enumValue);
  return keys.length > 0 ? keys[0] : null;
};
