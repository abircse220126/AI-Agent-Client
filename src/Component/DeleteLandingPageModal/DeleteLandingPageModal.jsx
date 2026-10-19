import React from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";

const DeleteLandingPageModal = ({
  page,
  onClose,
  onConfirm,
  deleting = false,
}) => {
  if (!page) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={deleting ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111116] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle size={22} />
            </div>

            <h3
              id="delete-modal-title"
              className="text-lg font-semibold text-white"
            >
              Delete Landing Page
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm leading-6 text-gray-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-white">
            {page.name || "Untitled Landing Page"}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLandingPageModal;
