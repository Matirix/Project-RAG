import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserPref, updateUserPref } from "../api/userPreferences";

export const useUserPref = () => {
  return useQuery({
    queryKey: ["user_pref"],
    queryFn: getUserPref,
    refetchOnMount: "always",
  });
};

export const useUpdateUserPref = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserPref,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_pref"] });
    },
    onError: (error) => {
      console.log("❌ Mutation failed:", error);
    },
  });
};
