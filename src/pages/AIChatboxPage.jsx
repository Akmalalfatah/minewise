import React, { useState } from "react";
import ChatMessage from "../components/chatbox/ChatMessage";
import ReasoningChainPanel from "../components/chatbox/ReasoningChainPanel";
import { postUserMessage } from "../services/aiChatService";

const DEFAULT_SUGGESTIONS = [
  "What’s the current weather impact on operations?",
  "Should we adjust production targets today?",
  "What’s the optimal truck allocation?",
  "When is the best time to load vessels?"
];

function AIChatboxPage() {
  const [messages, setMessages] = useState([
    {
      id: "ai-initial",
      role: "assistant",
      message:
        "Hello, I am MineWise AI Assistant. Ask me about production, road risk, weather impact, or vessel loading schedules.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }
  ]);

  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCore = async (content) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const userMessage = {
      id: Date.now(),
      role: "user",
      message: trimmed,
      time: userTime
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await postUserMessage(trimmed);

      if (result && result.ai_answer) {
        const aiTime =
          result.ai_time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          });

        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          message: result.ai_answer,
          time: aiTime
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (
          Array.isArray(result.quick_questions) &&
          result.quick_questions.length
        ) {
          setSuggestions(result.quick_questions);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            message:
              "I could not reach the AI engine right now. Please try again.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendCore(input);
  };

  const handleSuggestionClick = (text) => {
    handleSendCore(text);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-8 py-8">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 flex flex-col">
            <div className="bg-white rounded-t-3xl flex flex-col h-[520px] overflow-hidden">
              <header className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1c2534] flex items-center justify-center shrink-0">
                  <img
                    src="/icons/icon_chatbox.png"
                    alt="AI Icon"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  MineWise AI Assistant
                </h2>
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#efefef] space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    message={msg.message}
                    time={msg.time}
                  />
                ))}
                {isLoading && <ChatMessage role="assistant" isTyping />}
              </div>

              <form
                onSubmit={handleSubmit}
                className="border-t border-gray-100 px-6 py-4 bg-white flex items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about operations..."
                  className="flex-1 text-sm px-4 py-2 rounded-[10px] bg-[#efefef] outline-none focus:border-[#ff7b54]"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-10 h-10 rounded-[10px] bg-[#1c2534] text-white hover:bg-black disabled:opacity-60"
                >
                  ↑
                </button>
              </form>
            </div>

            <div className="bg-white rounded-b-3xl px-6 py-4 -mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Suggested Prompts
              </p>
              <div className="flex flex-wrap gap-3">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 rounded-[10px] bg-[#1c2534] text-xs text-white hover:bg-[#344054]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="xl:col-span-1">
            <ReasoningChainPanel />
          </section>
        </div>
      </div>
    </main>
  );
}

export default AIChatboxPage;
