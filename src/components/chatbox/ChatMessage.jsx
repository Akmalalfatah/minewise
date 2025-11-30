function ChatMessage({
    AIAnswer,
    AITime,
    HumanAnswer,
    HumanTime,
    ai_quick_question1,
    ai_quick_question2,
    ai_quick_question3,
    ai_quick_question4
}) {
    return (
        <div
            data-layer="chat_message_card"
            className="w-[933px] h-[625px] relative bg-white rounded-3xl"
        >
            {/* HEADER */}
            <div
                data-layer="ai_assistant_header"
                className="w-48 h-8 left-[31.80px] top-[14.56px] absolute inline-flex justify-start items-center gap-3"
            >
                <div
                    data-layer="icon_wrapper"
                    className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5"
                >
                    <img
                        data-layer="icon_bot"
                        className="w-4 h-4"
                        src="src/icons/icon_bot.png"
                    />
                </div>
                <div
                    data-layer="ai_assistant_title"
                    className="justify-start text-black text-sm font-semibold font-['Inter']"
                >
                    MineWise AI Assistant
                </div>
            </div>

            <div
                data-layer="divider"
                className="w-[933px] h-0 left-0 top-[66.69px] absolute outline outline-1 outline-offset-[-0.50px] outline-stone-300"
            ></div>

            {/* ASSISTANT BUBBLE */}
            <div
                data-layer="assistant_section"
                className="w-[639px] h-28 left-[29px] top-[129px] absolute"
            >
                <div
                    data-layer="icon_wrapper"
                    className="w-8 h-8 p-1.5 left-0 top-0 absolute bg-gray-800 rounded-2xl inline-flex justify-center items-center gap-2.5"
                >
                    <img
                        data-layer="icon_bot"
                        className="w-4 h-4"
                        src="src/icons/icon_bot.png"
                    />
                </div>
                <div
                    data-layer="assistant_bubble_container"
                    className="w-[595px] left-[44px] top-0 absolute inline-flex flex-col justify-start items-start gap-2.5"
                >
                    <div
                        data-layer="assistant_bubble"
                        className="self-stretch h-24 px-5 py-7 bg-red-400 rounded-[20px] inline-flex justify-center items-center gap-2.5"
                    >
                        <div
                            data-layer="assistant_message"
                            className="w-[559px] justify-start text-white text-base font-normal font-['Inter']"
                        >
                            {AIAnswer}
                        </div>
                    </div>
                    <div
                        data-layer="assistant_time"
                        className="self-stretch justify-start text-black text-xs font-normal font-['Inter']"
                    >
                        {AITime}
                    </div>
                </div>
            </div>

            {/* USER BUBBLE */}
            <div
                data-layer="user_section"
                className="w-[453px] left-[441px] top-[301px] absolute inline-flex justify-end items-start gap-3"
            >
                <div
                    data-layer="user_bubble_container"
                    className="w-96 inline-flex flex-col justify-start items-end gap-2"
                >
                    <div
                        data-layer="user_bubble"
                        className="self-stretch h-14 px-3 py-4 bg-gray-800 rounded-[20px] inline-flex justify-center items-center gap-2.5"
                    >
                        <div
                            data-layer="user_message"
                            className="justify-start text-white text-base font-normal font-['Inter']"
                        >
                            {HumanAnswer}
                        </div>
                    </div>
                    <div
                        data-layer="user_time"
                        className="self-stretch text-right justify-start text-black text-xs font-normal font-['Inter']"
                    >
                        {HumanTime}
                    </div>
                </div>
                <img
                    data-layer="user_avatar"
                    className="w-8 h-8 rounded-full"
                    src="src/icons/icon_user.png"
                />
            </div>

            {/* INPUT AREA */}
            <div
                data-layer="input_section"
                className="w-[933px] h-44 left-0 top-[452px] absolute inline-flex flex-col justify-start items-center gap-4"
            >
                <div
                    data-layer="divider"
                    className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-stone-300"
                ></div>

                <div
                    data-layer="input_container"
                    className="w-[862.45px] flex flex-col justify-start items-start gap-4"
                >
                    <div
                        data-layer="input_row"
                        className="self-stretch inline-flex justify-center items-center gap-2.5"
                    >
                        <div
                            data-layer="input_field"
                            className="w-[810px] h-10 px-4 py-2.5 bg-gray-100 rounded-[10px] flex justify-start items-center gap-2.5"
                        >
                            <div
                                data-layer="input_placeholder"
                                className="justify-start text-stone-500 text-base font-normal font-['Inter']"
                            >
                                Ask about operations, request recommendations...
                            </div>
                        </div>

                        <div
                            data-layer="send_button"
                            className="w-12 h-10 px-2.5 py-2 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5"
                        >
                            <div
                                data-layer="icon_send"
                                className="w-6 h-6 relative overflow-hidden"
                            >
                                <img
                                    className="w-5 h-5 left-[2.37px] top-[2.34px] absolute"
                                    src="src/icons/icon_send.png"
                                />
                            </div>
                        </div>
                    </div>

                    {/* QUICK QUESTIONS */}
                    <div
                        data-layer="quick_questions"
                        className="w-[605px] inline-flex justify-start items-center gap-1.5 flex-wrap content-center"
                    >
                        <div className="w-80 h-9 px-4 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                {ai_quick_question1}
                            </div>
                        </div>

                        <div className="w-72 h-9 px-2 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                {ai_quick_question2}
                            </div>
                        </div>

                        <div className="w-60 h-9 px-3 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                {ai_quick_question3}
                            </div>
                        </div>

                        <div className="w-60 h-9 px-2.5 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                {ai_quick_question4}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;
