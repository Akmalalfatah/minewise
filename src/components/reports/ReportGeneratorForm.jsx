import React from "react";

function ReportGeneratorForm({
    reportTypeValue,
    timePeriodValue,
    reportTypes = [],
    timePeriods = [],
    sectionsList = [],
    selectedSections = [],
    onChangeReportType,
    onChangeTimePeriod,
    onToggleSection,
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
                    <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center">
                        <img
                            data-layer="icon_pen_report"
                            className="w-5 h-5"
                            src="src/icons/icon_pen.png"
                            alt=""
                        />
                    </div>
                    <div className="text-black text-sm font-semibold font-['Inter']">
                        Generate Custom Report
                    </div>
                </div>

                <div className="self-stretch h-[987px] relative">
                    <div className="w-[1317px] absolute top-0 text-black/60 text-sm font-normal font-['Inter']">
                        Select sections and configure your report
                    </div>

                    <div className="w-[1317px] h-16 absolute top-[49px] left-0">
                        <div className="w-[593px] absolute left-[20px] top-[0.5px] flex flex-col gap-3">
                            <div className="text-black text-sm font-semibold font-['Inter']">
                                Report Type
                            </div>
                            <div className="h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-zinc-100 flex justify-between items-center">
                                <select
                                    value={reportTypeValue || ""}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        onChangeReportType && onChangeReportType(selected);
                                    }}
                                    className="bg-transparent outline-none w-full text-black text-sm font-normal font-['Inter']"
                                >
                                    <option value="">{reportTypeValue || "Select report type"}</option>
                                    {reportTypes.map((rt) => (
                                        <option key={rt.id} value={rt.id}>
                                            {rt.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
                                    <img
                                        data-layer="icon_dropdown_report_type"
                                        className="w-6 h-6"
                                        src="src/icons/icon_dropdown.png"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-[593px] absolute left-[705px] top-[0.5px] flex flex-col gap-3">
                            <div className="text-black text-sm font-semibold font-['Inter']">
                                Time Period
                            </div>
                            <div className="h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-zinc-100 flex justify-between items-center">
                                <select
                                    value={timePeriodValue || ""}
                                    onChange={(e) => {
                                        const selected = e.target.value;
                                        onChangeTimePeriod && onChangeTimePeriod(selected);
                                    }}
                                    className="bg-transparent outline-none w-full text-black text-sm font-normal font-['Inter']"
                                >
                                    <option value="">{timePeriodValue || "Select time period"}</option>
                                    {timePeriods.map((tp) => (
                                        <option key={tp.id} value={tp.id}>
                                            {tp.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="w-6 h-6 flex items-center justify-center pointer-events-none">
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

                    <div className="w-[1317px] absolute top-[152px] flex flex-col gap-6">
                        <div className="text-black text-sm font-semibold font-['Inter']">
                            Report Section
                        </div>

                        <div className="flex flex-col gap-6">
                            {sectionsList.map((section) => {
                                const checked = selectedSections.includes(section);
                                return (
                                    <label
                                        key={section}
                                        className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex items-center cursor-pointer"
                                    >
                                        <div className="inline-flex justify-start items-center gap-3 w-full">
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => onToggleSection && onToggleSection(section)}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex flex-col gap-0.5">
                                                <div className="text-black text-sm font-semibold font-['Inter']">
                                                    {section}
                                                </div>
                                                <div className="text-black/60 text-xs font-normal font-['Inter']">
                                                    {section === "Executive Summary" && "High-level overview and key insights"}
                                                    {section === "Operational Overview" && "Current status of all operations"}
                                                    {section === "Weather Analysis" && "Forecast and impact assessment"}
                                                    {section === "Equipment Status" && "Forecast and impact assessment"}
                                                    {section === "Road Conditions" && "Fleet availability and maintenance"}
                                                    {section === "AI Recommendations" && "Haul road status and recommendations"}
                                                    {section === "Scenario Analysis" && "Simulation results and comparisons"}
                                                    {section === "Risk Assessment" && "Risk factors and mitigation strategies"}
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="absolute top-[849px] flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onGenerateReport}
                            className="w-40 h-14 px-4 py-3.5 bg-gray-800 rounded-[10px] flex justify-center items-center"
                        >
                            <span className="text-white text-sm font-semibold font-['Inter']">
                                Generate Report
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={onDownloadReport}
                            className="w-40 h-14 px-4 py-3.5 bg-gray-800 rounded-[10px] flex justify-center items-center"
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

export default ReportGeneratorForm;
