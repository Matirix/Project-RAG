import type { Message } from "../Types";
import api from "./api";

export const retrieveAndGenerate = async (body: Message) => {
  const res = await api.post("/retrieve_and_generate", body);
  return res.data;
};
