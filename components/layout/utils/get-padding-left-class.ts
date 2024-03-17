export const getPaddingLeftClass = (depth: number) => {
  switch (depth) {
    case 1:
      return "pl-8";
    case 2:
      return "pl-16";
    case 3:
      return "pl-24";
    case 4:
      return "pl-32";
    default:
      return "";
  }
};
