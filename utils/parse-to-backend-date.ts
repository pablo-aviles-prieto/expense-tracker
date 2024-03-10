import { dateFormat } from "@/utils/const";
import { format, parse } from "date-fns";

type Params = {
  dateString: string;
  dateFormatFromCSV: string;
};

export const parseToBackendDate = ({
  dateString,
  dateFormatFromCSV,
}: Params) => {
  const parsedDate = parse(dateString, dateFormatFromCSV, new Date());
  return format(parsedDate, dateFormat.ISO);
};
