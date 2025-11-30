function RecentReportsCard() {
    return (
        <div className="w-96 h-96 p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-2.5">
            <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
                <div className="inline-flex justify-start items-center gap-3">
                    <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
                        <img className="w-4 h-4" src="https://placehold.co/18x18" />
                    </div>
                    <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                        Recent Reports
                    </div>
                </div>
                <div className="self-stretch justify-start text-black/60 text-sm font-normal font-['Inter']">
                    Previously generated reports
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                    <div className="self-stretch h-24 px-2.5 py-2 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-center gap-2.5">
                        <div className="w-96 inline-flex justify-between items-start">
                            <div className="w-40 inline-flex flex-col justify-start items-start gap-3.5">
                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                    <div className="self-stretch justify-start text-black text-sm font-normal font-['Inter']">
                                        Daily Operations Report{" "}
                                    </div>
                                    <div className="self-stretch h-3.5 justify-start text-black/60 text-xs font-normal font-['Inter']">
                                        2025-11-07
                                    </div>
                                </div>
                                <div className="inline-flex justify-start items-center gap-1.5">
                                    <div className="w-10 h-4 px-1.5 py-0.5 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-black/60 text-[10px] font-semibold font-['Inter']">
                                            Daily
                                        </div>
                                    </div>
                                    <div className="w-16 h-4 px-2.5 py-0.5 bg-blue-950 rounded-[5px] flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                            Download
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-20 h-5 px-1.5 py-0.5 bg-green-500 rounded-[5px] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                    Completed
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="self-stretch h-24 px-2.5 py-1.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-center gap-2.5">
                        <div className="inline-flex justify-start items-start gap-24">
                            <div className="w-52 inline-flex flex-col justify-start items-start gap-4">
                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                    <div className="self-stretch justify-start text-black text-sm font-normal font-['Inter']">
                                        Weekly Optimization Summary
                                    </div>
                                    <div className="self-stretch h-3.5 justify-start text-black/60 text-xs font-normal font-['Inter']">
                                        2025-11-07
                                    </div>
                                </div>
                                <div className="inline-flex justify-start items-center gap-1.5">
                                    <div className="w-10 h-4 px-1.5 py-0.5 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-black/60 text-[10px] font-semibold font-['Inter']">
                                            Daily
                                        </div>
                                    </div>
                                    <div className="w-16 h-4 px-2.5 py-0.5 bg-blue-950 rounded-[5px] flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                            Download
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-20 h-5 px-1.5 py-0.5 bg-green-500 rounded-[5px] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                    Completed
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="self-stretch h-24 px-2.5 py-2 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-center gap-2.5">
                        <div className="inline-flex justify-start items-start gap-28">
                            <div className="w-48 inline-flex flex-col justify-start items-start gap-4">
                                <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                                    <div className="self-stretch justify-start text-black text-sm font-normal font-['Inter']">
                                        AI Recommendations Report
                                    </div>
                                    <div className="self-stretch h-3.5 justify-start text-black/60 text-xs font-normal font-['Inter']">
                                        2025-11-07
                                    </div>
                                </div>
                                <div className="inline-flex justify-start items-center gap-1.5">
                                    <div className="w-10 h-4 px-1.5 py-0.5 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-black/60 text-[10px] font-semibold font-['Inter']">
                                            Daily
                                        </div>
                                    </div>
                                    <div className="w-16 h-4 px-2.5 py-0.5 bg-blue-950 rounded-[5px] flex justify-center items-center gap-2.5">
                                        <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                            Download
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-20 h-5 px-1.5 py-0.5 bg-green-500 rounded-[5px] flex justify-center items-center gap-2.5">
                                <div className="justify-start text-white text-[10px] font-semibold font-['Inter']">
                                    Completed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecentReportsCard;
