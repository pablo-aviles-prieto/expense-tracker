import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ErrorBlockProps = {
  transError: string;
};

export const ErrorBlock = ({ transError }: ErrorBlockProps) => {
  return (
    <div className="text-center">
      <p className="text-xl leading-5 tracking-normal">
        There was an error retrieving the transactions
      </p>
      <p className="leading-5 text-muted-foreground">{transError}</p>
      <div className="my-4">
        <Link
          href={"/dashboard/transactions/list"}
          className={cn(buttonVariants({ size: "lg" }), "font-bold")}
        >
          Go back to the list
        </Link>
      </div>
    </div>
  );
};
