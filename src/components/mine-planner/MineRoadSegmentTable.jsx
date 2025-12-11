import React, { useEffect, useState } from "react";
import { getMineRoadConditions } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";
import AnimatedNumber from "../animation/AnimatedNumber";

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

  const parseValueWithUnit = (raw, fallback = "-") => {
    if (raw === undefined || raw === null || raw === "") {
      return { num: null, unit: "", raw: fallback };
    }

    if (typeof raw === "number") {
      return { num: raw, unit: "", raw: String(raw) };
    }

    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (!trimmed) return { num: null, unit: "", raw: fallback };

      const match = trimmed.match(/^([0-9]+(?:[.,][0-9]+)?)\s*(.*)$/);
      if (match) {
        const num = parseFloat(match[1].replace(",", "."));
        const unit = match[2];
        if (!isNaN(num)) {
          return { num, unit, raw: trimmed };
        }
      }
      return { num: null, unit: "", raw: trimmed };
    }

    return { num: null, unit: "", raw: String(raw) };
  };

  const segments = Array.isArray(data?.segments) ? data.segments : [];
  const activeSegment = segments[0] || null;

  const segmentName = activeSegment?.segment_name ?? "Segment A";
  const roadConditionLabel = activeSegment?.road_condition_label ?? "Unknown";

  const travel = parseValueWithUnit(activeSegment?.travel_time, "-");
  const frictionIndexRaw =
    activeSegment && activeSegment.friction_index !== undefined
      ? activeSegment.friction_index
      : "-";
  const waterDepth = parseValueWithUnit(activeSegment?.water_depth, "-");
  const speedLimit = parseValueWithUnit(activeSegment?.speed_limit, "-");
  const actualSpeed = parseValueWithUnit(activeSegment?.actual_speed, "-");

  const alert = activeSegment?.alert || {
    title: "No active alert",
    description: "There is no specific road condition alert for this segment.",
  };

  const alertTitle = alert.title;
  const alertDescription = alert.description;

  const isNumber = (v) => typeof v === "number";

  return (
    <section
      data-layer="road_condition_card"
      className="RoadConditionCard w-full h-full p-6 bg-white rounded-3xl flex flex-col items-center gap-2.5"
      aria-labelledby="mine-road-site-conditions-title"
    >
      <div
        data-layer="road_condition_container"
        className="RoadConditionContainer w-full flex flex-col justify-start items-start gap-3"
      >
        <header
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
            <h2
              id="mine-road-site-conditions-title"
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
        </header>

        <section
          aria-label="Road segment conditions"
          data-layer="segment_section_container"
          className="SegmentSectionContainer w-full relative overflow-hidden"
        >
          <div
            data-layer="segment_info_container"
            className="SegmentInfoContainer w-full inline-flex flex-col justify-start items-start gap-[19px]"
          >
            <p
              data-layer="segment_name"
              className="SegmentName self-stretch text-black text-sm font-semibold"
            >
              Road Segment : {segmentName}
            </p>

            <div
              data-layer="road_condition_badge_container"
              className="RoadConditionBadgeContainer w-[190px] h-7 px-[7px] py-[5px] bg-[#ffedb2] rounded-[7px] inline-flex justify-center items-center gap-2.5"
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
                aria-label="Travel time"
                data-layer="travel_time_container"
                className="TravelTimeContainer w-[136px] h-[92px] px-[19px] py-[15px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div
                  data-layer="travel_time_block"
                  className="TravelTimeBlock w-[98px] flex flex-col justify-start items-center gap-[11px]"
                >
                  <p
                    data-layer="travel_time_label"
                    className="TravelTimeLabel self-stretch text-center text-black text-sm font-semibold"
                  >
                    Travel Time
                  </p>
                  <p
                    data-layer="travel_time_value"
                    className="TravelTimeValue self-stretch text-black text-2xl font-semibold text-center flex justify-center items-baseline gap-1"
                  >
                    {travel.num !== null ? (
                      <>
                        <AnimatedNumber
                          value={travel.num}
                          decimals={travel.num % 1 === 0 ? 0 : 1}
                        />
                        {travel.unit && (
                          <span className="text-sm font-semibold">
                            {travel.unit}
                          </span>
                        )}
                      </>
                    ) : (
                      travel.raw
                    )}
                  </p>
                </div>
              </article>

              <article
                aria-label="Friction index"
                data-layer="friction_index_container"
                className="FrictionIndexContainer w-[136px] h-[92px] px-5 py-[15px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-center items-center gap-2.5"
              >
                <div
                  data-layer="friction_index_block"
                  className="FrictionIndexBlock w-[95px] flex flex-col justify-start items-center gap-[11px]"
                >
                  <p
                    data-layer="friction_index_label"
                    className="FrictionIndexLabel self-stretch text-black text-sm font-semibold"
                  >
                    Friction Index
                  </p>
                  <p
                    data-layer="friction_index_value"
                    className="FrictionIndexValue self-stretch text-center text-black text-2xl font-semibold"
                  >
                    {isNumber(activeSegment?.friction_index) ? (
                      <AnimatedNumber
                        value={activeSegment.friction_index}
                        decimals={2}
                      />
                    ) : (
                      frictionIndexRaw
                    )}
                  </p>
                </div>
              </article>

              <article
                aria-label="Water depth"
                data-layer="water_depth_container"
                className="WaterDepthContainer w-[136px] h-[92px] px-6 py-[15px] bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#c1ccdd] inline-flex flex-col justify-start items-start gap-2.5"
              >
                <div
                  data-layer="water_depth_block"
                  className="WaterDepthBlock w-[87px] flex flex-col justify-center items-center gap-[11px]"
                >
                  <p
                    data-layer="water_depth_label"
                    className="WaterDepthLabel self-stretch text-black text-sm font-semibold text-center"
                  >
                    Water Depth
                  </p>
                  <p
                    data-layer="water_depth_value"
                    className="WaterDepthValue self-stretch text-black text-2xl font-semibold text-center flex justify-center items-baseline gap-1"
                  >
                    {waterDepth.num !== null ? (
                      <>
                        <AnimatedNumber
                          value={waterDepth.num}
                          decimals={waterDepth.num % 1 === 0 ? 0 : 2}
                        />
                        {waterDepth.unit && (
                          <span className="text-sm font-semibold">
                            {waterDepth.unit}
                          </span>
                        )}
                      </>
                    ) : (
                      waterDepth.raw
                    )}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <hr
          data-layer="divider_middle"
          className="DividerMiddle self-stretch h-0 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#bdbdbd]"
        />

        <section
          aria-label="Speed and alert information"
          data-layer="speed_section_container"
          className="SpeedSectionContainer w-full flex flex-col justify-start items-start gap-4"
        >
          <h3
            data-layer="speed_section_title"
            className="SpeedSectionTitle self-stretch text-black text-sm font-semibold"
          >
            Speed Information
          </h3>

          <div
            data-layer="speed_limit_container"
            className="SpeedLimitContainer self-stretch inline-flex justify-between items-center"
          >
            <div className="SpeedLimitBlock w-[97px] inline-flex flex-col justify-start items-start gap-[11px]">
              <p className="SpeedLimitLabel text-[#666666] text-xs font-semibold">
                Speed Limit
              </p>
              <p className="SpeedLimitValue text-black text-2xl font-semibold flex items-baseline gap-1">
                {speedLimit.num !== null ? (
                  <>
                    <AnimatedNumber
                      value={speedLimit.num}
                      decimals={speedLimit.num % 1 === 0 ? 0 : 1}
                    />
                    {speedLimit.unit && (
                      <span className="text-sm font-semibold">
                        {speedLimit.unit}
                      </span>
                    )}
                  </>
                ) : (
                  speedLimit.raw
                )}
              </p>
            </div>

            <div className="ActualSpeedBlock w-24 inline-flex flex-col justify-start items-end gap-[11px]">
              <p className="ActualSpeedLabel text-[#666666] text-xs font-semibold text-right">
                Actual Speed
              </p>
              <p className="ActualSpeedValue text-black text-2xl font-semibold text-right flex items-baseline justify-end gap-1">
                {actualSpeed.num !== null ? (
                  <>
                    <AnimatedNumber
                      value={actualSpeed.num}
                      decimals={actualSpeed.num % 1 === 0 ? 0 : 1}
                    />
                    {actualSpeed.unit && (
                      <span className="text-sm font-semibold">
                        {actualSpeed.unit}
                      </span>
                    )}
                  </>
                ) : (
                  actualSpeed.raw
                )}
              </p>
            </div>
          </div>

          <aside
            aria-label="Road condition alert"
            data-layer="alert_section_container"
            className="AlertSectionContainer self-stretch h-[82px] px-6 py-3.5 bg-[#ffedee] rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#ffd4c7] flex flex-col justify-start items-start gap-2.5"
          >
            <div className="AlertTextContainer w-[277px] inline-flex flex-col justify-start items-start gap-1">
              <p className="AlertTitle text-[#8f0b09] text-sm font-semibold">
                {alertTitle}
              </p>
              <p className="AlertDescription text-black text-xs font-semibold">
                {alertDescription}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </section>
  );
}

export default MineRoadSegmentTable;
