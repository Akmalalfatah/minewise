import React, { useEffect, useState } from "react";
import { getPortWeatherConditions } from "../../services/shippingPlannerService";

function PortWeatherConditions() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getPortWeatherConditions();
      setData(result);
    }
    load();
  }, []);

  const area = data?.area || "-";
  const location = data?.location || "-";
  const rainfall = data?.rainfall || "-";
  const temperature = data?.temperature || "-";
  const humidity = data?.humidity || "-";
  const wind = data?.wind || "-";
  const pressure = data?.pressure || "-";
  const visibility = data?.visibility || "-";
  const lightning = data?.lightning || "-";
  const updated = data?.updated || "-";
  const riskScore = data?.riskScore || "-";
  const riskTitle = data?.riskTitle || "-";
  const riskSubtitle = data?.riskSubtitle || "-";

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
                  className="IconWeather size-[18px]"
                  src="/icons/icon_weather.png"
                  alt="Weather icon"
                />
              </div>
              <div className="PortWeatherConditionTitle text-black text-sm font-semibold">
                Port Weather Conditions
              </div>

              <button
                type="button"
                className="HeaderActionButtonFilter size-8 px-2 py-[7px] left-[328px] top-0 absolute bg-[#efefef] rounded-2xl inline-flex flex-col justify-center items-center"
              >
                <div className="IconFilter size-[21px] relative" />
              </button>
            </div>
          </div>

          <div className="AreaSectionContainer self-stretch inline-flex justify-between items-center">
            <div className="AreaLabel text-black text-xs font-semibold">Area:</div>
            <div className="AreaValue text-right text-black text-xs font-semibold">
              {area}
            </div>
          </div>

          <div className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

          <div className="WeatherInfoSection self-stretch h-64 inline-flex justify-between items-center">

            <div className="LabelColumnContainer w-[87px] h-64 inline-flex flex-col justify-center items-center gap-5">
              <div className="LabelListContainer self-stretch h-[253px] flex flex-col justify-start items-start gap-3 text-black text-sm font-semibold">
                <div>Location</div>
                <div>Rainfall</div>
                <div>Temperature</div>
                <div>Humidity</div>
                <div>Wind</div>
                <div>Pressure</div>
                <div>Visibility</div>
                <div>Lightning</div>
                <div>Updated</div>
              </div>
            </div>

            <div className="ValueColumnContainer w-[117px] h-64 inline-flex flex-col justify-start items-end gap-5">
              <div className="ValueListContainer self-stretch flex flex-col justify-start items-end gap-3 text-black text-sm font-semibold">
                <div>{location}</div>
                <div>{rainfall}</div>
                <div>{temperature}</div>
                <div>{humidity}</div>
                <div>{wind}</div>
                <div>{pressure}</div>
                <div>{visibility}</div>
                <div>{lightning}</div>
                <div>{updated}</div>
              </div>
            </div>

          </div>

        </div>

        <div className="DividerMiddle self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]" />

        <div className="RiskSectionContainer self-stretch flex flex-col justify-start items-start gap-2.5">
          <div className="RiskSectionTitle self-stretch text-black text-sm font-semibold">
            Weather-Based Risk
          </div>

          <div className="RiskContentContainer self-stretch inline-flex justify-start items-center gap-[18px]">
            <div className="RiskScoreContainer w-[105px] h-14 px-2.5 py-[13px] bg-[#ffedef] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#ffd4c7] flex justify-center items-center">
              <div className="RiskScoreValue text-center text-[#8f0b09] text-2xl font-semibold">
                {riskScore}
              </div>
            </div>

            <div className="RiskDescriptionContainer w-[228px] inline-flex flex-col justify-start items-start gap-0.5">
              <div className="RiskDescriptionTitle self-stretch text-black text-xs font-semibold">
                {riskTitle}
              </div>
              <div className="RiskDescriptionSubtext self-stretch text-black/60 text-xs">
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
