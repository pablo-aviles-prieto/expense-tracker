"use client";

import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { NavItemWithOptionalChildren } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RenderNavLink } from "./utils/render-nav-link";

interface DashboardNavProps {
  items: NavItemWithOptionalChildren[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const [openItem, setOpenItem] = useState<string>("");
  const path = usePathname();

  useEffect(() => {
    const match = items.findIndex(
      (item) => item.subItems?.some((subItem) => path === subItem.href),
    );
    if (match !== -1) {
      setOpenItem(`item-${match}`);
    }
  }, [path, items]);

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        const itemId = `item-${index}`;
        const isItemOpen = openItem === itemId;
        const isSubPathSelected = (item?.subItems ?? []).some(
          (subItem) => subItem.href === path,
        );
        return item.subItems ? (
          <span key={index} className={cn("text-sm font-medium")}>
            <Accordion
              type="single"
              value={isItemOpen ? itemId : ""}
              collapsible={true}
              onValueChange={setOpenItem}
            >
              <AccordionItem value={itemId} className="border-b-0">
                <AccordionTrigger
                  className={`px-3 py-2 rounded-md hover:no-underline hover:bg-accent hover:text-accent-foreground ${
                    isSubPathSelected ? "bg-accent" : "transparent"
                  }`}
                >
                  <span className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {item.subItems.map((subItem, subIndex) => (
                    <RenderNavLink
                      key={subIndex}
                      index={subIndex}
                      item={subItem}
                      path={path}
                      isSubItem
                      setOpen={setOpen}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </span>
        ) : (
          item.href && (
            <RenderNavLink
              key={index}
              index={index}
              item={item}
              path={path}
              setOpen={setOpen}
            />
          )
        );
      })}
    </nav>
  );
}
