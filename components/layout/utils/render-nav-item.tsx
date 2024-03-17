import { Icons } from "@/components/icons";
import type { NavItemWithOptionalChildren } from "@/types";
import { getPaddingLeftClass } from "./get-padding-left-class";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RenderNavLink } from "./render-nav-link";

interface RenderNavItemProps {
  openItems: string[];
  item: NavItemWithOptionalChildren;
  path: string;
  itemId: string;
  setOpenItems: React.Dispatch<React.SetStateAction<string[]>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  depth?: number;
}

export const RenderNavItem = ({
  openItems,
  item,
  path,
  itemId,
  setOpenItems,
  setOpen = undefined,
  depth = 0,
}: RenderNavItemProps) => {
  const Icon = Icons[item.icon || "arrowRight"];
  const parsedItemId = `${itemId}${depth ? `-item-${item.label}` : ""}`;
  const isItemOpen = openItems.includes(parsedItemId);
  const paddingLeft = getPaddingLeftClass(depth);

  const isSubPathSelected =
    item.href === path ||
    item.subItems?.some((subItem) => subItem.href === path);

  const toggleItemOpen = () => {
    // it receives a value as argument, but its not fully working, only when opening the
    setOpenItems((currentOpenItems) => {
      return currentOpenItems.includes(parsedItemId)
        ? currentOpenItems.filter((id) => id !== parsedItemId)
        : [...currentOpenItems, parsedItemId];
    });
  };

  if (item.subItems && item.subItems.length > 0) {
    return (
      <Accordion
        type="single"
        value={isItemOpen ? parsedItemId : ""}
        collapsible={true}
        onValueChange={toggleItemOpen}
      >
        <AccordionItem value={parsedItemId} className="border-b-0">
          <AccordionTrigger
            className={`px-3 py-2 rounded-md hover:no-underline hover:bg-accent hover:text-accent-foreground ${
              isSubPathSelected ? "bg-accent" : "transparent"
            } ${paddingLeft}`}
          >
            <span className="flex items-center">
              <Icon className="w-4 h-4 mr-2" />
              {item.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {item.subItems.map((subItem, index) => (
              <RenderNavItem
                openItems={openItems}
                setOpenItems={setOpenItems}
                key={index}
                item={subItem}
                path={path}
                setOpen={setOpen}
                depth={depth + 1}
                itemId={parsedItemId}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  } else {
    return (
      <RenderNavLink
        index={path}
        item={item}
        path={path}
        isSubItem={depth > 0}
        setOpen={setOpen}
        depth={depth}
      />
    );
  }
};
