import type { UserPreferences } from "../Types";
import api from "./api";

export const getUserPref = async () => {
  const res = await api.get("/user_pref");
  console.log(res);
  return res.data;
};
export const updateUserPref = async (body: UserPreferences) => {
  const res = await api.put("/user_pref", body);
  return res.data;
};
