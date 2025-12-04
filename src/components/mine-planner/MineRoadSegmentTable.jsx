import React, { useEffect, useState } from "react";
import { getMineRoadConditions } from "../../services/minePlannerService";

function MineRoadSegmentTable() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getMineRoadConditions();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  const segmentName = data.segment_name;
  const roadConditionLabel = data.road_condition_label;
  const travelTime = data.travel_time;
  const frictionIndex = data.friction_index;
  const waterDepth = data.water_depth;
  const speedLimit = data.speed_limit;
  const actualSpeed = data.actual_speed;
  const alertTitle = data.alert.title;
  const alertDescription = data.alert.description;

  return (
    <section
      data-layer="road_condition_card"
      aria-label="Mine road and site conditions"
      className="RoadConditionCard w-[485px] h-[553px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-center gap-2.5"
    >
      <div
        data-layer="road_condition_container"
        className="RoadConditionContainer size- flex flex-col justify-start items-start gap-3"
      >
        <header
          data-layer="header_container"
          className="HeaderContainer w-[442px] relative flex flex-col justify-center items-start gap-3"
        >
          <div
            data-layer="header_left_group"
            className="HeaderLeftGroup w-[235px] inline-flex justify-start items-center gap-3"
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
            <h2
              data-layer="road_condition_title"
              className="RoadConditionTitle text-black text-sm font-semibold"
            >
              Mine Road &amp; Site Conditions
            </h2>
          </div>

          <hr
            data-layer="divider_top"
            className="DividerTop self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
          />

          <button
            type="button"
            data-layer="header_action_button_filter"
            className="HeaderActionButtonFilter size-8 px-2 py-[7px] left-[391px] top-0 absolute bg-[#efefef] rounded-2xl flex flex-col justify-center items-center"
          >
            <div
              data-layer="icon_filter"
              className="IconFilter size-[21px] relative"
            />
          </button>
        </header>

        <section
          data-layer="segment_section_container"
          aria-label="Segment condition metrics"
          className="SegmentSectionContainer w-[440px] h-[206px] relative overflow-hidden"
        >
          <div
            data-layer="segment_info_container"
            className="SegmentInfoContainer w-[438px] left-0 top-[10px] absolute inline-flex flex-col justify-start items-start gap-[19px]"
          >
            <h3
              data-layer="segment_name"
              className="SegmentName self-stretch text-black text-sm font-semibold"
            >
              {segmentName}
            </h3>

            <div
              data-layer="road_condition_badge_container"
              className="RoadConditionBadgeContainer w-[190px] h-7 px-[7px] py-[5px] bg-[#ffedb2] rounded-[7px] inline-flex justify-center items-center"
            >
              <span
                data-layer="road_condition_badge_label"
                className="RoadConditionBadgeLabel text-black text-sm font-semibold"
              >
                {roadConditionLabel}
              </span>
            </div>

            <div
              data-layer="condition_metrics_container"
              className="ConditionMetricsContainer self-stretch inline-flex justify-start items-center gap-3.5"
            >
              <article
                data-layer="travel_time_container"
                aria-label="Travel time"
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
                    className="TravelTimeValue self-stretch text-black text-2xl font-semibold text-center"
                  >
                    {travelTime}
                  </div>
                </div>
              </article>

              <article
                data-layer="friction_index_container"
                aria-label="Friction index"
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
                    className="FrictionIndexValue self-stretch text-black text-2xl font-semibold text-center"
                  >
                    {frictionIndex}
                  </div>
                </div>
              </article>

              <article
                data-layer="water_depth_container"
                aria-label="Water depth"
                className="WaterDepthContainer w-[136px] h-[92px] px-6 py-[15px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-center items-center gap-2.5"
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
                    className="WaterDepthValue self-stretch text-black text-2xl font-semibold text-center"
                  >
                    {waterDepth}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <hr
          data-layer="divider_middle"
          className="DividerMiddle w-[442px] h-0 outline outline-1 outline-offset-[-0.50px] outline-[#d9d9d9]"
        />

        <section
          data-layer="speed_section_container"
          aria-label="Speed information"
          className="SpeedSectionContainer w-[440px] flex flex-col justify-start items-start gap-4"
        >
          <h3
            data-layer="speed_section_title"
            className="SpeedSectionTitle self-stretch text-black text-sm font-semibold"
          >
            Speed Information
          </h3>

          <div
            data-layer="speed_row_container"
            className="SpeedRowContainer self-stretch flex flex-col justify-start items-start gap-[39px]"
          >
            <div
              data-layer="speed_limit_container"
              className="SpeedLimitContainer self-stretch inline-flex justify-between items-center"
            >
              <div
                data-layer="speed_limit_block"
                className="SpeedLimitBlock w-[97px] inline-flex flex-col justify-start items-start gap-[11px]"
              >
                <div
                  data-layer="speed_limit_label"
                  className="SpeedLimitLabel self-stretch text-[#666666] text-xs font-semibold"
                >
                  Speed Limit
                </div>
                <div
                  data-layer="speed_limit_value"
                  className="SpeedLimitValue self-stretch text-black text-2xl font-semibold"
                >
                  {speedLimit}
                </div>
              </div>

              <div
                data-layer="actual_speed_block"
                className="ActualSpeedBlock w-24 inline-flex flex-col justify-start items-end gap-[11px]"
              >
                <div
                  data-layer="actual_speed_label"
                  className="ActualSpeedLabel self-stretch text-right text-[#666666] text-xs font-semibold"
                >
                  Actual Speed
                </div>
                <div
                  data-layer="actual_speed_value"
                  className="ActualSpeedValue self-stretch text-right text-black text-2xl font-semibold"
                >
                  {actualSpeed}
                </div>
              </div>
            </div>

            <aside
              data-layer="alert_section_container"
              aria-label="Road condition alert"
              className="AlertSectionContainer self-stretch h-[82px] px-6 py-3.5 bg-[#ffedee] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#ffd4c7] flex flex-col justify-start items-start gap-2.5"
            >
              <div
                data-layer="alert_icon_container"
                className="AlertIconContainer inline-flex justify-start items-start gap-6"
              >
                <div
                  data-layer="alert_triangle"
                  className="AlertTriangle w-[49px] h-[46px] relative overflow-hidden"
                >
                  <div
                    data-layer="alert_triangle_icon"
                    className="AlertTriangleIcon w-[42.66px] h-[34.70px] left-[3.17px] top-[5.55px] absolute outline outline-4 outline-offset-[-2px] outline-[#8f0b09]"
                    aria-hidden="true"
                  />
                </div>

                <div
                  data-layer="alert_text_container"
                  className="AlertTextContainer w-[277px] inline-flex flex-col justify-start items-start gap-1"
                >
                  <div
                    data-layer="alert_title"
                    className="AlertTitle self-stretch text-[#8f0b09] text-sm font-semibold"
                  >
                    {alertTitle}
                  </div>
                  <p
                    data-layer="alert_description"
                    className="AlertDescription self-stretch text-black text-xs font-semibold"
                  >
                    {alertDescription}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </section>
  );
}

export default MineRoadSegmentTable;
