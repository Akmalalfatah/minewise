function EnvironmentConditionTable({
  area,
  location,
  rainfall,
  temperature,
  humidity,
  wind,
  pressure,
  visibility,
  lightning,
  updated,
  riskScore,
  riskTitle,
  riskSubtitle,
}) {
  return (
    <div
      data-layer="environment_condition_card"
      className="EnvironmentConditionCard w-[360px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="environment_condition_container"
        className="EnvironmentConditionContainer self-stretch inline-flex flex-col justify-center items-center gap-[7px]"
      >
        {/* Header */}
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-3"
        >
          <div
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
                <div
                  data-layer="environment_condition_title"
                  className="EnvironmentConditionTitle text-black text-sm font-semibold"
                >
                  Environment Conditions
                </div>
              </div>

              <button
                type="button"
                data-layer="header_action_button_filter"
                className="HeaderActionButtonFilter size-8 px-2 py-[7px] bg-[#efefef] rounded-2xl inline-flex flex-col justify-center items-center"
              >
                <div
                  data-layer="icon_filter"
                  className="IconFilter size-[21px] relative"
                />
              </button>
            </div>
          </div>

          {/* Area row */}
          <div
            data-layer="area_row_container"
            className="AreaRowContainer self-stretch inline-flex justify-between items-center"
          >
            <div
              data-layer="area_label"
              className="AreaLabel text-black text-xs font-semibold"
            >
              Area:
            </div>
            <div
              data-layer="area_value"
              className="AreaValue text-right text-black text-xs font-semibold"
            >
              {area}
            </div>
          </div>

          {/* Divider */}
          <div
            data-layer="divider_top"
            className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
          />

          {/* Info rows */}
          <div
            data-layer="info_rows_container"
            className="InfoRowsContainer self-stretch inline-flex justify-between items-start gap-6"
          >
            {/* Label column */}
            <div
              data-layer="label_column"
              className="LabelColumn inline-flex flex-col justify-start items-start gap-3 text-black text-sm font-semibold"
            >
              <div data-layer="location_label">Location</div>
              <div data-layer="rainfall_label">Rainfall</div>
              <div data-layer="temperature_label">Temperature</div>
              <div data-layer="humidity_label">Humidity</div>
              <div data-layer="wind_label">Wind</div>
              <div data-layer="pressure_label">Pressure</div>
              <div data-layer="visibility_label">Visibility</div>
              <div data-layer="lightning_label">Lightning</div>
              <div data-layer="updated_label">Updated</div>
            </div>

            {/* Value column */}
            <div
              data-layer="value_column"
              className="ValueColumn inline-flex flex-col justify-start items-end gap-3 text-black text-sm font-semibold"
            >
              <div data-layer="location_value">{location}</div>
              <div data-layer="rainfall_value">{rainfall}</div>
              <div data-layer="temperature_value">{temperature}</div>
              <div data-layer="humidity_value">{humidity}</div>
              <div data-layer="wind_value">{wind}</div>
              <div data-layer="pressure_value">{pressure}</div>
              <div data-layer="visibility_value">{visibility}</div>
              <div data-layer="lightning_value">{lightning}</div>
              <div data-layer="updated_value">{updated}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider bottom */}
      <div
        data-layer="divider_bottom"
        className="DividerBottom self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
      />

      {/* Risk section */}
      <div
        data-layer="risk_section_container"
        className="RiskSectionContainer self-stretch flex flex-col justify-start items-start gap-2.5"
      >
        <div
          data-layer="risk_section_title"
          className="RiskSectionTitle text-black text-sm font-semibold"
        >
          Weather-Based Risk
        </div>

        <div
          data-layer="risk_content_container"
          className="RiskContentContainer self-stretch inline-flex justify-start items-center gap-[18px]"
        >
          <div
            data-layer="risk_score_container"
            className="RiskScoreContainer w-[105px] h-14 px-2.5 py-[13px] bg-[#ffedef] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#ffd4c7] flex justify-center items-center"
          >
            <div
              data-layer="risk_score_value"
              className="RiskScoreValue text-center text-[#8f0b09] text-2xl font-semibold"
            >
              {riskScore}
            </div>
          </div>

          <div
            data-layer="risk_description_container"
            className="RiskDescriptionContainer flex-1 inline-flex flex-col justify-start items-start gap-0.5"
          >
            <div
              data-layer="risk_description_main"
              className="RiskDescriptionMain text-black text-xs font-semibold"
            >
              {riskTitle}
            </div>
            <div
              data-layer="risk_description_sub"
              className="RiskDescriptionSub text-black/60 text-xs"
            >
              {riskSubtitle}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnvironmentConditionTable;
