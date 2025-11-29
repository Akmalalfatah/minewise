function AIShippingRecommendationCard({
  scenario1Title,
  scenario1Description,
  scenario2Title,
  scenario2Description,
  scenario3Title,
  scenario3Description,
  analysisSources,
}) {
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
                  {scenario1Title}
                </div>
                <div
                  data-layer="scenario1_description"
                  className="Scenario1Description self-stretch text-black text-sm font-normal"
                >
                  {scenario1Description}
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
                <div
                  data-layer="scenario2_title"
                  className="Scenario2Title self-stretch text-black text-sm font-semibold"
                >
                  {scenario2Title}
                </div>
                <div
                  data-layer="scenario2_description"
                  className="Scenario2Description self-stretch text-black text-sm font-normal"
                >
                  {scenario2Description}
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div
              data-layer="scenario3_wrapper"
              className="Scenario3Wrapper self-stretch h-[78px] px-[26px] py-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] flex flex-col justify-start items-start gap-2.5"
            >
              <div
                data-layer="scenario3_block"
                className="Scenario3Block w-[817px] flex flex-col justify-start items-start gap-1"
              >
                <div
                  data-layer="scenario3_title"
                  className="Scenario3Title self-stretch text-black text-sm font-semibold"
                >
                  {scenario3Title}
                </div>
                <div
                  data-layer="scenario3_description"
                  className="Scenario3Description self-stretch text-black text-sm font-normal"
                >
                  {scenario3Description}
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
              className="AnalysisTitle self-stretch text-black/60 text-sm font-normal"
            >
              Analysis Based On
            </div>
            <div
              data-layer="analysis_sources"
              className="AnalysisSources w-[505px] text-black text-base font-semibold"
            >
              {analysisSources}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIShippingRecommendationCard;
