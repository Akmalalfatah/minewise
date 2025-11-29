function PortWeatherConditions({
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
      data-layer="port_weather_condition_card"
      className="PortWeatherConditionCard h-[492px] p-6 bg-white rounded-3xl inline-flex justify-center items-center gap-2.5"
    >
      <div
        data-layer="port_weather_condition_container"
        className="PortWeatherConditionContainer w-[360px] inline-flex flex-col justify-center items-center gap-[7px]"
      >
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch flex flex-col justify-start items-start gap-3"
        >
          {/* Header */}
          <div
            data-layer="header_container"
            className="HeaderContainer self-stretch flex flex-col justify-start items-start gap-2.5"
          >
            <div
              data-layer="header_left_group"
              className="HeaderLeftGroup relative inline-flex justify-start items-center gap-3"
            >
              <div
                data-layer="icon_wrapper"
                className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
              >
                <img
                  data-layer="icon_weather"
                  className="IconWeather size-[18px]"
                  src="/icons/icon_weather.png"
                  alt="Weather icon"
                />
              </div>
              <div
                data-layer="port_weather_condition_title"
                className="PortWeatherConditionTitle text-black text-sm font-semibold"
              >
                Port Weather Conditions
              </div>

              <button
                type="button"
                data-layer="header_action_button_filter"
                className="HeaderActionButtonFilter size-8 px-2 py-[7px] left-[328px] top-0 absolute bg-[#efefef] rounded-2xl inline-flex flex-col justify-center items-center"
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
            data-layer="area_section_container"
            className="AreaSectionContainer self-stretch inline-flex justify-between items-center"
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

          {/* Weather info */}
          <div
            data-layer="weather_info_section"
            className="WeatherInfoSection self-stretch h-64 inline-flex justify-between items-center"
          >
            {/* Label column */}
            <div
              data-layer="label_column_container"
              className="LabelColumnContainer w-[87px] h-64 inline-flex flex-col justify-center items-center gap-5"
            >
              <div
                data-layer="label_list_container"
                className="LabelListContainer self-stretch h-[253px] flex flex-col justify-start items-start gap-3 text-black text-sm font-semibold"
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
            </div>

            {/* Value column */}
            <div
              data-layer="value_column_container"
              className="ValueColumnContainer w-[117px] h-64 inline-flex flex-col justify-start items-end gap-5"
            >
              <div
                data-layer="value_list_container"
                className="ValueListContainer self-stretch flex flex-col justify-start items-end gap-3 text-black text-sm font-semibold"
              >
                <div data-layer="location_value" className="text-center">
                  {location}
                </div>
                <div data-layer="rainfall_value" className="text-center">
                  {rainfall}
                </div>
                <div data-layer="temperature_value" className="text-center">
                  {temperature}
                </div>
                <div data-layer="humidity_value" className="text-center">
                  {humidity}
                </div>
                <div data-layer="wind_value" className="text-center">
                  {wind}
                </div>
                <div data-layer="pressure_value" className="text-center">
                  {pressure}
                </div>
                <div data-layer="visibility_value" className="text-center">
                  {visibility}
                </div>
                <div data-layer="lightning_value" className="text-center">
                  {lightning}
                </div>
                <div data-layer="updated_value" className="text-center">
                  {updated}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider middle */}
        <div
          data-layer="divider_middle"
          className="DividerMiddle self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
        />

        {/* Risk section */}
        <div
          data-layer="risk_section_container"
          className="RiskSectionContainer self-stretch flex flex-col justify-start items-start gap-2.5"
        >
          <div
            data-layer="risk_section_title"
            className="RiskSectionTitle self-stretch text-black text-sm font-semibold"
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
              className="RiskDescriptionContainer w-[228px] inline-flex flex-col justify-start items-start gap-0.5"
            >
              <div
                data-layer="risk_description_title"
                className="RiskDescriptionTitle self-stretch text-black text-xs font-semibold"
              >
                {riskTitle}
              </div>
              <div
                data-layer="risk_description_subtext"
                className="RiskDescriptionSubtext self-stretch text-black/60 text-xs"
              >
                {riskSubtitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortWeatherConditions;
