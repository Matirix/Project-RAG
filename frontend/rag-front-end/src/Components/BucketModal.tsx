import React, { useState } from "react";

export const BucketModal: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFile(droppedFiles[0]); // just take the first for now
      console.log(droppedFiles);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert("No file selected");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    alert("Upload successful!");
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 hover:border-blue-400 transition"
      >
        {file ? <p>{file.name}</p> : <p>Drag & drop files here to upload</p>}
      </div>

      <button
        onClick={uploadFile}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        SEND
      </button>
    </div>
  );
};
