import React, { useEffect, useState } from "react";
import { getReportGeneratorForm } from "../../services/reportsService";

function GenerateCustomReportCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function load() {
            const result = await getReportGeneratorForm();
            setData(result);
        }
        load();
    }, []);

    if (!data) return null;

    return (
        <div className="w-[876px] h-[1215px] p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-8">
            <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div className="inline-flex justify-start items-center gap-3">
                    <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
                        <img data-layer="icon_pen" className="w-5 h-5" src="src/icons/icon_pen.png" />
                    </div>
                    <div className="justify-start text-black text-sm font-semibold font-['Inter']">Generate Custom Report</div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-8">
                    <div className="self-stretch justify-start text-black/60 text-sm font-normal font-['Inter']">
                        Select sections and configure your report
                    </div>

                    <div className="self-stretch inline-flex justify-center items-center gap-20 flex-wrap content-center">

                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">Report Type</div>
                            <div className="self-stretch h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                                <div className="text-black text-sm font-normal font-['Inter']">{data.report_type}</div>
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img data-layer="icon_dropdown" className="w-6 h-6" src="src/icons/icon_dropdown.png" />
                                </div>
                            </div>
                        </div>

                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">Time Period</div>
                            <div className="self-stretch h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                                <div className="text-black text-sm font-normal font-['Inter']">{data.time_period}</div>
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img data-layer="icon_dropdown" className="w-6 h-6" src="src/icons/icon_dropdown.png" />
                                </div>
                            </div>
                        </div>

                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">Format</div>
                            <div className="self-stretch h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                                <div className="text-black text-sm font-normal font-['Inter']">{data.format}</div>
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img data-layer="icon_dropdown" className="w-6 h-6" src="src/icons/icon_dropdown.png" />
                                </div>
                            </div>
                        </div>

                        <div className="w-96 inline-flex flex-col justify-center items-center gap-3">
                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">Detail Level</div>
                            <div className="self-stretch h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                                <div className="text-black text-sm font-normal font-['Inter']">{data.detail_level}</div>
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img data-layer="icon_dropdown" className="w-6 h-6" src="src/icons/icon_dropdown.png" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="self-stretch inline-flex justify-between items-center">
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">Report Section</div>
                            <div className="justify-start text-black text-sm font-semibold font-['Inter']">Select All</div>
                        </div>

                        <div className="self-stretch flex flex-col justify-start items-start gap-6">

                            {data.sections.map((section, index) => (
                                <div key={index} className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                                    <div className="inline-flex justify-start items-center gap-3">
                                        <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                                        <div className="w-52 inline-flex flex-col justify-start items-start gap-px">
                                            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">{section.title}</div>
                                            <div className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">{section.description}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>

                    <div className="inline-flex justify-start items-center gap-3">
                        <div className="w-40 h-14 px-4 py-3.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5">
                            <div className="justify-start text-white text-sm font-semibold font-['Inter']">Generate Report</div>
                        </div>

                        <div className="w-40 h-14 px-3 py-4 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex flex-col justify-start items-start gap-2.5">
                            <div className="inline-flex justify-start items-start gap-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <img data-layer="icon_calendar" className="w-4 h-4" src="src/icons/icon_calendar.png" />
                                </div>
                                <div className="justify-start text-gray-800 text-sm font-semibold font-['Inter']">Schedule Report</div>
                            </div>
                        </div>

                        <div className="w-36 h-14 px-3 py-4 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 inline-flex flex-col justify-start items-start gap-2.5">
                            <div className="inline-flex justify-start items-start gap-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                    <img data-layer="icon_envelope" className="w-4 h-4" src="src/icons/icon_envelope.png" />
                                </div>
                                <div className="justify-start text-gray-800 text-sm font-semibold font-['Inter']">Email Report</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default GenerateCustomReportCard;
