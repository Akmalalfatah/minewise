import React from "react";
import { motion } from "framer-motion";

function ReportGeneratorForm({
  reportTypeValue,
  timePeriodValue,
  reportTypes = [],
  timePeriods = [],
  sectionsList = [],
  selectedSections = [],
  notesValue,
  onChangeReportType,
  onChangeTimePeriod,
  onToggleSection,
  onChangeNotes,
  onGenerateReport,
  onDownloadReport,
}) {
  return (
    <motion.section
      data-layer="report_generator_form"
      aria-labelledby="report-generator-title"
      className="w-full max-w-[1365px] p-6 bg-white/70 rounded-3xl"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="w-full flex flex-col gap-8">
        <header className="flex items-center gap-3">
          <div className="w-8 h-8 p-1.5 bg-gray-800 rounded-2xl flex justify-center items-center">
            <img
              data-layer="icon_pen_report"
              className="w-5 h-5"
              src="/icons/icon_pen.png"
              alt="Report pen icon"
            />
          </div>
          <h1
            id="report-generator-title"
            className="text-black text-sm font-semibold font-['Inter']"
          >
            Generate Custom Report
          </h1>
        </header>

        <section
          aria-label="Report configuration"
          className="w-full flex flex-col gap-8"
        >
          <p className="text-black/60 text-sm font-normal font-['Inter']">
            Select sections, add notes, and configure your report
          </p>

          <div className="w-full flex gap-[112px]">
            <div className="flex-1 flex flex-col gap-3">
              <label className="text-black text-sm font-semibold font-['Inter']">
                Report Type
              </label>
              <div className="h-9 px-1.5 py-[10px] bg-[#efefef] rounded-[5px] outline outline-1 outline-offset-[-1px] outline-zinc-100 flex justify-between items-center gap-2.5">
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
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <label className="text-black text-sm font-semibold font-['Inter']">
                Time Period
              </label>
              <div className="h-9 px-2 py-[10px] bg-[#efefef] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 flex justify-between items-center gap-2.5">
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
              </div>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-[2fr,1.4fr] gap-8">
            <div
              aria-label="Report sections selection"
              className="w-full flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-black text-sm font-semibold font-['Inter']">
                  Report Section
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {sectionsList.map((section, index) => {
                  const checked = selectedSections.includes(section);

                  const articleBase =
                    "h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] flex items-center transition-all duration-200";
                  const articleState = checked
                    ? " outline-[#1C2534] shadow-[0_0_0_1px_#1C2534]"
                    : " outline-slate-300";

                  return (
                    <motion.article
                      key={section}
                      className={`${articleBase} ${articleState}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.25,
                        ease: "easeOut",
                        delay: index * 0.03,
                      }}
                      whileHover={{ scale: 1.01, y: -1 }}
                    >
                      <label className="flex items-center gap-3 w-full cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            onToggleSection && onToggleSection(section)
                          }
                          className="w-4 h-4 accent-[#1C2534]"
                          aria-label={section}
                        />
                        <div className="flex flex-col gap-px">
                          <span className="text-black text-sm font-semibold font-['Inter']">
                            {section}
                          </span>
                          <span className="text-black/60 text-xs font-normal font-['Inter']">
                            {section === "Executive Summary" &&
                              "High-level overview and key insights"}
                            {section === "Operational Overview" &&
                              "Current status of all operations"}
                            {section === "Weather Analysis" &&
                              "Forecast and impact assessment"}
                            {section === "Equipment Status" &&
                              "Equipment availability and utilization"}
                            {section === "Road Conditions" &&
                              "Haul road status and restrictions"}
                            {section === "AI Recommendations" &&
                              "AI-driven operational suggestions"}
                            {section === "Scenario Analysis" &&
                              "Simulation results and comparisons"}
                            {section === "Risk Assessment" &&
                              "Risk factors and mitigation strategies"}
                          </span>
                        </div>
                      </label>
                    </motion.article>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <h2 className="text-black text-sm font-semibold font-['Inter']">
                Additional Notes
              </h2>
              <motion.div
                className="w-full px-3 py-2 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut", delay: 0.15 }}
              >
                <textarea
                  value={notesValue || ""}
                  onChange={(e) =>
                    onChangeNotes && onChangeNotes(e.target.value)
                  }
                  rows={5}
                  className="w-full bg-transparent outline-none resize-none text-sm font-normal font-['Inter'] text-black placeholder:text-black/40"
                  placeholder="Add context for this report, e.g. weather anomaly, unexpected downtime, or operational decisions by planner."
                  aria-label="Additional notes for the report"
                />
              </motion.div>
              <p className="text-xs text-black/50 font-['Inter']">
                Optional: these notes will be added as an “Operator Notes” section
                in the generated PDF.
              </p>
            </div>
          </div>

          <footer className="flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              onClick={onGenerateReport}
              className="w-40 h-12 px-4 py-3.5 bg-gray-800 rounded-[10px] flex justify-center items-center"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white text-sm font-semibold font-['Inter']">
                Generate Report
              </span>
            </motion.button>

            <motion.button
              type="button"
              onClick={onDownloadReport}
              className="w-30 h-12 px-4 py-3.5 bg-gray-800 rounded-[10px] flex justify-center items-center"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white text-sm font-semibold font-['Inter']">
                Download
              </span>
            </motion.button>
          </footer>
        </section>
      </div>
    </motion.section>
  );
}

export default ReportGeneratorForm;