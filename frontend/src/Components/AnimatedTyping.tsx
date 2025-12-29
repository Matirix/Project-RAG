import type React from "react";
export const TypingDots: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-gray-800 leading-relaxed whitespace-pre-wrap mt-2">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};
