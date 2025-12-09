import React from "react";
import ReactMarkdown from "react-markdown";
import { userStore } from "../../store/userStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ChatMessage({ role = "assistant", message, time, isTyping = false }) {
  const { user } = userStore();
  const isAssistant = role === "assistant";

  const userAvatar = user?.avatar_url
    ? `${API_BASE_URL}${user.avatar_url}`
    : "/icons/icon_default_profile.png";

  return (
    <div
      className={`w-full flex items-start gap-3 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >

      {isAssistant && (
        <div className="w-10 h-10 rounded-full bg-[#1c2534] flex items-center justify-center shrink-0">
          <div className="text-lg">🤖</div>
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
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
          <img
            src={userAvatar}
            alt="User avatar"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
