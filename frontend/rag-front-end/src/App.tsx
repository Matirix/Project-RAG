// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import { useRagQuery } from "./Hooks/useResponse";
import type { Message, RagResponse } from "./Types";
import { ChatInput } from "./Components/ChatInput";
import { ChatResponse } from "./Components/ChatResponse";
import { UserInput } from "./Components/UserMessage";
import { TypingDots } from "./Components/AnimatedTyping";
import { Sidebar } from "./Components/Sidebar";
export default function App() {
  const [conversation, setConversation] = useState<(Message | RagResponse)[]>(
    [],
  );
  const [input, setInput] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [conversation]);

  const { mutate, isPending } = useRagQuery();

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", text: input };
    setConversation((prev) => [...prev, userMessage]);
    setInput("");
    mutate(userMessage, {
      onSuccess: (response: RagResponse) => {
        console.log(response);
        const assistantMessage: RagResponse = {
          role: "assistant",
          text: response.text,
          citations: response.citations,
          session_id: response.session_id,
        };
        console.log(assistantMessage);
        setConversation((prev) => [...prev, assistantMessage]);
      },
      onError: (err: Error) => {
        console.error(err);
        setConversation((prev) => [
          ...prev,
          { role: "system", text: "Error: Unable to get response." },
        ]);
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full font-sans">
      <Sidebar />
      <header className="bg-white py-4 px-6 text-xl font-bold font-sans z-10">
        RAG-GPT
      </header>
      {conversation.length == 0 && (
        <div className="fixed top-1/3 bottom-1/2 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-10">
          <p className="font-bold flex justify-self-center text-3xl mb-5">
            What can I help you with today?
          </p>
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isPending={isPending}
          />
        </div>
      )}

      <div className="relative flex-1 overflow-hidden mb-20">
        <main className="h-full overflow-y-auto px-6 py-4 pb-24">
          {conversation.map((msg, idx) => {
            const isUser = msg.role === "user";

            return (
              <div key={idx} className="mb-6">
                {isUser ? (
                  <UserInput key={idx} message={msg} />
                ) : (
                  <ChatResponse key={idx} response={msg} />
                )}
              </div>
            );
          })}

          {isPending && <TypingDots />}

          <div ref={messagesEndRef} />
        </main>

        {/* Bottom fade overlay */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-gray-50 to-transparent" />
      </div>
      {conversation.length > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
          <ChatInput
            value={input}
            onSend={handleSend}
            onChange={setInput}
            isPending={isPending}
          />
        </div>
      )}
    </div>
  );
}
