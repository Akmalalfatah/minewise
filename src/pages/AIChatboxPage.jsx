import React, { useEffect, useState } from "react";
import ChatMessage from "../components/chatbox/ChatMessage";
import ReasoningChainPanel from "../components/chatbox/ReasoningChainPanel";
import { getChatMessage, postUserMessage } from "../services/aiChatService";

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

  useEffect(() => {
    async function loadInitial() {
      const data = await getChatMessage();
      if (!data) return;

      const time =
        data.ai_time &&
        new Date(data.ai_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });

      const firstMessage = {
        id: "ai-initial-from-api",
        role: "assistant",
        message:
          data.ai_answer ||
          "Hello, I am MineWise AI Assistant. Ask me about production, road risk, weather impact, or vessel loading schedules.",
        time: time || messages[0].time
      };

      setMessages([firstMessage]);
      if (Array.isArray(data.quick_questions) && data.quick_questions.length) {
        setSuggestions(data.quick_questions);
      }
    }

    loadInitial();
  }, []);

  const handleSendCore = async (content) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const now = new Date();
    const userTime = now.toLocaleTimeString([], {
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
          result.ai_time &&
          new Date(result.ai_time).toLocaleTimeString([], {
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
        const fallbackMessage = {
          id: Date.now() + 1,
          role: "assistant",
          message:
            "I could not reach the AI engine right now, but generally rain can reduce hauling efficiency, increase road slipperiness, and delay production.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        };

        setMessages((prev) => [...prev, fallbackMessage]);
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
          <section
            aria-label="Chat area"
            className="xl:col-span-2 flex flex-col"
          >
            <div className="bg-white rounded-t-3xl flex flex-col h-[520px] overflow-hidden">
              <header className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1c2534] flex items-center justify-center text-white text-lg">
                    🤖
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      MineWise AI Assistant
                    </h2>
                  </div>
                </div>
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

                {isLoading && (
                  <ChatMessage role="assistant" isTyping={true} />
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="border-t border-gray-100 px-6 py-4 bg-white flex items-center gap-3"
                aria-label="Chat input"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about operations, request recommendations..."
                  className="flex-1 text-sm px-4 py-2 rounded-[10px] bg-[#efefef] outline-none border border-transparent focus:border-[#ff7b54] transition-colors"
                  aria-label="Message input"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-10 h-10 rounded-[10px] bg-[#1c2534] flex items-center justify-center text-white text-lg hover:bg-black transition-colors disabled:opacity-60"
                  aria-label="Send message"
                >
                  ↑
                </button>
              </form>
            </div>

            <div className="bg-white rounded-b-3xl px-6 py-4 -mt-2">
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Suggested Prompts
              </p>

              <nav aria-label="Suggested prompts">
                <div className="flex flex-wrap gap-3">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSuggestionClick(s)}
                      className="px-4 py-2 rounded-[10px] bg-[#1C2534] text-xs text-white hover:bg-gray-50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          </section>

          <section aria-label="Reasoning chain panel" className="xl:col-span-1">
            <ReasoningChainPanel />
          </section>
        </div>
      </div>
    </main>
  );
}

export default AIChatboxPage;
