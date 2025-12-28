import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { Message, RagResponse } from "../Types";
import { retrieveAndGenerate } from "../api/rag";

export const useRagQuery = (): UseMutationResult<
  RagResponse,
  Error,
  Message,
  unknown
> => {
  return useMutation<RagResponse, Error, Message, boolean>({
    mutationFn: retrieveAndGenerate,
  });
};
