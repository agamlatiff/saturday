import React from "react";
import { Trash2 } from "lucide-react";

interface PopupDeleteAccountProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  warningTitle?: string;
  warningMessage?: string;
  description?: string;
  items?: string[];
  confirmButtonText?: string;
}

const PopupDeleteAccount: React.FC<PopupDeleteAccountProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Delete Account",
  warningTitle = "Warning: This action cannot be undone",
  warningMessage = "All your data will be permanently deleted",
  description = "Are you absolutely sure you want to delete this? This will:",
  items = [
    "Permanently delete your profile and all associated data",
    "Remove all your transactions and history",
    "This action cannot be reversed",
  ],
  confirmButtonText = "Yes, Delete",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full z-50">
      <div
        onClick={onClose}
        className="absolute w-full h-full bg-[#292D32B2] cursor-pointer"
      />
      <div className="relative flex flex-col w-full max-w-[500px] shrink-0 rounded-3xl p-[18px] gap-5 bg-white mx-4">
        <div className="modal-header flex items-center justify-between">
          <p className="font-semibold text-xl text-red-600">{title}</p>
          <button
            onClick={onClose}
            className="flex size-14 rounded-full items-center justify-center bg-monday-gray-background hover:bg-monday-border transition-300"
            disabled={isDeleting}
          >
            <img
              src="/assets/images/icons/close-circle-black.svg"
              className="size-6"
              alt="close"
            />
          </button>
        </div>
        <div className="modal-content flex flex-col gap-5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 border border-red-200">
            <div className="flex size-12 rounded-full items-center justify-center bg-red-100">
              <Trash2 className="size-6 text-red-600" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg text-red-900">
                {warningTitle}
              </p>
              <p className="font-medium text-sm text-red-700">
                {warningMessage}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-medium text-base text-monday-gray">
              {description}
            </p>
            <ul className="flex flex-col gap-2 ml-4">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="font-medium text-sm text-monday-gray">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              onClick={onClose}
              className="btn btn-black font-semibold px-6"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 btn font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 rounded-md"
            >
              {isDeleting ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-5" />
                  {confirmButtonText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupDeleteAccount;
