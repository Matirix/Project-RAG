import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { Message, RagResponse } from "../Types";

interface ChatResponseProps {
  response: Message | RagResponse;
}

export const ChatResponse: React.FC<ChatResponseProps> = ({ response }) => {
  const { text } = response;
  const citations = "citations" in response ? response.citations : undefined;

  const filteredCitations = useMemo(() => {
    if (!citations) return [];
    return Array.from(
      new Map(
        citations.flat().map((c) => [c.location?.s3Location?.uri, c]),
      ).values(),
    );
  }, [citations]);

  const getFileName = (uri: string) => {
    const parts = uri.split("/");
    return decodeURIComponent(parts[parts.length - 1] || uri);
  };

  const preprocessMath = (text: string) => {
    return text
      .replace(/\\\((.*?)\\\)/g, (_, p1) => `$${p1}$`)
      .replace(/\\\[(.*?)\\\]/g, (_, p1) => `$$${p1}$$`)
      .replace(/\\text\{(.*?)\}/g, "$1");
  };

  return (
    <div className="w-full">
      {/* Main response content */}
      <div className="max-w-3xl mt-10 mx-auto">
        <div className="prose prose-lg max-w-none text-gray-800 leading-loose space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => <p className="mb-4">{children}</p>,
              h1: ({ children }) => <h1 className="mb-4 mt-6">{children}</h1>,
              h2: ({ children }) => <h2 className="mb-3 mt-5">{children}</h2>,
              h3: ({ children }) => <h3 className="mb-3 mt-4">{children}</h3>,
              ul: ({ children }) => (
                <ul className="mb-4 space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 space-y-2">{children}</ol>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
            }}
          >
            {preprocessMath(text)}
          </ReactMarkdown>
        </div>
      </div>

      {/* Citations section */}
      {citations && citations.length > 0 && (
        <div className="max-w-3xl mx-auto mt-4">
          <div className="relative inline-flex group">
            <button
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium
                         opacity-70 hover:opacity-100 hover:shadow-md hover:-translate-y-0.5
                         cursor-pointer transition-all duration-200"
            >
              📚 {filteredCitations.length} source
              {filteredCitations.length > 1 ? "s" : ""}
            </button>

            {/* Hover tooltip with citations */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-96
                         bg-white border border-gray-200 rounded-lg shadow-xl p-4
                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                         transition-all duration-200 z-50"
            >
              <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
                Sources
              </h4>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {filteredCitations.map((c, idx) => (
                  <div
                    key={idx}
                    className="pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <a
                          href={c.location.s3Location.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-xs hover:text-blue-800 hover:underline font-medium break-all block"
                        >
                          {getFileName(c.location.s3Location.uri)}
                        </a>
                        {c.text && (
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                            {c.text.substring(0, 120)}
                            {c.text.length > 120 ? "..." : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
