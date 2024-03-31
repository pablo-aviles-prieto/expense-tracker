"use client";

import { AccordionBlock } from "./accordion-block";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CustomSessionI } from "@/types";

interface ProfileBlockProps {
  session: CustomSessionI;
}

export const ProfileBlock = ({ session }: ProfileBlockProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <AccordionBlock userId={session.user?.id ?? ""} />
    </ScrollArea>
  );
};
