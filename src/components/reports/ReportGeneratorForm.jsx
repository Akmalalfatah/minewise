function GenerateCustomReportCard() {
    return (
        <div className="w-[876px] h-[1215px] p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div className="inline-flex justify-start items-center gap-3">
                    <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
                        <img className="w-5 h-5" src="https://placehold.co/22x22" />
                    </div>
                    <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                        Generate Custom Report
                    </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-8">
                    <div className="self-stretch justify-start text-black/60 text-sm font-normal font-['Inter']">
                        Select sections and configure your report
                    </div>
                    <div className="self-stretch inline-flex justify-center items-center gap-20 flex-wrap content-center">
                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                Report Type
                            </div>
                            <div className="self-stretch h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-end items-center gap-2.5">
                                <div className="w-6 h-6 relative origin-top-left rotate-180">
                                    <div className="w-1.5 h-3 left-[18px] top-[9px] absolute origin-top-left rotate-90 border-2 border-stone-500/80" />
                                </div>
                            </div>
                        </div>
                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                Time Period
                            </div>
                            <div className="self-stretch h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-end items-center gap-2.5">
                                <div className="w-6 h-6 relative origin-top-left rotate-180">
                                    <div className="w-1.5 h-3 left-[18px] top-[9px] absolute origin-top-left rotate-90 border-2 border-stone-500/80" />
                                </div>
                            </div>
                        </div>
                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                Format
                            </div>
                            <div className="self-stretch h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-end items-center gap-2.5">
                                <div className="w-6 h-6 relative origin-top-left rotate-180">
                                    <div className="w-1.5 h-3 left-[18px] top-[9px] absolute origin-top-left rotate-90 border-2 border-stone-500/80" />
                                </div>
                            </div>
                        </div>
                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                Detail Level
                            </div>
                            <div className="self-stretch h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-end items-center gap-2.5">
                                <div className="w-6 h-6 relative origin-top-left rotate-180">
                                    <div className="w-1.5 h-3 left-[18px] top-[9px] absolute origin-top-left rotate-90 border-2 border-stone-500/80" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                Report Section
                            </div>
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
                                Select All
                            </div>
                        </div>
                        <div className="self-stretch flex flex-col justify-start items-start gap-6">
                            <div className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-52 inline-flex flex-col justify-start items-start gap-px">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Executive Summary
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            High-level overview and key insights
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-44 inline-flex flex-col justify-start items-start gap-0.5">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Operational Overview
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Current status of all operations
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-48 inline-flex flex-col justify-start items-start gap-0.5">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Weather Analysis
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Forecast and impact assessment
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-48 inline-flex flex-col justify-start items-start gap-0.5">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Equipment Status
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Forecast and impact assessment
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-48 inline-flex flex-col justify-start items-start gap-0.5">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Road Conditions
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Fleet availability and maintenance
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-56 inline-flex flex-col justify-start items-start gap-px">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            AI Recommendations
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Haul road status and recommendations
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-52 inline-flex flex-col justify-start items-start gap-0.5">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Scenario Analysis
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Simulation results and comparisons
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-40 inline-flex flex-col justify-start items-start gap-0.5">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Cost Analysis
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Financial impact and savings
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                <div className="inline-flex justify-start items-center gap-3">
                                    <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                    <div className="w-52 inline-flex flex-col justify-start items-start gap-px">
                                        <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                                            Risk Assessment
                                        </div>
                                        <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                                            Risk factors and mitigation strategies
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex justify-start items-center gap-3">
                        <div className="w-40 h-14 px-4 py-3.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-sm font-semibold font-['Inter']">
                                Generate Report
                            </div>
                        </div>
                        <div className="w-40 h-14 px-3 py-4 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex flex-col justify-start items-start gap-2.5">
                            <div className="inline-flex justify-start items-start gap-2">
                                <div className="justify-start text-gray-800 text-base font-normal font-['Font_Awesome_5_Free']">
                                    calendar
                                </div>
                                <div className="justify-start text-gray-800 text-sm font-semibold font-['Inter']">
                                    Schedule Report
                                </div>
                            </div>
                        </div>
                        <div className="w-36 h-14 px-3 py-4 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex flex-col justify-start items-start gap-2.5">
                            <div className="inline-flex justify-start items-start gap-2">
                                <div className="w-4 h-4 justify-start text-gray-800 text-base font-normal font-['Font_Awesome_5_Free']">
                                    envelope
                                </div>
                                <div className="justify-start text-gray-800 text-sm font-semibold font-['Inter']">
                                    Email Report
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenerateCustomReportCard;
