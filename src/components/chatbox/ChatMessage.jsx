import React from "react";
import ReactMarkdown from "react-markdown";

function ChatMessage({ role = "assistant", message, time, isTyping = false }) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={`w-full flex items-start gap-3 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {isAssistant && (
        <div className="w-9 h-9 rounded-full bg-[#1c2534] flex items-center justify-center shrink-0">
          <img src="/icons/icon_robot.png" alt="MW" className="w-6 h-6" />
        </div>
      )}

      <div
        className={`max-w-[70%] flex flex-col gap-1 ${
          isAssistant ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isAssistant
              ? "bg-white border border-gray-200 text-gray-900"
              : "bg-[#1c2534] text-white"
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-ping"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-ping delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-ping delay-300"></span>
            </div>
          ) : (
            <ReactMarkdown>{message}</ReactMarkdown>
          )}
        </div>

        {!isTyping && time && (
          <span className="text-[11px] text-gray-400">{time}</span>
        )}
      </div>

      {!isAssistant && (
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-700 shrink-0">
          You
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
