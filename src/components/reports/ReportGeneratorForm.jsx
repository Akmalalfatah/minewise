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
    <section
      data-layer="report_generator_form"
      aria-labelledby="report-generator-title"
      className="ReportGeneratorForm w-[1365px] h-[1029px] p-6 bg-white/70 rounded-3xl inline-flex flex-col justify-center items-center gap-8"
    >
      <div className="self-stretch h-[976px] flex flex-col justify-start items-start gap-8">
        {/* Header */}
        <header className="inline-flex justify-start items-center gap-3">
          <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center gap-2.5">
            <img
              data-layer="icon_pen_report"
              className="w-5 h-5"
              src="/icons/icon_pen.png"
              alt="Report pen icon"
            />
          </div>
          <h1
            id="report-generator-title"
            className="justify-start text-black text-sm font-semibold font-['Inter']"
          >
            Generate Custom Report
          </h1>
        </header>

        {/* Body */}
        <section
          aria-label="Report configuration"
          className="self-stretch h-[987px] relative"
        >
          <p className="w-[1317px] left-0 top-0 absolute justify-start text-black/60 text-sm font-normal font-['Inter']">
            Select sections and configure your report
          </p>

          {/* Top filters: Report Type & Time Period */}
          <section className="w-[1317px] h-16 left-0 top-[49px] absolute">
            {/* Report Type */}
            <div className="w-[593px] left-[20px] top-[0.50px] absolute inline-flex flex-col justify-center items-center gap-3">
              <label className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                Report Type
              </label>
              <div className="self-stretch h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                <select
                  value={reportTypeValue || ""}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (onChangeReportType) {
                      onChangeReportType(selected);
                    }
                  }}
                  className="bg-transparent outline-none w-full text-black text-sm font-normal font-['Inter']"
                  aria-label="Select report type"
                >
                  <option value="">
                    {reportTypeValue || "Select report type"}
                  </option>
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
                    src="/icons/icon_dropdown.png"
                    alt=""
                  />
                </div>
              </div>
            </div>

            {/* Time Period */}
            <div className="w-[593px] left-[705px] top-[0.50px] absolute inline-flex flex-col justify-center items-center gap-3">
              <label className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                Time Period
              </label>
              <div className="w-[593px] h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                <select
                  value={timePeriodValue || ""}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (onChangeTimePeriod) {
                      onChangeTimePeriod(selected);
                    }
                  }}
                  className="bg-transparent outline-none w-full text-black text-sm font-normal font-['Inter']"
                  aria-label="Select time period"
                >
                  <option value="">
                    {timePeriodValue || "Select time period"}
                  </option>
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
                    src="/icons/icon_dropdown.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sections list */}
          <section
            aria-label="Report sections selection"
            className="w-[1317px] left-0 top-[152px] absolute inline-flex flex-col justify-start items-start gap-6"
          >
            <div className="self-stretch inline-flex justify-between items-center">
              <h2 className="justify-start text-black text-sm font-semibold font-['Inter']">
                Report Section
              </h2>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              {sectionsList.map((section) => {
                const checked = selectedSections.includes(section);
                return (
                  <article
                    key={section}
                    className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5"
                  >
                    <label className="inline-flex justify-start items-center gap-3 w-full cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          onToggleSection && onToggleSection(section)
                        }
                        className="w-4 h-4"
                        aria-label={section}
                      />
                      <div className="inline-flex flex-col justify-start items-start gap-px">
                        <span className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                          {section}
                        </span>
                        <span className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                          {section === "Executive Summary" &&
                            "High-level overview and key insights"}
                          {section === "Operational Overview" &&
                            "Current status of all operations"}
                          {section === "Weather Analysis" &&
                            "Forecast and impact assessment"}
                          {section === "Equipment Status" &&
                            "Forecast and impact assessment"}
                          {section === "Road Conditions" &&
                            "Fleet availability and maintenance"}
                          {section === "AI Recommendations" &&
                            "Haul road status and recommendations"}
                          {section === "Scenario Analysis" &&
                            "Simulation results and comparisons"}
                          {section === "Risk Assessment" &&
                            "Risk factors and mitigation strategies"}
                        </span>
                      </div>
                    </label>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Action buttons */}
          <footer className="left-0 top-[849px] absolute inline-flex justify-start items-center gap-3">
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
          </footer>
        </section>
      </div>
    </section>
  );
}

export default ReportGeneratorForm;
