import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBucketObjects, uploadFiles } from "../api/bucket";
import { useState } from "react";

export const useBucketObjects = () => {
  return useQuery({
    queryKey: ["bucketObjects"],
    queryFn: fetchBucketObjects,
  });
};

export const useUploadFiles = () => {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  return {
    ...useMutation({
      mutationFn: (files: File[]) => uploadFiles(files, setProgress),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bucketObjects"] });
      },
    }),
    progress,
  };
};
