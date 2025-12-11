// src/components/shipping-planner/AIShippingRecommendationCard.jsx
import React, { useEffect, useState } from "react";
import { getAIShippingRecommendation } from "../../services/shippingPlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function AIShippingRecommendationCard() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const filters = { location, timePeriod, shift };
        const result = await getAIShippingRecommendation(filters);
        setData(result);
      } catch (error) {
        console.error("Failed to load AI shipping recommendation:", error);
        setData(null);
      }
    }
    load();
  }, [location, timePeriod, shift]);

  if (!data) return null;

  const rawScenarios = Array.isArray(data.scenarios) ? data.scenarios : [];

  // Biar fleksibel: kalau datanya cuma 2 skenario, yang ditampilkan 2;
  // kalau 3, tampil 3; kalau kosong, kasih fallback 1 kartu info.
  const scenariosToRender =
    rawScenarios.length > 0
      ? rawScenarios.slice(0, 3)
      : [
          {
            title: "No AI scenarios available",
            description:
              "AI has not generated any shipping scenarios for the selected filters.",
          },
        ];

  const analysisSources = data.analysis_sources || "-";

  return (
    <section
      data-layer="ai_recommendation_card"
      aria-labelledby="shipping-ai-recommendation-title"
      className="AiRecommendationCard w-full p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5 h-full"
    >
      <div
        data-layer="ai_recommendation_container"
        className="AiRecommendationContainer self-stretch flex flex-col justify-start items-start gap-6"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup inline-flex justify-start items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
          >
            <img
              data-layer="icon_robot"
              className="IconRobot size-[18px]"
              src="/icons/icon_robot.png"
              alt="Robot icon"
            />
          </div>
          <h2
            id="shipping-ai-recommendation-title"
            data-layer="ai_recommendation_title"
            className="AiRecommendationTitle text-black text-sm font-semibold"
          >
            AI Recommendation
          </h2>
        </header>

        <div
          data-layer="divider_top"
          className="DividerTop self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#bdbdbd]"
        />

        {/* Content */}
        <section
          data-layer="content_container"
          aria-label="AI shipping recommendation scenarios and analysis"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-6"
        >
          {/* Scenario list */}
          <section
            data-layer="scenario_list_container"
            aria-label="AI recommendation scenarios"
            className="ScenarioListContainer self-stretch flex flex-col justify-start items-start gap-[22px]"
          >
            {scenariosToRender.map((scenario, index) => (
              <article
                key={index}
                data-layer={`scenario${index + 1}_wrapper`}
                className="ScenarioWrapper self-stretch px-[26px] py-[11px] bg-white rounded-[10px]
                  outline outline-1 outline-offset-[-1px] outline-[#c1ccdd]
                  flex flex-col justify-center items-start gap-2.5
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  data-layer={`scenario${index + 1}_block`}
                  className="ScenarioBlock w-full flex flex-col justify-start items-start gap-1"
                >
                  <h3 className="ScenarioTitle self-stretch text-black text-sm font-semibold">
                    {scenario.title || "-"}
                  </h3>
                  <p className="ScenarioDescription self-stretch text-black text-sm font-normal">
                    {scenario.description || "-"}
                  </p>
                </div>
              </article>
            ))}
          </section>

          {/* Analysis section */}
          <section
            data-layer="analysis_section_container"
            aria-label="Basis analysis AI shipping recommendation"
            className="AnalysisSectionContainer self-stretch flex flex-col justify-start items-start gap-3"
          >
            <p
              data-layer="analysis_title"
              className="AnalysisTitle text-black/60 text-sm font-normal"
            >
              Analysis Based On
            </p>
            <p
              data-layer="analysis_sources"
              className="AnalysisSources text-black text-base font-semibold"
            >
              {analysisSources}
            </p>
          </section>
        </section>
      </div>
    </section>
  );
}

export default AIShippingRecommendationCard;
