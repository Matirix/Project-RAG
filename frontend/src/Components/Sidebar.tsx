// src/Components/Sidebar.tsx
import React, { useState } from "react";
import { Settings, Database } from "lucide-react";
import { Modal } from "./Modal";
import { BucketModal } from "./BucketModal";
export const Sidebar: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<"bucket" | "settings" | null>("");

  const openModal = (type: "bucket" | "settings") => {
    console.log(type);
    setSelected(type);
    setModalOpen(true);
  };

  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-15 left-0 h-full w-16 bg-white flex flex-col items-center py-4 gap-4 shadow-lg z-5">
        <button
          className="text-black hover:text-blue-400"
          onClick={() => openModal("bucket")}
          aria-label="S3 Bucket"
        >
          <Database className="w-6 h-6" />
        </button>

        <button
          className="text-black hover:text-blue-400"
          onClick={() => openModal("settings")}
          aria-label="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <Modal
        open={selected === "bucket"}
        onClose={() => setSelected(null)}
        title="S3 Bucket"
      >
        <BucketModal />
      </Modal>
    </>
  );
};
