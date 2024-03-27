"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ClockLoader } from "../../icons/clock-loader";

interface UploadTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const UploadTransactionsModal: React.FC<
  UploadTransactionsModalProps
> = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Do you want to upload the transactions?"
      description="Make sure you updated the categories in your transactions before upload them."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex items-center justify-end w-full pt-6 space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="default" onClick={onConfirm}>
          {loading && <ClockLoader className="mr-2" />}Upload
        </Button>
      </div>
    </Modal>
  );
};
