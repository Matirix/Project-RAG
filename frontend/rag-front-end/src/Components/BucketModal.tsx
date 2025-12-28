import React, { useCallback } from "react";

export const BucketModal: React.FC<BucketModalProps> = () => {
  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    console.log(files);
  };

  return (
    <div className="space-y-4">
      {/* File list */}
      <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
        {/*{objects.length === 0 ? (
          <p className="text-gray-400 text-sm">Bucket is empty</p>
        ) : (
          <ul className="text-sm space-y-1">
            {objects.map((obj) => (
              <li key={obj} className="truncate">
                📄 {obj}
              </li>
            ))}
          </ul>
        )}*/}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 hover:border-blue-400 transition"
      >
        Drag & drop files here to upload
      </div>
    </div>
  );
};
