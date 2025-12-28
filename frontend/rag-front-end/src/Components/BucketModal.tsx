import React, { useState } from "react";
import { useBucketObjects, useUploadFile } from "../hooks/useBucket";
import { toast } from "react-hot-toast";
import type { S3Object } from "../Types";
export const BucketModal: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { data, isPending: isPendingObjects } = useBucketObjects();
  const { mutate, isPending, progress } = useUploadFile();
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
    mutate(file, {
      onSuccess: () => {
        setFile(null);
        toast.onSuccess("Upload Success");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Upload failed");
      },
    });
  };

  return (
    <div className="space-y-4">
      {isPendingObjects && <div className="animate-spin"> </div>}
      {data && (
        <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-64">
          {data.map((obj: S3Object, idx: number) => (
            <div
              key={idx}
              className="rounded-md bg-gray-200 px-2 py-1 text-sm truncate"
            >
              {obj.Key}
            </div>
          ))}
        </div>
      )}
      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 hover:border-purple transition"
      >
        {file ? <p>{file.name}</p> : <p>Drag & drop files here to upload</p>}
      </div>

      {isPending ? (
        <div className="text-sm text-gray-600">Uploading… {progress}%</div>
      ) : (
        <>
          <button
            onClick={uploadFile}
            disabled={isPending}
            className="px-4 py-2 bg-purple text-white rounded hover:bg-purple w-full disabled:opacity-50"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
};
