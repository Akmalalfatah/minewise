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
    <div
      data-layer="ai_recommendation_card"
      className="AiRecommendationCard w-[929px] h-[492px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="ai_recommendation_container"
        className="AiRecommendationContainer self-stretch flex flex-col justify-start items-start gap-6"
      >

        {/* Header */}
        <div
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
          <div
            data-layer="ai_recommendation_title"
            className="AiRecommendationTitle text-black text-sm font-semibold"
          >
            AI Recommendation
          </div>
        </div>

        <div
          data-layer="divider_top"
          className="DividerTop self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-[#bdbdbd]"
        />

        {/* Content */}
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-6"
        >

          {/* Scenario list */}
          <div
            data-layer="scenario_list_container"
            className="ScenarioListContainer self-stretch flex flex-col justify-start items-start gap-[22px]"
          >
            {/* Scenario 1 */}
            <div
              data-layer="scenario1_wrapper"
              className="Scenario1Wrapper self-stretch h-[78px] px-[26px] py-[11px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] flex flex-col justify-center items-start gap-2.5"
            >
              <div
                data-layer="scenario1_block"
                className="Scenario1Block w-[815px] flex flex-col justify-start items-start gap-1"
              >
                <div
                  data-layer="scenario1_title"
                  className="Scenario1Title self-stretch text-black text-sm font-semibold"
                >
                  {data.scenarios[1].title}
                </div>
                <div
                  data-layer="scenario1_description"
                  className="Scenario1Description self-stretch text-black text-sm font-normal"
                >
                  {data.scenarios[1].description}
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div
              data-layer="scenario2_wrapper"
              className="Scenario2Wrapper self-stretch h-[78px] px-[26px] py-[11px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] flex flex-col justify-start items-start gap-2.5"
            >
              <div
                data-layer="scenario2_block"
                className="Scenario2Block w-[815px] flex flex-col justify-start items-start gap-1"
              >
                <div className="Scenario2Title text-black text-sm font-semibold">
                  {data.scenarios[2].title}
                </div>
                <div className="Scenario2Description text-black text-sm font-normal">
                  {data.scenarios[2].description}
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div
              data-layer="scenario3_wrapper"
              className="Scenario3Wrapper self-stretch h-[78px] px-[26px] py-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] flex flex-col justify-start items-start gap-2.5"
            >
              <div className="Scenario3Block w-[817px] flex flex-col gap-1">
                <div className="Scenario3Title text-black text-sm font-semibold">
                  {data.scenarios[3].title}
                </div>
                <div className="Scenario3Description text-black text-sm">
                  {data.scenarios[3].description}
                </div>
              </div>
            </div>
          </div>

          {/* Analysis section */}
          <div
            data-layer="analysis_section_container"
            className="AnalysisSectionContainer self-stretch flex flex-col justify-start items-start gap-3"
          >
            <div
              data-layer="analysis_title"
              className="AnalysisTitle text-black/60 text-sm font-normal"
            >
              Analysis Based On
            </div>
            <div
              data-layer="analysis_sources"
              className="AnalysisSources text-black text-base font-semibold"
            >
              {data.analysis_sources}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AIRecommendationCard;
