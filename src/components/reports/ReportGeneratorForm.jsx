import React from "react";

function ReportGeneratorForm({
  reportTypeValue,
  timePeriodValue,
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

        <section
          aria-label="Report configuration"
          className="self-stretch h-[987px] relative"
        >
          <p className="w-[1317px] left-0 top-0 absolute justify-start text-black/60 text-sm font-normal font-['Inter']">
            Select sections and configure your report
          </p>

          {/* Top filters: Report Type & Time Period */}
          <section className="w-[1317px] h-16 left-0 top-[49px] absolute">
            <div className="w-[593px] left-[20px] top-[0.50px] absolute inline-flex flex-col justify-center items-center gap-3">
              <p className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                Report Type
              </p>
              <div className="self-stretch h-9 px-1.5 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                <span className="text-black text-sm font-normal font-['Inter']">
                  {reportTypeValue || "Select report type"}
                </span>
                <div className="w-6 h-6 flex items-center justify-center">
                  <img
                    data-layer="icon_dropdown_report_type"
                    className="w-6 h-6"
                    src="/icons/icon_dropdown.png"
                    alt="Open report type options"
                  />
                </div>
              </div>
            </div>

            <div className="w-[593px] left-[705px] top-[0.50px] absolute inline-flex flex-col justify-center items-center gap-3">
              <p className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                Time Period
              </p>
              <div className="w-[593px] h-9 px-2 py-[5px] bg-zinc-100 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-zinc-100 inline-flex justify-between items-center gap-2.5">
                <span className="text-black text-sm font-normal font-['Inter']">
                  {timePeriodValue || "Select time period"}
                </span>
                <div className="w-6 h-6 flex items-center justify-center">
                  <img
                    data-layer="icon_dropdown_time_period"
                    className="w-6 h-6"
                    src="/icons/icon_dropdown.png"
                    alt="Open time period options"
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
              {/* Executive Summary */}
              <article className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-52 inline-flex flex-col justify-start items-start gap-px">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      Executive Summary
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      High-level overview and key insights
                    </p>
                  </div>
                </div>
              </article>

              {/* Operational Overview */}
              <article className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-44 inline-flex flex-col justify-start items-start gap-0.5">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      Operational Overview
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      Current status of all operations
                    </p>
                  </div>
                </div>
              </article>

              {/* Weather Analysis */}
              <article className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-48 inline-flex flex-col justify-start items-start gap-0.5">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      Weather Analysis
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      Forecast and impact assessment
                    </p>
                  </div>
                </div>
              </article>

              {/* Equipment Status */}
              <article className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-48 inline-flex flex-col justify-start items-start gap-0.5">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      Equipment Status
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      Forecast and impact assessment
                    </p>
                  </div>
                </div>
              </article>

              {/* Road Conditions */}
              <article className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-48 inline-flex flex-col justify-start items-start gap-0.5">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      Road Conditions
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      Fleet availability and maintenance
                    </p>
                  </div>
                </div>
              </article>

              {/* AI Recommendations */}
              <article className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-56 inline-flex flex-col justify-start items-start gap-px">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      AI Recommendations
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      Haul road status and recommendations
                    </p>
                  </div>
                </div>
              </article>

              {/* Scenario Analysis */}
              <article className="self-stretch h-14 px-4 py-2.5 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-52 inline-flex flex-col justify-start items-start gap-0.5">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      Scenario Analysis
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      Simulation results and comparisons
                    </p>
                  </div>
                </div>
              </article>

              {/* Risk Assessment */}
              <article className="self-stretch h-14 px-4 py-3 bg-white/70 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-start gap-2.5">
                <div className="inline-flex justify-start items-center gap-3">
                  <div className="w-5 h-4 bg-zinc-100 rounded-[3px] border border-zinc-300" />
                  <div className="w-52 inline-flex flex-col justify-start items-start gap-px">
                    <h3 className="self-stretch justify-start text-black text-sm font-semibold font-['Inter']">
                      Risk Assessment
                    </h3>
                    <p className="self-stretch justify-start text-black/60 text-xs font-normal font-['Inter']">
                      Risk factors and mitigation strategies
                    </p>
                  </div>
                </div>
              </article>
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
