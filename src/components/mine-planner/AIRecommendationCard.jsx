import React, { useEffect, useState } from "react";
import { getAIMineRecommendation } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function AIRecommendationCard() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const result = await getAIMineRecommendation({
          location,
          timePeriod,
          shift,
        });
        setData(result);
      } catch (error) {
        console.error("Failed to load AI mine recommendation:", error);
        setData(null);
      }
    }

    load();
  }, [location, timePeriod, shift]);

  const scenarios = Array.isArray(data?.scenarios) ? data.scenarios : [];

  const defaultScenario = {
    title: "Recommendation not available",
    description:
      "AI recommendation is not available for the current filter selection.",
  };

  const scenario1 = scenarios[0] || defaultScenario;
  const scenario2 = scenarios[1] || defaultScenario;
  const scenario3 = scenarios[2] || defaultScenario;

  const analysisSources =
    data?.analysis_sources ||
    "Weather, road conditions, equipment utilization, and production targets.";

  return (
    <section
      data-layer="ai_recommendation_card"
      aria-label="AI mining recommendation"
      className="AiRecommendationCard w-full h-full min-h-[492px] p-6 bg-white rounded-3xl flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="ai_recommendation_container"
        className="AiRecommendationContainer self-stretch flex flex-col justify-start items-start gap-6"
      >
        {/* HEADER */}
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
            data-layer="ai_recommendation_title"
            className="AiRecommendationTitle text-black text-sm font-semibold"
          >
            AI Recommendation
          </h2>
        </header>

        <hr
          data-layer="divider_top"
          className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
        />

        <section
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-6"
        >
          {/* SCENARIOS */}
          <section
            data-layer="scenario_list_container"
            aria-label="Recommended scenarios"
            className="ScenarioListContainer self-stretch flex flex-col justify-start items-start gap-[22px]"
          >
            {/* Scenario 1 */}
            <article
              data-layer="scenario1_wrapper"
              className="Scenario1Wrapper w-full px-[26px] py-[11px] bg-white rounded-[10px] 
              outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] 
              flex flex-col justify-center items-start gap-2.5
              transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div
                data-layer="scenario1_block"
                className="Scenario1Block w-full flex flex-col justify-start items-start gap-1"
              >
                <h3
                  data-layer="scenario1_title"
                  className="Scenario1Title self-stretch text-black text-sm font-semibold"
                >
                  {scenario1.title}
                </h3>
                <p
                  data-layer="scenario1_description"
                  className="Scenario1Description self-stretch text-black text-sm font-normal"
                >
                  {scenario1.description}
                </p>
              </div>
            </article>

            {/* Scenario 2 */}
            <article
              data-layer="scenario2_wrapper"
              className="Scenario2Wrapper w-full px-[26px] py-[11px] bg-white rounded-[10px] 
              outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] 
              flex flex-col justify-start items-start gap-2.5
              transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div
                data-layer="scenario2_block"
                className="Scenario2Block w-full flex flex-col justify-start items-start gap-1"
              >
                <h3 className="Scenario2Title text-black text-sm font-semibold">
                  {scenario2.title}
                </h3>
                <p className="Scenario2Description text-black text-sm font-normal">
                  {scenario2.description}
                </p>
              </div>
            </article>

            {/* Scenario 3 */}
            <article
              data-layer="scenario3_wrapper"
              className="Scenario3Wrapper w-full px-[26px] py-2.5 bg-white rounded-[10px] 
              outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] 
              flex flex-col justify-start items-start gap-2.5
              transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="Scenario3Block w-full flex flex-col gap-1">
                <h3 className="Scenario3Title text-black text-sm font-semibold">
                  {scenario3.title}
                </h3>
                <p className="Scenario3Description text-black text-sm">
                  {scenario3.description}
                </p>
              </div>
            </article>
          </section>

          {/* ANALYSIS SECTION */}
          <section
            data-layer="analysis_section_container"
            aria-label="Analysis basis"
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

export default AIRecommendationCard;
