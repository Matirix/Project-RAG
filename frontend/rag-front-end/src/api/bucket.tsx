import api from "./api";
import type { S3Object } from "../Types";
export const fetchBucketObjects = async (): Promise<S3Object>[] => {
  const res = await api.get("/bucket");
  return res.data.documents;
};

export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void,
) {
  const formData = new FormData();
  formData.append("file", file);

  return await api.post("/bucket/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total,
      );
      onProgress?.(percentCompleted);
    },
  });
}
