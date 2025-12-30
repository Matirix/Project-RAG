import React, { useState } from "react";
import { useBucketObjects, useUploadFiles } from "../Hooks/useBucket";
import { toast } from "react-hot-toast";
import type { S3Object } from "../Types";
const getAllFilesFromDataTransfer = async (items: DataTransferItemList) => {
  const allFiles: File[] = [];

  const traverseEntry = async (entry: any, path = "") => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) =>
        entry.file((f: File) =>
          resolve(new File([f], path + f.name, { type: f.type })),
        ),
      );
      allFiles.push(file);
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const entries = await new Promise<any[]>((resolve) =>
        reader.readEntries(resolve),
      );
      for (const e of entries) {
        await traverseEntry(e, path + entry.name + "/");
      }
    }
  };

  const promises = Array.from(items).map((item) =>
    traverseEntry(item.webkitGetAsEntry()),
  );
  await Promise.all(promises);

  return allFiles;
};

export const BucketModal: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const { data, isPending: isPendingObjects } = useBucketObjects();
  const { mutate, isPending, progress } = useUploadFiles();

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = await getAllFilesFromDataTransfer(e.dataTransfer.items);
    setFiles(files);
    console.log(files);
  };

  // Upload all selected files
  const uploadFiles = () => {
    if (!files.length) {
      toast.error("No files selected");
      return;
    }

    mutate(files, {
      onSuccess: () => {
        toast.success("Upload complete");
        setFiles([]);
      },
      onError: () => toast.error("Upload failed"),
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
        {files.length > 0 ? (
          <div>
            {files.map((f) => (
              <p key={f.name}>{f.name}</p>
            ))}
          </div>
        ) : (
          <p>Drag & drop files or folders here to upload</p>
        )}
      </div>

      {isPending ? (
        <div className="text-sm text-gray-600">Uploading… {progress}%</div>
      ) : (
        <>
          <button
            onClick={uploadFiles}
            disabled={isPending || files.length === 0}
            className="px-4 py-2 bg-purple text-white rounded hover:bg-purple w-full disabled:opacity-50"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
};
