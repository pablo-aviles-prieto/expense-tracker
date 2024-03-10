export const capitalizeFirstLetter = (input: string): string => {
  if (input.length === 0) {
    return input;
  }

  const firstChar = input.charAt(0).toUpperCase();
  const restOfString = input.slice(1).toLowerCase();

  return firstChar + restOfString;
};
