import React from "react";

function ReportGeneratorForm({
reportTypeValue,
timePeriodValue,
onGenerateReport,
onDownloadReport,
}) {
return (
<div
    data-layer="report_generator_form"
    className="ReportGeneratorForm w-[1365px] h-[1029px] p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-8"
>
    <div className="self-stretch h-[976px] flex flex-col justify-start items-start gap-8">
    <div className="inline-flex justify-start items-center gap-3">
        <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
        <img
            data-layer="icon_pen_report"
            className="w-5 h-5"
            src="src/icons/icon_pen.png"
            alt=""
        />
        </div>
        <div className="justify-start text-black text-sm font-semibold font-['Inter']">
        Generate Custom Report
        </div>
    </div>

    <div className="self-stretch h-[987px] relative">
        <div className="w-[1317px] left-0 top-0 absolute justify-start text-black/60 text-sm font-normal font-['Inter']">
        Select sections and configure your report
        </div>

        <div className="w-[1317px] h-16 left-0 top-[49px] absolute">
        <div className="w-[593px] left-[20px] top-[0.50px] absolute inline-flex flex-col justify-center items-center gap-3">
            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
            Report Type
            </div>
            <div className="self-stretch h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
            <div className="text-black text-sm font-normal font-['Inter']">
                {reportTypeValue || "Select report type"}
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
                <img
                data-layer="icon_dropdown_report_type"
                className="w-6 h-6"
                src="src/icons/icon_dropdown.png"
                alt=""
                />
            </div>
            </div>
        </div>

        <div className="w-[593px] left-[705px] top-[0.50px] absolute inline-flex flex-col justify-center items-center gap-3">
            <div className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
            Time Period
            </div>
            <div className="w-[593px] h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
            <div className="text-black text-sm font-normal font-['Inter']">
                {timePeriodValue || "Select time period"}
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
                <img
                data-layer="icon_dropdown_time_period"
                className="w-6 h-6"
                src="src/icons/icon_dropdown.png"
                alt=""
                />
            </div>
            </div>
        </div>
        </div>

        <div className="w-[1317px] left-0 top-[152px] absolute inline-flex flex-col justify-start items-start gap-6">
        <div className="self-stretch inline-flex justify-between items-center">
            <div className="justify-start text-black text-sm font-semibold font-['Inter']">
            Report Section
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

        <div className="left-0 top-[849px] absolute inline-flex justify-start items-center gap-3">
        <button
            type="button"
            onClick={onGenerateReport}
            className="w-40 h-14 px-4 py-3.5 bg-gray-800 rounded-[10px] flex justify-center items-center gap-2.5"
        >
            <span className="text-white text-sm font-semibold font-['Inter']">
            Generate Report
            </span>
        </button>

        <button
            type="button"
            onClick={onDownloadReport}
            className="w-40 h-14 px-4 py-3.5 bg-gray-800 rounded-[10px] inline-flex justify-center items-center gap-2.5"
        >
            <span className="text-white text-sm font-semibold font-['Inter']">
            Download
            </span>
        </button>
        </div>
    </div>
    </div>
</div>
);
}

<<<<<<< HEAD
export default ReportGeneratorForm;
=======
export default ReportGeneratorForm;
>>>>>>> athira-febe
