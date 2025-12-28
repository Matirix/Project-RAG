import React from "react";
import type { Message, RagResponse } from "../Types";
import ReactMarkdown from "react-markdown";

interface ChatResponseProps {
  response: Message | RagResponse;
}

export const ChatResponse: React.FC<ChatResponseProps> = ({ response }) => {
  const { text } = response;
  const citations = "citations" in response ? response.citations : undefined;
  const session_id = "session_id" in response ? response.session_id : undefined;

  // console.log(citations, session_id);

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto text-gray-800 leading-relaxed whitespace-pre-wrap">
        <ReactMarkdown children={text} />
      </div>

      {citations && citations.length > 0 && (
        // <div className="relative mt-2 flex justify-start w-1/2 mx-auto pl-5">
        //   <div className="relative inline-flex group">
        <div className="max-w-3xl mx-auto text-gray-800 leading-relaxed whitespace-pre-wrap mt-2">
          <div className="relative inline-flex group">
            <div
              className="bg-gray-100 text-gray-600 px-2 py-2 rounded-md text-xs opacity-70 mx-auto
                                   hover:opacity-100 hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-200"
            >
              {citations.flat().length} citation
              {citations.flat().length > 1 ? "s" : ""}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {citations.map((group, groupIdx) => (
                  <div key={groupIdx} className="mb-2">
                    {group.map((c, idx) => (
                      <div key={idx} className="mb-2 last:mb-0">
                        {/*<p className="text-gray-800 text-sm wrap-break-word">
                          {c.text}
                        </p>*/}
                        <a
                          href={c.location.s3Location.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs hover:underline wrap-break-word"
                        >
                          {c.location.s3Location.uri}
                        </a>
                      </div>
                    ))}
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
