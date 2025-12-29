import React, { useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isPending?: boolean;
  placeholder?: string;
  maxRows?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isPending = false,
  placeholder = "Press [Tab] to begin your prompt!",
  maxRows = 6,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isDisabled = !value.trim() || isPending;

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * maxRows;

    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [value, maxRows]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled) {
        onSend();
      }
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="
            flex-1
            resize-none
            bg-transparent
            outline-none
            text-base
            placeholder-gray-400
            max-h-40
            overflow-y-auto
          "
      />

      <button
        onClick={onSend}
        disabled={isDisabled}
        aria-label="Send message"
        className={`
            flex items-center justify-center
            w-10 h-10 rounded-full
            transition
            ${
              isDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple hover:bg-purple-900"
            }
          `}
      >
        {/* Up arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};
