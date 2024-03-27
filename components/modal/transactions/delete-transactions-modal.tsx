"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ClockLoader } from "../../icons/clock-loader";

interface DeleteTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  selectedTransactionsLength: number;
}

export const DeleteTransactionsModal: React.FC<
  DeleteTransactionsModalProps
> = ({ isOpen, onClose, onConfirm, loading, selectedTransactionsLength }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Do you want to delete the selected transactions?"
      description={`You have selected ${selectedTransactionsLength} transactions`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-end w-full pt-6 space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading && <ClockLoader className="mr-2" />}Continue
        </Button>
      </div>
    </Modal>
  );
};
