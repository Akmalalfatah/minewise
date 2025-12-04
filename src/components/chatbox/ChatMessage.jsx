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
        <div data-layer="chat_message_card" className="w-[933px] h-[625px] relative bg-white rounded-3xl">

            <div className="w-48 h-8 left-[31.80px] top-[14.56px] absolute inline-flex justify-start items-center gap-3">
                <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center">
                    <img className="w-4 h-4" src="/icons/icon_bot.png" alt="Bot Icon" />
                </div>
                <div className="text-black text-sm font-semibold">MineWise AI Assistant</div>
            </div>

            <div className="w-[933px] h-0 left-0 top-[66.69px] absolute outline outline-1 outline-stone-300"></div>

            <div className="w-[639px] h-28 left-[29px] top-[129px] absolute">
                <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl absolute flex justify-center items-center">
                    <img className="w-4 h-4" src="/icons/icon_bot.png" alt="Bot Icon" />
                </div>
                <div className="w-[595px] left-[44px] absolute flex flex-col gap-2.5">
                    <div className="h-24 px-5 py-7 bg-red-400 rounded-[20px] flex items-center">
                        <div className="w-[559px] text-white text-base">{data.ai_answer}</div>
                    </div>
                    <div className="text-black text-xs">{data.ai_time}</div>
                </div>
            </div>

            <div className="w-[453px] left-[441px] top-[301px] absolute inline-flex justify-end items-start gap-3">
                <div className="w-96 flex flex-col items-end gap-2">
                    <div className="h-14 px-3 py-4 bg-gray-800 rounded-[20px] flex items-center">
                        <div className="text-white text-base">{data.human_answer}</div>
                    </div>
                    <div className="text-black text-xs text-right">{data.human_time}</div>
                </div>
                <img className="w-8 h-8 rounded-full" src="/icons/icon_user.png" alt="User Icon" />
            </div>

            <div className="w-[933px] h-44 left-0 top-[452px] absolute flex flex-col gap-4">
                <div className="h-0 outline outline-1 outline-stone-300"></div>

                <div className="w-[862.45px] flex flex-col gap-4">
                    <div className="flex items-center gap-2.5">

                        <div className="w-[810px] h-10 px-4 py-2.5 bg-gray-100 rounded-[10px] flex items-center">
                            <input
                                className="w-full bg-transparent outline-none text-base text-black"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                placeholder="Ask about operations, request recommendations..."
                            />
                        </div>

                        <div
                            className="w-12 h-10 px-2.5 py-2 bg-gray-800 rounded-[10px] flex justify-center items-center"
                            onClick={handleSend}
                        >
                            <img className="w-5 h-5" src="/icons/icon_send.png" alt="Send Icon" />
                        </div>
                    </div>

                    <div className="w-[605px] flex gap-1.5 flex-wrap">
                        <div className="w-80 h-9 px-4 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
                            <div className="text-white text-xs font-semibold">{data.quick_questions[0]}</div>
                        </div>

                        <div className="w-72 h-9 px-2 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
                            <div className="text-white text-xs font-semibold">{data.quick_questions[1]}</div>
                        </div>

                        <div className="w-60 h-9 px-3 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
                            <div className="text-white text-xs font-semibold">{data.quick_questions[2]}</div>
                        </div>

                        <div className="w-60 h-9 px-2.5 py-2.5 bg-gray-800 rounded-[10px] flex items-center">
                            <div className="text-white text-xs font-semibold">{data.quick_questions[3]}</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ChatMessage;
