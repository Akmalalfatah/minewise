function AiReasoningChainCard() {
    return (
        <div className="w-96 h-[625px] px-6 py-8 bg-white rounded-3xl inline-flex justify-center items-center gap-2.5">
            <div className="w-96 h-[563px] inline-flex flex-col justify-center items-start gap-10">
                
                {/* Header + Steps */}
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="inline-flex justify-start items-center gap-[3px]">
                            <div className="w-8 h-8 relative overflow-hidden">
                                <div className="w-4 h-4 left-[9.63px] top-0 absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-black" />
                                <div className="w-2 h-3.5 left-[5px] top-[6.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-black" />
                                <div className="w-4 h-2.5 left-[10.33px] top-[17.33px] absolute outline outline-1 outline-offset-[-0.50px] outline-black" />
                            </div>
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                AI Reasoning Chain
                            </div>
                        </div>
                        <div className="self-stretch justify-start text-stone-500 text-sm font-normal font-['Inter']">
                            Understanding how the AI makes decisions
                        </div>
                    </div>

                    <div className="self-stretch flex flex-col justify-start items-start gap-7">
                        <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div className="w-8 h-8 px-3 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
                                <div className="justify-start text-white text-sm font-normal font-['Inter']">1</div>
                            </div>
                            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
                                Analyzed 24-hour weather forecast showing 8mm rainfall
                            </div>
                        </div>

                        <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div className="w-8 h-8 px-2.5 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
                                <div className="justify-start text-white text-sm font-normal font-['Inter']">2</div>
                            </div>
                            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
                                Assessed road condition data: Road B at 62%, Road C at 35%
                            </div>
                        </div>

                        <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div className="w-8 h-8 px-2.5 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
                                <div className="justify-start text-white text-sm font-normal font-['Inter']">3</div>
                            </div>
                            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
                                Calculated optimal speed reduction based on historical safety data
                            </div>
                        </div>

                        <div className="self-stretch inline-flex justify-start items-start gap-2">
                            <div className="w-8 h-8 px-2.5 py-1.5 bg-gray-800 rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
                                <div className="justify-start text-white text-sm font-normal font-['Inter']">4</div>
                            </div>
                            <div className="w-72 justify-start text-black text-sm font-normal font-['Inter']">
                                Factored in equipment performance in wet conditions
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Sources */}
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch justify-start text-black/60 text-sm font-normal font-['Inter']">
                        Data Sources
                    </div>

                    <div className="self-stretch flex flex-col justify-center items-start gap-3">
                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                Weather API
                            </div>
                            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
                                <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                                    Connected
                                </div>
                            </div>
                        </div>

                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                Equipment Sensors
                            </div>
                            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
                                <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                                    Connected
                                </div>
                            </div>
                        </div>

                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                Road Monitoring
                            </div>
                            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
                                <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                                    Connected
                                </div>
                            </div>
                        </div>

                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                Vessel Tracking
                            </div>
                            <div className="w-24 h-6 px-[5px] py-1.5 bg-green-500 rounded-md flex justify-center items-center gap-2.5">
                                <div className="text-right justify-start text-white text-xs font-semibold font-['Inter']">
                                    Connected
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AiReasoningChainCard;
