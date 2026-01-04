import {
  useQuery,
  useMutation,
  type UseMutationResult,
  type UseQueryResult,
  QueryClient,
} from "@tanstack/react-query";
import { getUserPref, updateUserPref } from "../api/userPreferences";

// Hook to use the GET query
export const useUserPref = (): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["user_pref"],
    queryFn: getUserPref,
  });
};

export const useUpdateUserPref = (): UseMutationResult<
  any,
  Error,
  any,
  unknown
> => {
  const queryClient = new QueryClient();
  return useMutation<any, Error, any, unknown>({
    mutationFn: updateUserPref,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_pref"] });
    },
  });
};
