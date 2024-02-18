"use client";

import Link from "next/link";
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
        return item.subItems ? (
          <span key={index} className={cn("text-sm font-medium")}>
            <Accordion
              type="single"
              value={isItemOpen ? itemId : ""}
              collapsible={true}
              onValueChange={setOpenItem}
            >
              <AccordionItem value={itemId} className="border-b-0">
                <AccordionTrigger className="px-3 py-2 rounded-md hover:no-underline hover:bg-accent hover:text-accent-foreground">
                  <span className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {item.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {item.subItems.map((subItem, subIndex) => {
                    const SubIcon = Icons[subItem.icon || "arrowRight"];
                    return (
                      <Link
                        key={subIndex}
                        href={subItem.disabled ? "/" : subItem.href ?? ""}
                        onClick={() => {
                          if (setOpen) setOpen(false);
                        }}
                      >
                        <span
                          className={cn(
                            "my-2 ml-4 group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            path === subItem.href ? "bg-accent" : "transparent",
                            subItem.disabled && "cursor-not-allowed opacity-80",
                          )}
                        >
                          <SubIcon className="w-4 h-4 mr-2" />
                          <span>{subItem.title}</span>
                        </span>
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </span>
        ) : (
          item.href && (
            <Link
              key={index}
              href={item.disabled ? "/" : item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
            >
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
