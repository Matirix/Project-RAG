import { useState } from "react";
import { useRagQuery } from "./useResponse";
import type { Message, RagResponse } from "../Types";

export function useChatController() {
  const [conversation, setConversation] = useState<(Message | RagResponse)[]>(
    [],
  );
  const [input, setInput] = useState("");

  const { mutate, isPending } = useRagQuery();

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: input,
    };

    setConversation((prev) => [...prev, userMessage]);
    setInput("");

    mutate(userMessage, {
      onSuccess: (response) => {
        const assistantMessage: RagResponse = {
          role: "assistant",
          text: response.text,
          citations: response.citations,
          session_id: response.session_id,
        };

        setConversation((prev) => [...prev, assistantMessage]);
      },
      onError: () => {
        setConversation((prev) => [
          ...prev,
          {
            role: "system",
            text: "Error: Unable to get response.",
          },
        ]);
      },
    });
  };

  return {
    conversation,
    input,
    setInput,
    sendMessage,
    isPending,
  };
}
