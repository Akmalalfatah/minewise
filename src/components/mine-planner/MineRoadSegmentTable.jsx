import React, { useEffect, useState } from "react";
import { getMineRoadConditions } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function MineRoadSegmentTable() {
  const [data, setData] = useState(null);
  const { location, timePeriod, shift } = useFilterQuery();

  useEffect(() => {
    async function load() {
      try {
        const result = await getMineRoadConditions({
          location,
          timePeriod,
          shift,
        });
        setData(result);
      } catch (error) {
        console.error("Failed to load mine road conditions:", error);
        setData(null);
      }
    }

    load();
  }, [location, timePeriod, shift]);

  const segmentName = data?.segment_name ?? "Segment A";
  const roadConditionLabel = data?.road_condition_label ?? "Unknown";
  const travelTime = data?.travel_time ?? "-";
  const frictionIndex = data?.friction_index ?? "-";
  const waterDepth = data?.water_depth ?? "-";
  const speedLimit = data?.speed_limit ?? "-";
  const actualSpeed = data?.actual_speed ?? "-";

  const alert = data?.alert || {
    title: "No active alert",
    description: "There is no specific road condition alert for this segment.",
  };

  const alertTitle = alert.title;
  const alertDescription = alert.description;

  return (
    <section
      data-layer="road_condition_card"
      className="RoadConditionCard w-full h-full p-6 bg-white rounded-3xl flex flex-col items-center gap-2.5"
    >
      <div
        data-layer="road_condition_container"
        className="RoadConditionContainer w-full flex flex-col justify-start items-start gap-3"
      >
        {/* HEADER */}
        <div
          data-layer="header_container"
          className="HeaderContainer w-full relative flex flex-col justify-center items-start gap-3"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup inline-flex justify-start items-center gap-3"
          >
            <div
              data-layer="icon_wrapper"
              className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center gap-2.5"
            >
              <img
                data-layer="icon_road"
                className="IconRoad size-[18px]"
                src="/icons/icon_road.png"
                alt="Road icon"
              />
            </div>
            <div
              data-layer="road_condition_title"
              className="RoadConditionTitle text-black text-sm font-semibold"
            >
              Mine Road &amp; Site Conditions
            </div>
          </div>

          <div
            data-layer="divider_top"
            className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
          />
        </div>

        {/* SEGMENT + METRICS */}
        <div
          data-layer="segment_section_container"
          className="SegmentSectionContainer w-full relative overflow-hidden"
        >
          <div
            data-layer="segment_info_container"
            className="SegmentInfoContainer w-full inline-flex flex-col justify-start items-start gap-[19px]"
          >
            <div
              data-layer="segment_name"
              className="SegmentName self-stretch text-black text-sm font-semibold"
            >
              Road Segment : {segmentName}
            </div>

            <div
              data-layer="road_condition_badge_container"
              className="RoadConditionBadgeContainer w-[190px] h-7 px-[7px] py-[5px] bg-[#ffedb2] rounded-[7px] inline-flex justify-center items-center gap-2.5"
            >
              <div
                data-layer="road_condition_badge_label"
                className="RoadConditionBadgeLabel text-black text-sm font-semibold"
              >
                {roadConditionLabel}
              </div>
            </div>

            <div
              data-layer="condition_metrics_container"
              className="ConditionMetricsContainer self-stretch inline-flex justify-start items-center gap-3.5"
            >
              {/* Travel time */}
              <div
                data-layer="travel_time_container"
                className="TravelTimeContainer w-[136px] h-[92px] px-[19px] py-[15px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div
                  data-layer="travel_time_block"
                  className="TravelTimeBlock w-[98px] flex flex-col justify-start items-center gap-[11px]"
                >
                  <div
                    data-layer="travel_time_label"
                    className="TravelTimeLabel self-stretch text-center text-black text-sm font-semibold"
                  >
                    Travel Time
                  </div>
                  <div
                    data-layer="travel_time_value"
                    className="TravelTimeValue self-stretch text-black text-2xl font-semibold"
                  >
                    {travelTime}
                  </div>
                </div>
              </div>

              {/* Friction index */}
              <div
                data-layer="friction_index_container"
                className="FrictionIndexContainer w-[136px] h-[92px] px-5 py-[15px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div
                  data-layer="friction_index_block"
                  className="FrictionIndexBlock w-[95px] flex flex-col justify-start items-center gap-[11px]"
                >
                  <div
                    data-layer="friction_index_label"
                    className="FrictionIndexLabel self-stretch text-black text-sm font-semibold"
                  >
                    Friction Index
                  </div>
                  <div
                    data-layer="friction_index_value"
                    className="FrictionIndexValue self-stretch text-center text-black text-2xl font-semibold"
                  >
                    {frictionIndex}
                  </div>
                </div>
              </div>

              {/* Water depth */}
              <div
                data-layer="water_depth_container"
                className="WaterDepthContainer w-[136px] h-[92px] px-6 py-[15px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-start items-start gap-2.5"
              >
                <div
                  data-layer="water_depth_block"
                  className="WaterDepthBlock w-[87px] flex flex-col justify-center items-center gap-[11px]"
                >
                  <div
                    data-layer="water_depth_label"
                    className="WaterDepthLabel self-stretch text-black text-sm font-semibold"
                  >
                    Water Depth
                  </div>
                  <div
                    data-layer="water_depth_value"
                    className="WaterDepthValue self-stretch text-black text-2xl font-semibold"
                  >
                    {waterDepth}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          data-layer="divider_middle"
          className="DividerMiddle self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
        />

        {/* SPEED + ALERT */}
        <div
          data-layer="speed_section_container"
          className="SpeedSectionContainer w-full flex flex-col justify-start items-start gap-4"
        >
          <div
            data-layer="speed_section_title"
            className="SpeedSectionTitle self-stretch text-black text-sm font-semibold"
          >
            Speed Information
          </div>

          <div
            data-layer="speed_limit_container"
            className="SpeedLimitContainer self-stretch inline-flex justify-between items-center"
          >
            <div className="SpeedLimitBlock w-[97px] inline-flex flex-col justify-start items-start gap-[11px]">
              <div className="SpeedLimitLabel text-[#666666] text-xs font-semibold">
                Speed Limit
              </div>
              <div className="SpeedLimitValue text-black text-2xl font-semibold">
                {speedLimit}
              </div>
            </div>
            <div className="ActualSpeedBlock w-24 inline-flex flex-col justify-start items-end gap-[11px]">
              <div className="ActualSpeedLabel text-[#666666] text-xs font-semibold text-right">
                Actual Speed
              </div>
              <div className="ActualSpeedValue text-black text-2xl font-semibold text-right">
                {actualSpeed}
              </div>
            </div>
          </div>

          <div
            data-layer="alert_section_container"
            className="AlertSectionContainer self-stretch h-[82px] px-6 py-3.5 bg-[#ffedee] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#ffd4c7] flex flex-col justify-start items-start gap-2.5"
          >
            <div className="AlertTextContainer w-[277px] inline-flex flex-col justify-start items-start gap-1">
              <div className="AlertTitle text-[#8f0b09] text-sm font-semibold">
                {alertTitle}
              </div>
              <div className="AlertDescription text-black text-xs font-semibold">
                {alertDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MineRoadSegmentTable;
