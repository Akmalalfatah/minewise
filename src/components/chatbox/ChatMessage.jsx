import React, { useEffect, useState } from "react";
import { getChatMessage, postUserMessage } from "../../services/aiChatService";

function ChatMessage() {
  const [data, setData] = useState(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    async function load() {
      const result = await getChatMessage();
      setData(result);
    }
    load();
  }, []);

  async function handleSend() {
    if (!inputText.trim()) return;

    const result = await postUserMessage(inputText);

    if (result) {
      setData(result);
      setInputText("");
    }
  }

  if (!data) return null;

  return (
    <section
      data-layer="chat_message_card"
      aria-label="MineWise AI chat conversation"
      className="w-[933px] h-[625px] relative bg-white rounded-3xl"
    >
      {/* Header: bot identity */}
      <header className="w-48 h-8 left-[31.80px] top-[14.56px] absolute inline-flex justify-start items-center gap-3">
        <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center">
          <img className="w-4 h-4" src="/icons/icon_bot.png" alt="Bot Icon" />
        </div>
        <h2 className="text-black text-sm font-semibold">
          MineWise AI Assistant
        </h2>
      </header>

      {/* Divider */}
      <div className="w-[933px] h-0 left-0 top-[66.69px] absolute outline outline-1 outline-stone-300" />

      {/* AI message */}
      <section
        aria-label="AI reply"
        className="w-[639px] h-28 left-[29px] top-[129px] absolute"
      >
        <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl absolute flex justify-center items-center">
          <img className="w-4 h-4" src="/icons/icon_bot.png" alt="Bot Icon" />
        </div>
        <div className="w-[595px] left-[44px] absolute flex flex-col gap-2.5">
          <article className="h-24 px-5 py-7 bg-red-400 rounded-[20px] flex items-center">
            <p className="w-[559px] text-white text-base">{data.ai_answer}</p>
          </article>
          <time className="text-black text-xs">{data.ai_time}</time>
        </div>
      </section>

      {/* Human message */}
      <section
        aria-label="User message"
        className="w-[453px] left-[441px] top-[301px] absolute inline-flex justify-end items-start gap-3"
      >
        <article className="w-96 flex flex-col items-end gap-2">
          <div className="h-14 px-3 py-4 bg-gray-800 rounded-[20px] flex items-center">
            <p className="text-white text-base">{data.human_answer}</p>
          </div>
          <time className="text-black text-xs text-right">
            {data.human_time}
          </time>
        </article>
        <img
          className="w-8 h-8 rounded-full"
          src="/icons/icon_user.png"
          alt="User Icon"
        />
      </section>

      {/* Input & quick questions */}
      <footer className="w-[933px] h-44 left-0 top-[452px] absolute flex flex-col gap-4">
        <div className="h-0 outline outline-1 outline-stone-300" />

        <div className="w-[862.45px] flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-[810px] h-10 px-4 py-2.5 bg-gray-100 rounded-[10px] flex items-center">
              <label className="sr-only" htmlFor="chat-input">
                Ask MineWise AI
              </label>
              <input
                id="chat-input"
                className="w-full bg-transparent outline-none text-base text-black"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about operations, request recommendations..."
              />
            </div>

            <button
              type="button"
              aria-label="Send message"
              className="w-12 h-10 px-2.5 py-2 bg-gray-800 rounded-[10px] flex justify-center items-center"
              onClick={handleSend}
            >
              <img
                className="w-5 h-5"
                src="/icons/icon_send.png"
                alt="Send Icon"
              />
            </button>
          </div>

          <section
            aria-label="Quick questions"
            className="w-[605px] flex gap-1.5 flex-wrap"
          >
            <div className="w-80 h-9 px-4 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
              <p className="text-white text-xs font-semibold">
                {data.quick_questions[0]}
              </p>
            </div>

            <div className="w-72 h-9 px-2 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
              <p className="text-white text-xs font-semibold">
                {data.quick_questions[1]}
              </p>
            </div>

            <div className="w-60 h-9 px-3 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
              <p className="text-white text-xs font-semibold">
                {data.quick_questions[2]}
              </p>
            </div>

            <div className="w-60 h-9 px-2.5 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
              <p className="text-white text-xs font-semibold">
                {data.quick_questions[3]}
              </p>
            </div>
          </section>
        </div>
      </footer>
    </section>
  );
}

export default ChatMessage;
