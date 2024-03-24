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
