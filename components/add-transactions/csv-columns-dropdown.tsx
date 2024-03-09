"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATES_CSV_FORMAT_OPTIONS, FIELDS_FROM_CSV } from "@/utils/const";
import { format } from "date-fns";

const schemaObject = {
  ...FIELDS_FROM_CSV.reduce(
    (acc, field) => {
      acc[field] = z.string({
        required_error: `Need to select an option to parse the ${field}`,
      });
      return acc;
    },
    {} as Record<string, z.ZodString>,
  ),
  DateFormat: z.string({
    required_error: "Need to select the date format on your CSV",
  }),
} as Record<string, z.ZodString>;

const formSchema = z.object(schemaObject);

type CSVColumnsDropdownProps = {
  options: string[];
};

export const CSVColumnsDropdown = ({ options }: CSVColumnsDropdownProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("values", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormDescription>
          - Please <span className="font-bold">identify the columns</span> in
          your CSV for{" "}
          <span className="font-bold">Date, Description/Concept, Amount</span>,
          and <span className="font-bold">Notes</span>, and select the{" "}
          <span className="font-bold">date format</span>. This ensures your
          transactions are imported correctly.
        </FormDescription>
        <FormDescription className="mb-1">
          - When uploading <span className="font-bold">multiple files</span>,
          ensure they{" "}
          <span className="font-bold">share identical columns/headers</span>.
          The system only evaluates the last uploaded file&apos;s structure for
          import accuracy.
        </FormDescription>
        <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(schemaObject).map((column) => (
            <FormField
              key={column}
              control={form.control}
              name={column}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {column === "Concept"
                      ? "Description/Concept"
                      : column === "DateFormat"
                      ? "Date Format"
                      : column}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select your ${
                            column === "Concept"
                              ? "Description"
                              : column === "DateFormat"
                              ? "Date Format"
                              : column
                          } column`}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {column === "DateFormat"
                        ? DATES_CSV_FORMAT_OPTIONS.map((dateFormatOption) => (
                            <SelectItem
                              key={dateFormatOption}
                              value={dateFormatOption}
                            >
                              {format(new Date(), dateFormatOption)}
                            </SelectItem>
                          ))
                        : options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex w-full my-2 mt-6 sm:justify-center">
          <Button className="w-full sm:w-[200px]" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
