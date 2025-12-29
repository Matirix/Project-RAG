import { useRef, useEffect } from "react";
import { ChatInput } from "./Components/ChatInput";
import { ChatResponse } from "./Components/ChatResponse";
import { UserInput } from "./Components/UserMessage";
import { TypingDots } from "./Components/AnimatedTyping";
import { Sidebar } from "./Components/Sidebar";
import { useChatController } from "./Hooks/useChatController";

export default function App() {
  const { conversation, input, setInput, sendMessage, isPending } =
    useChatController();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full font-sans">
      <Sidebar />

      <header className="bg-white py-4 px-6 text-xl font-bold z-10">
        RAG-GPT
      </header>

      {conversation.length === 0 && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-10">
          <p className="font-bold text-3xl mb-5">
            What can I help you with today?
          </p>

          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            isPending={isPending}
          />
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 py-4 pb-30">
        {conversation.map((msg, idx) =>
          msg.role === "user" ? (
            <UserInput key={idx} message={msg} />
          ) : (
            <ChatResponse key={idx} response={msg} />
          ),
        )}

        {isPending && <TypingDots />}
        <div ref={messagesEndRef} />
        <div className=" absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </main>

      {conversation.length > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            isPending={isPending}
          />
        </div>
      )}
    </div>
  );
}
