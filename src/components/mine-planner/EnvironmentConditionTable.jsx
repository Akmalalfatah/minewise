import React, { useEffect, useState } from "react";
import { getEnvironmentConditions } from "../../services/minePlannerService";

function EnvironmentConditionTable() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getEnvironmentConditions();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="environment_condition_card"
      aria-label="Environment conditions and weather-based risk"
      className="EnvironmentConditionCard w-[360px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="environment_condition_container"
        className="EnvironmentConditionContainer self-stretch inline-flex flex-col justify-center items-center gap-[7px]"
      >
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-3"
        >
          {/* Header */}
          <header
            data-layer="header_container"
            className="HeaderContainer self-stretch flex flex-col justify-start items-start gap-2.5"
          >
            <div
              data-layer="header_left_group"
              className="HeaderLeftGroup relative inline-flex justify-between items-center gap-3"
            >
              <div className="inline-flex items-center gap-3">
                <div
                  data-layer="icon_wrapper"
                  className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
                >
                  <img
                    data-layer="icon_environment"
                    className="IconEnvironment size-[18px]"
                    src="/icons/icon_environment.png"
                    alt="Environment icon"
                  />
                </div>
                <h2
                  data-layer="environment_condition_title"
                  className="EnvironmentConditionTitle text-black text-sm font-semibold"
                >
                  Environment Conditions
                </h2>
              </div>

              <button
                type="button"
                aria-label="Filter environment conditions"
                data-layer="header_action_button_filter"
                className="HeaderActionButtonFilter size-8 px-2 py-[7px] bg-[#efefef] rounded-2xl flex justify-center items-center"
              >
                <div
                  data-layer="icon_filter"
                  className="IconFilter size-[21px]"
                />
              </button>
            </div>
          </header>

          {/* Area */}
          <section
            data-layer="area_row_container"
            aria-label="Environment area"
            className="AreaRowContainer self-stretch inline-flex justify-between items-center"
          >
            <span
              data-layer="area_label"
              className="AreaLabel text-black text-xs font-semibold"
            >
              Area:
            </span>
            <span
              data-layer="area_value"
              className="AreaValue text-right text-black text-xs font-semibold"
            >
              {data.area}
            </span>
          </section>

          <hr
            data-layer="divider_top"
            className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-[#bdbdbd]"
          />

          {/* Info rows */}
          <section
            data-layer="info_rows_container"
            aria-label="Environment condition details"
            className="InfoRowsContainer self-stretch inline-flex justify-between items-start gap-6"
          >
            {/* Labels */}
            <div
              data-layer="label_column"
              className="LabelColumn inline-flex flex-col justify-start items-start gap-3 text-black text-sm font-semibold"
            >
              <span>Location</span>
              <span>Rainfall</span>
              <span>Temperature</span>
              <span>Humidity</span>
              <span>Wind</span>
              <span>Pressure</span>
              <span>Visibility</span>
              <span>Lightning</span>
              <span>Updated</span>
            </div>

            {/* Values */}
            <div
              data-layer="value_column"
              className="ValueColumn inline-flex flex-col justify-start items-end gap-3 text-black text-sm font-semibold"
            >
              <span>{data.location}</span>
              <span>{data.rainfall}</span>
              <span>{data.temperature}</span>
              <span>{data.humidity}</span>
              <span>{data.wind}</span>
              <span>{data.pressure}</span>
              <span>{data.visibility}</span>
              <span>{data.lightning}</span>
              <span>{data.updated}</span>
            </div>
          </section>
        </div>
      </div>

      <hr
        data-layer="divider_bottom"
        className="DividerBottom self-stretch h-0 outline outline-[0.50px] outline-[#bdbdbd]"
      />

      {/* Risk section */}
      <section
        data-layer="risk_section_container"
        aria-label="Weather-based risk"
        className="RiskSectionContainer self-stretch flex flex-col justify-start items-start gap-2.5"
      >
        <h3
          data-layer="risk_section_title"
          className="RiskSectionTitle text-black text-sm font-semibold"
        >
          Weather-Based Risk
        </h3>

        <div
          data-layer="risk_content_container"
          className="RiskContentContainer self-stretch inline-flex justify-start items-center gap-[18px]"
        >
          <div
            data-layer="risk_score_container"
            className="RiskScoreContainer w-[105px] h-14 px-2.5 py-[13px] bg-[#ffedef] rounded-[10px] outline outline-[#ffd4c7]"
          >
            <p className="RiskScoreValue text-[#8f0b09] text-2xl font-semibold">
              {data.risk.score}
            </p>
          </div>

          <div
            data-layer="risk_description_container"
            className="RiskDescriptionContainer flex-1 flex flex-col gap-0.5"
          >
            <p className="RiskDescriptionMain text-black text-xs font-semibold">
              {data.risk.title}
            </p>
            <p className="RiskDescriptionSub text-black/60 text-xs">
              {data.risk.subtitle}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

export default EnvironmentConditionTable;
