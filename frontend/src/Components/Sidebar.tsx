import React, { useState } from "react";
import { Settings, Database } from "lucide-react";
import { Modal } from "./Modal";
import { BucketModal } from "./BucketModal";

type ModalType = "bucket" | "settings" | null;

export const Sidebar: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const buttons: { icon: React.ReactNode; type: ModalType; label: string }[] = [
    {
      icon: <Database className="w-6 h-6" />,
      type: "bucket",
      label: "S3 Bucket",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      type: "settings",
      label: "Settings",
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-15 left-0 h-full w-16 bg-white flex flex-col items-center py-4 gap-4 shadow-lg z-5">
        {buttons.map((btn) => (
          <button
            key={btn.type!}
            className="text-black hover:text-blue-400"
            onClick={() => setActiveModal(btn.type)}
            aria-label={btn.label}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      <Modal
        open={activeModal === "bucket"}
        onClose={() => setActiveModal(null)}
        title="S3 Bucket"
      >
        <BucketModal />
      </Modal>

      <Modal
        open={activeModal === "settings"}
        onClose={() => setActiveModal(null)}
        title="Settings"
      >
        {/* You can put your settings content here */}
        <div>Settings content goes here</div>
      </Modal>
    </>
  );
};
