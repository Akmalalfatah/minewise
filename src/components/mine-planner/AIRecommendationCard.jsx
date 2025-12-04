import React, { useEffect, useState } from "react";
import { getAIMineRecommendation } from "../../services/minePlannerService";

function AIRecommendationCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getAIMineRecommendation();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="ai_recommendation_card"
      aria-label="AI mining recommendation"
      className="AiRecommendationCard w-[929px] h-[492px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="ai_recommendation_container"
        className="AiRecommendationContainer self-stretch flex flex-col justify-start items-start gap-6"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup w-[181px] inline-flex justify-start items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
          >
            <img
              data-layer="icon_ai"
              className="IconAi size-[18px]"
              src="/icons/icon_ai.png"
              alt="AI icon"
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
          className="DividerTop self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#bdbdbd]"
        />

        {/* Content */}
        <section
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-6"
        >
          {/* Scenario list */}
          <section
            data-layer="scenario_list_container"
            aria-label="Recommended scenarios"
            className="ScenarioListContainer self-stretch flex flex-col justify-start items-start gap-[22px]"
          >
            {/* Scenario 1 */}
            <article
              data-layer="scenario1_wrapper"
              className="Scenario1Wrapper self-stretch h-[78px] px-[26px] py-[11px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] flex flex-col justify-center items-start gap-2.5"
            >
              <div
                data-layer="scenario1_block"
                className="Scenario1Block w-[815px] flex flex-col justify-start items-start gap-1"
              >
                <h3
                  data-layer="scenario1_title"
                  className="Scenario1Title self-stretch text-black text-sm font-semibold"
                >
                  {data.scenarios[1].title}
                </h3>
                <p
                  data-layer="scenario1_description"
                  className="Scenario1Description self-stretch text-black text-sm font-normal"
                >
                  {data.scenarios[1].description}
                </p>
              </div>
            </article>

            {/* Scenario 2 */}
            <article
              data-layer="scenario2_wrapper"
              className="Scenario2Wrapper self-stretch h-[78px] px-[26px] py-[11px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] flex flex-col justify-start items-start gap-2.5"
            >
              <div
                data-layer="scenario2_block"
                className="Scenario2Block w-[815px] flex flex-col justify-start items-start gap-1"
              >
                <h3 className="Scenario2Title text-black text-sm font-semibold">
                  {data.scenarios[2].title}
                </h3>
                <p className="Scenario2Description text-black text-sm font-normal">
                  {data.scenarios[2].description}
                </p>
              </div>
            </article>

            {/* Scenario 3 */}
            <article
              data-layer="scenario3_wrapper"
              className="Scenario3Wrapper self-stretch h-[78px] px-[26px] py-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] flex flex-col justify-start items-start gap-2.5"
            >
              <div className="Scenario3Block w-[817px] flex flex-col gap-1">
                <h3 className="Scenario3Title text-black text-sm font-semibold">
                  {data.scenarios[3].title}
                </h3>
                <p className="Scenario3Description text-black text-sm">
                  {data.scenarios[3].description}
                </p>
              </div>
            </article>
          </section>

          {/* Analysis section */}
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
              {data.analysis_sources}
            </p>
          </section>
        </section>
      </div>
    </section>
  );
}

export default AIRecommendationCard;
