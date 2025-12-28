import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchBucketObjects, uploadFile } from "../api/bucket";
import { useState } from "react";

export const useBucketObjects = () => {
  return useQuery({
    queryKey: ["bucketObjects"],
    queryFn: fetchBucketObjects,
  });
};

export const useUploadFile = (): UseMutationResult<Error, Message, unknown> => {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (file: File) => uploadFile(file, setProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bucketObjects"],
      });
    },
  });
  return { ...mutation, progress };
};
