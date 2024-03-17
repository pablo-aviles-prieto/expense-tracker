import type { NavItemWithOptionalChildren } from "@/types";

const isPathIncluded = (
  item: NavItemWithOptionalChildren,
  path: string,
): boolean => {
  if (item.href === path) return true;
  if (item.subItems)
    return item.subItems.some((subItem) => isPathIncluded(subItem, path));
  return false;
};

export const findNavOpenItems = (
  items: NavItemWithOptionalChildren[],
  path: string,
  prefix: string = "",
): string[] => {
  return items.reduce((acc: string[], item) => {
    const itemId = `${prefix}item-${item.label}`;
    if (isPathIncluded(item, path) && item.subItems) {
      acc.push(itemId);
      if (item.subItems) {
        acc.push(...findNavOpenItems(item.subItems, path, `${itemId}-`));
      }
    }
    return acc;
  }, []);
};
