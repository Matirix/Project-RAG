import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type { Message, RagResponse } from "../Types";

export const useRagQuery = (): UseMutationResult<
  RagResponse,
  Error,
  Message,
  unknown
> => {
  return useMutation<RagResponse, Error, Message, boolean>({
    mutationFn: (vars) => {
      const response = fetch(`http://localhost:8000/retrieve_and_generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vars),
      }).then((res) => res.json());
      console.log(response);
      return response;
    },
  });
};
