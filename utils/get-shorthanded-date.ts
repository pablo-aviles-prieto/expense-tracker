import { shortDateFormat } from "./const";

type ShorthandedDateProps = {
  dateTypeOptions: Record<string, string>;
  dateValue: string;
};

const invertObject = (obj: ShorthandedDateProps["dateTypeOptions"]) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key]),
  );
};

const getKeyFromValue = ({
  dateTypeOptions,
  dateValue,
}: ShorthandedDateProps) => {
  const invertedDateFormat = invertObject(dateTypeOptions);
  return invertedDateFormat[dateValue];
};

export const getShorthandedDate = ({
  dateTypeOptions,
  dateValue,
}: ShorthandedDateProps) => {
  return shortDateFormat[
    getKeyFromValue({
      dateTypeOptions,
      dateValue,
    }) as keyof typeof shortDateFormat
  ];
};
