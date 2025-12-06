import React, { useEffect, useState } from "react";
import { getDecisionImpact } from "../../services/dashboardService";
import { ChartBarMultiple } from "../ui/ChartBarMultiple";

function DecisionImpactAnalysisCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getDecisionImpact();
        setData(result);
      } catch (error) {
        console.error("Failed to load decision impact data:", error);
      }
    }

    load();
  }, []);

  if (!data) return null;

  // Safely read correlation summary
  const correlationSummary = data.correlation_summary || {};
  const overallImpact =
    correlationSummary.overall_impact !== undefined &&
    correlationSummary.overall_impact !== null
      ? correlationSummary.overall_impact
      : "-";

  return (
    <section
      data-layer="decision_impact_analysis_card"
      aria-label="Decision impact analysis"
      className="DecisionImpactAnalysisCard w-[729px] h-[316px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="card_container"
        className="CardContainer w-[681px] h-[260px] flex flex-col justify-start items-start gap-6"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup w-[214px] inline-flex justify-start items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
          >
            <img
              data-layer="icon_decision"
              className="IconDecision size-[18px]"
              src="/icons/icon_decision.png"
              alt="Decision analysis icon"
            />
          </div>
          <h2
            data-layer="decision_analysis_title"
            className="DecisionAnalysisTitle text-black text-sm font-semibold"
          >
            Decision Impact Analysis
          </h2>
        </header>

        {/* Content */}
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch inline-flex justify-start items-start gap-8"
        >
          {/* Analysis summary */}
          <section
            data-layer="analysis_section"
            aria-label="Rainfall versus production correlation"
            className="AnalysisSection w-[220px] h-[114px] inline-flex flex-col justify-start items-start gap-3"
          >
            <h3
              data-layer="analysis_title"
              className="AnalysisTitle text-black text-xs font-semibold"
            >
              Data Curah Hujan vs Produksi
            </h3>

            <div
              data-layer="divider"
              className="Divider self-stretch flex-1 outline outline-[0.50px] outline-black/25"
            />

            <article
              data-layer="correlation_result_group"
              className="CorrelationResultGroup w-[89px] h-[66px] flex flex-col justify-start items-start gap-2"
            >
              <span
                data-layer="correlation_result_title"
                className="CorrelationResultTitle text-[#666] text-xs"
              >
                Hasil korelasi
              </span>
              <p
                data-layer="correlation_result_input"
                className="CorrelationResultInput text-black text-4xl font-semibold"
              >
                {overallImpact}
              </p>
            </article>
          </section>

          {/* Chart */}
          <section
            data-layer="chart_section"
            aria-label="Rainfall and production comparison chart"
            className="ChartSection w-[429px] h-[225px] relative"
          >
            <div className="DecisionLineGraph w-[383px] h-[250px] left-[46px] top-[-54px] absolute">
              <ChartBarMultiple />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default DecisionImpactAnalysisCard;
