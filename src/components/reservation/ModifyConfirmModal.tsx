"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

type ModifyConfirmModalProps = {
  open: boolean;
  oldSummary: string;
  newSummary: string;
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ModifyConfirmModal({
  open,
  oldSummary,
  newSummary,
  submitting,
  onConfirm,
  onCancel,
}: ModifyConfirmModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="fixed inset-0 z-50 m-auto w-[min(100%-2rem,28rem)] max-h-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-calmo-burnt-brown/10 bg-calmo-beige p-0 text-calmo-burnt-brown shadow-xl backdrop:bg-calmo-burnt-brown/40"
    >
      <div className="p-8">
        <h2 className="font-title text-xl font-bold text-calmo-burnt-brown">
          Submit your updated request?
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-calmo-burnt-brown/75">
          We&apos;ll cancel your booking for{" "}
          <strong className="font-medium text-calmo-burnt-brown">{oldSummary}</strong> and submit a
          new request for{" "}
          <strong className="font-medium text-calmo-burnt-brown">{newSummary}</strong>. Staff will
          confirm by email.
        </p>
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Go back
          </Button>
          <Button type="button" variant="dark" onClick={onConfirm} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit new request"}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
