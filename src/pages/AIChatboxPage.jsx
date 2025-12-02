// src/pages/AIChatboxPage.jsx
import React, { useState } from "react";
import ChatMessage from "../components/chatbox/ChatMessage";
import ReasoningChainPanel from "../components/chatbox/ReasoningChainPanel";
import NotificationSection from "../components/layout/NotificationSection";
import ProfileSection from "../components/layout/ProfileSection";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! I’m your AI Assistant for mining operations. I can help you with real-time operational insights, optimization recommendations, and scenario analysis. What would you like to know?",
    time: "10.24 AM"
  },
  {
    id: 2,
    role: "user",
    text: "What’s the current weather impact on operations?",
    time: "12.11 AM"
  }
];

const SUGGESTIONS = [
  "What’s the current weather impact on operations?",
  "Should we adjust production targets today?",
  "What’s the optimal truck allocation?",
  "When is the best time to load vessels?"
];

function AIChatboxPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = (valueFromSuggestion) => {
    const content = (valueFromSuggestion ?? input).trim();
    if (!content) return;

    const newMessage = {
      id: Date.now(),
      role: "user",
      text: content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // sementara: tambahkan placeholder respons AI
    const aiReply = {
      id: Date.now() + 1,
      role: "assistant",
      text:
        "This is a placeholder AI response. Integrasi dengan aiChatService bisa ditambahkan di tahap berikutnya untuk menjawab pertanyaan secara dinamis.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    setMessages((prev) => [...prev, newMessage, aiReply]);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              AI Chatbox
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Berinteraksi dengan AI untuk mendapatkan insight operasional,
              rekomendasi optimasi, dan penjelasan reasoning chain.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationSection />
            <ProfileSection />
          </div>
        </div>

        {/* MAIN LAYOUT: CHAT (LEFT) + REASONING PANEL (RIGHT) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* CHAT AREA */}
          <section className="xl:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-3xl shadow-sm flex flex-col h-[520px] overflow-hidden">
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#1c2534] flex items-center justify-center text-white text-xs">
                  MW
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    MineWise AI Assistant
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Ask about operations, risks, and optimization strategies.
                  </p>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#fafafa]">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    message={msg.text}
                    time={msg.time}
                  />
                ))}
              </div>

              {/* Input area */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-gray-100 px-6 py-4 bg-white flex items-center gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about operations, request recommendations..."
                  className="flex-1 text-sm px-4 py-2 rounded-2xl bg-[#f3f4f6] outline-none border border-transparent focus:border-[#ff7b54] transition-colors"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#1c2534] flex items-center justify-center text-white text-lg hover:bg-black transition-colors"
                  aria-label="Send message"
                >
                  ↑
                </button>
              </form>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-2 rounded-full bg-white text-xs text-gray-800 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* REASONING CHAIN PANEL */}
          <section className="xl:col-span-1">
            <ReasoningChainPanel />
          </section>
        </div>
      </div>
    </div>
  );
}

export default AIChatboxPage;
