import { cn } from "@/lib/utils";
import type { NavItemWithOptionalChildren } from "@/types";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { getPaddingLeftClass } from "./get-padding-left-class";

type Props = {
  item: NavItemWithOptionalChildren;
  index: React.Key;
  path: string;
  isSubItem?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  depth?: number;
};

export const RenderNavLink = ({
  item,
  index,
  path,
  isSubItem = false,
  depth = 0,
  setOpen = undefined,
}: Props) => {
  const Icon = Icons[item.icon || "arrowRight"];
  const paddingLeft = getPaddingLeftClass(depth);

  return (
    <Link
      key={index}
      href={item.disabled ? "/" : item.href ?? ""}
      onClick={() => {
        if (setOpen) setOpen(false);
      }}
    >
      <span
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isSubItem ? `my-2 ${paddingLeft}` : "",
          path === item.href ? "bg-accent" : "transparent",
          item.disabled && "cursor-not-allowed opacity-80",
        )}
      >
        <Icon className="w-4 h-4 mr-2" />
        <span>{item.title}</span>
      </span>
    </Link>
  );
};
