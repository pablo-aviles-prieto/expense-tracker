"use client";

import { usePathname } from "next/navigation";
import type { NavItemWithOptionalChildren } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { RenderNavItem } from "./utils/render-nav-item";
import { findNavOpenItems } from "./utils/find-nav-open-items";

interface DashboardNavProps {
  items: NavItemWithOptionalChildren[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();
  const initialOpenItems = findNavOpenItems(items, path);
  const [openItems, setOpenItems] = useState<string[]>(initialOpenItems);

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const itemId = `item-${item.label}`;
        return (
          <RenderNavItem
            openItems={openItems}
            key={index}
            item={item}
            path={path}
            setOpen={setOpen}
            setOpenItems={setOpenItems}
            itemId={itemId}
          />
        );
      })}
    </nav>
  );
}
