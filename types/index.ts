import { Icons } from "@/components/icons";

export * from "./get-values-from-obj";
export * from "./custom-session";
export * from "./user";
export * from "./categories";
export * from "./toaster-toast";
export * from "./transaction";
export * from "./subscriptions";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  subItems: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  subItems?: NavItemWithOptionalChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
