function MineWiseAssistantCard() {
    return (
        <div className="w-[933px] h-[625px] relative bg-white rounded-3xl">
            <div className="w-48 h-8 left-[31.80px] top-[14.56px] absolute inline-flex justify-start items-center gap-3">
                <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
                    <img className="w-4 h-4" src="https://placehold.co/18x18" />
                </div>
                <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                    MineWise AI Assistant
                </div>
            </div>

            <div className="w-[933px] h-0 left-0 top-[66.69px] absolute outline outline-1 outline-offset-[-0.50px] outline-stone-300"></div>

            <div className="w-[639px] h-28 left-[29px] top-[129px] absolute">
                <div className="w-8 h-8 p-1.5 left-0 top-0 absolute bg-gray-800 rounded-2xl inline-flex justify-center items-center gap-2.5">
                    <img className="w-4 h-4" src="https://placehold.co/18x18" />
                </div>
                <div className="w-[595px] left-[44px] top-0 absolute inline-flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch h-24 px-5 py-7 bg-red-400 rounded-[20px] inline-flex justify-center items-center gap-2.5">
                        <div className="w-[559px] justify-start text-white text-base font-normal font-['Inter']">
                            Hello! I’m your AI Assistant for mining operations. I can help you with real-time operational insights, optimization recommendations, and scenario analysis. What would you like to know?
                        </div>
                    </div>
                    <div className="self-stretch justify-start text-black text-xs font-normal font-['Inter']">
                        10.24 AM
                    </div>
                </div>
            </div>

            <div className="w-[453px] left-[441px] top-[301px] absolute inline-flex justify-end items-start gap-3">
                <div className="w-96 inline-flex flex-col justify-start items-end gap-2">
                    <div className="self-stretch h-14 px-3 py-4 bg-gray-800 rounded-[20px] inline-flex justify-center items-center gap-2.5">
                        <div className="justify-start text-white text-base font-normal font-['Inter']">
                            What’s the current weather impact on operations?
                        </div>
                    </div>
                    <div className="self-stretch text-right justify-start text-black text-xs font-normal font-['Inter']">
                        12.11 AM
                    </div>
                </div>
                <img
                    className="w-8 h-8 rounded-full"
                    src="https://placehold.co/32x32"
                />
            </div>

            <div className="w-[933px] h-44 left-0 top-[452px] absolute inline-flex flex-col justify-start items-center gap-4">
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-stone-300"></div>

                <div className="w-[862.45px] flex flex-col justify-start items-start gap-4">
                    <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                        <div className="w-[810px] h-10 px-4 py-2.5 bg-gray-100 rounded-[10px] flex justify-start items-center gap-2.5">
                            <div className="justify-start text-stone-500 text-base font-bold font-['Inter']">
                                Ask about operations, request recommendations...
                            </div>
                        </div>
                        <div className="w-12 h-10 px-2.5 py-2 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="w-6 h-6 relative overflow-hidden">
                                <div className="w-5 h-5 left-[2.37px] top-[2.34px] absolute bg-white" />
                            </div>
                        </div>
                    </div>

                    <div className="w-[605px] inline-flex justify-start items-center gap-1.5 flex-wrap content-center">
                        <div className="w-80 h-9 px-4 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                What’s the current weather impact on operations?
                            </div>
                        </div>
                        <div className="w-72 h-9 px-2 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                Should we adjust production targets today?
                            </div>
                        </div>
                        <div className="w-60 h-9 px-3 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                What’s the optimal truck allocation?
                            </div>
                        </div>
                        <div className="w-60 h-9 px-2.5 py-2.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-xs font-semibold font-['Inter']">
                                When is the best time to load vessels?
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MineWiseAssistantCard;
