import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { accordionData } from "./utils/accordion-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ProfileBlock = () => {
  return (
    <ScrollArea className="h-[calc(100vh-250px)]">
      <Accordion type="single" collapsible className="w-full">
        {accordionData.map((accordion) => (
          <AccordionItem key={accordion.key} value={accordion.key}>
            <AccordionTrigger>{accordion.title}</AccordionTrigger>
            <AccordionContent>{accordion.data}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};
