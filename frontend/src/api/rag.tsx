import api from "./api";

export const retrieveAndGenerate = async (body) => {
  const res = await api.post("/retrieve_and_generate", body);
  return res.data;
};
