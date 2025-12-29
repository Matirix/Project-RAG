import { Dialog } from "@headlessui/react";
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Centered panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 relative w-[32rem] max-h-[80vh] overflow-y-auto">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>

          <Dialog.Title className="text-lg font-semibold mb-4">
            {title}
          </Dialog.Title>

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
