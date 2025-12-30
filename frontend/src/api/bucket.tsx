import api from "./api";
import type { S3Object } from "../Types";

export const fetchBucketObjects = async (): Promise<S3Object[]> => {
  const res = await api.get("/bucket");
  return res.data.documents;
};

export async function uploadFiles(
  files: File[],
  onProgress?: (percent: number) => void,
) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
    formData.append("paths", file.webkitRelativePath || file.name);
  });

  return api.post("/bucket/upload", formData, {
    onUploadProgress: (event) => {
      if (!event.total) return;
      const percent = Math.round((event.loaded * 100) / event.total);
      onProgress?.(percent);
    },
  });
}
