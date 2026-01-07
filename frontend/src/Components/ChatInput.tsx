import React, { useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { Folder, Settings2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onOpenBucket?: () => void;
  onOpenSettings?: () => void;
  isPending?: boolean;
  placeholder?: string;
  maxRows?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onOpenBucket,
  onOpenSettings,
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

  const newLinePrompt = (
    <div className="text-gray-500 text-center mt-3">
      <p>
        Press
        <span className="bg-gray-300 p-1 rounded mx-1">Enter</span>
        to send,
        <span className="bg-gray-300 p-1 rounded mx-1">Shift+ Enter</span>
        for a new line
      </p>
    </div>
  );

  return (
    <div>
      <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl shadow-lg px-4 py-3">
        {/* Text area with send button */}
        <div className="flex items-center gap-3 mb-3">
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
                  : "bg-purple-600 hover:bg-purple-700"
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

        {/* Two buttons underneath */}
        <div className="w-1/4">
          <div className="flex gap-2">
            <button
              onClick={onOpenBucket}
              className="
              flex-1
              flex items-center justify-center gap-2
              px-4 py-2
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              rounded-lg
              text-sm
              font-medium
              transition
            "
            >
              <Folder className="w-4 h-4" />
              Files
            </button>
            <button
              onClick={onOpenSettings}
              className="
              flex-1
              flex items-center justify-center gap-2
              px-4 py-2
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              rounded-lg
              text-sm
              font-medium
              transition
            "
            >
              <Settings2 className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {newLinePrompt}
    </div>
  );
};
