import { LoadingSpinner } from "@/components/ui/spinner";
import type { TransactionObjBack } from "@/types";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  isLoading: boolean;
};

export const TransactionsPieChart = ({ filteredData, isLoading }: Props) => {
  return isLoading ? (
    <div className="flex items-center justify-center pt-28">
      <LoadingSpinner size={140} />
    </div>
  ) : !filteredData || filteredData.length === 0 ? (
    <div className="flex items-center justify-center pt-36">
      <p className="text-lg font-semibold">
        There is no data for the selected dates
      </p>
    </div>
  ) : (
    <div>Ay lmao</div>
  );
};
