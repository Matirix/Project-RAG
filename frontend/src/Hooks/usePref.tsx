import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { getUserPref, updateUserPref } from "../api/userPreferences";

export const useUserPref = () => {
  return useQuery({
    queryKey: ["user_pref"],
    queryFn: getUserPref,
  });
};

export const useUpdateUserPref = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: updateUserPref,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_pref"] });
    },
  });
};
