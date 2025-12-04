import React, { useEffect, useState } from "react";
import { getRoadConditionOverview } from "../../services/dashboardService";

function RoadConditionOverviewCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const result = await getRoadConditionOverview();
      setData(result);
    }
    load();
  }, []);

  if (!data) return null;

  return (
    <section
      data-layer="road_condition_overview_card"
      aria-label="Road condition overview"
      className="RoadConditionOverviewCard w-[530px] h-[762px] p-6 bg-white rounded-3xl inline-flex flex-col justify-start items-start gap-8"
    >
      <div
        data-layer="card_container"
        className="CardContainer flex flex-col justify-start items-start gap-8"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup w-[216px] inline-flex justify-start items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
          >
            <img
              data-layer="icon_road"
              className="IconRoad size-[18px]"
              src="/icons/icon_road.png"
              alt="Road condition icon"
            />
          </div>
          <h2
            data-layer="road_condition_title"
            className="RoadConditionTitle text-black text-sm font-semibold"
          >
            Road Condition Overview
          </h2>
        </header>

        <main
          data-layer="content_container"
          className="ContentContainer flex flex-col justify-start items-start gap-4"
        >
          {/* Segment Summary */}
          <section
            data-layer="segment_summary_section"
            aria-label="Road segment summary"
            className="SegmentSummarySection w-[473px] flex flex-col justify-start items-start gap-6"
          >
            <h3
              data-layer="segment_summary_title"
              className="SegmentSummaryTitle text-black text-xs font-semibold"
            >
              Road Segment Summary
            </h3>

            <ul>
              {data.segment_summary.map((seg, i) => (
                <li
                  key={i}
                  className="flex justify-between text-xs py-1"
                >
                  <span>{seg.road_id}</span>
                  <span>{seg.status}</span>
                  <span>{seg.speed_kmh} km/h</span>
                  <span>{seg.friction_index}</span>
                  <span>{seg.water_depth_cm} cm</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="Divider w-[470px] h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

          {/* Efficiency + AI */}
          <section
            data-layer="efficiency_and_ai_section"
            aria-label="Route efficiency score and AI analysis"
            className="EfficiencyAndAiSection w-[471px] h-[169px] inline-flex justify-start items-center gap-2.5"
          >
            <section className="RouteEfficiencyScore w-[198px] inline-flex flex-col justify-start items-start gap-[25px]">
              <h3 className="RouteEfficiencyScoreTitle text-black text-xs font-semibold">
                Route Efficiency Score
              </h3>
              <p>{data.route_efficiency_score}</p>
            </section>

            <section className="AiIndicator w-[263px] h-[169px] p-3 bg-[#efefef] rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5">
              <div className="AiInficatorSection w-[238px] flex flex-col justify-start items-start gap-3">
                {/* AI Processing */}
                <article className="AiProcessItem w-[227px] flex flex-col justify-start items-start gap-2">
                  <h4 className="AiProcessItemTitle text-black/60 text-xs">
                    AI Memproses
                  </h4>
                  <p className="AiProcessItemInput text-black text-xs">
                    {data.ai_process.analysed_parameters.join(", ")}
                  </p>
                </article>

                <div className="Divider w-full h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

                {/* AI Flags */}
                <section className="AnomalyAiSection flex flex-col justify-start items-start gap-2">
                  <h4 className="AnomalyAiSectionTitle text-black/60 text-xs">
                    AI Flag
                  </h4>

                  <ul className="AnomalyAiHeader flex flex-col justify-start items-start gap-2">
                    {data.ai_flags.map((flag, i) => (
                      <li
                        key={i}
                        className="AnomalyAiItem inline-flex justify-start items-center gap-2"
                      >
                        <img
                          className="IconImportance size-[17px]"
                          src="/icons/icon_importance.png"
                          alt="AI flag indicator"
                        />
                        <span className="AnomalyAiInput text-black text-xs">
                          {flag.message}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </section>
          </section>

          <div className="Divider w-[470px] h-0 outline outline-[0.50px] outline-[#bdbdbd]" />

          {/* Surface Type Section */}
          <section
            data-layer="road_condition_surface_type"
            aria-label="Road conditions based on surface type"
            className="RoadConditionSurfaceType flex flex-col justify-start items-start gap-[13px]"
          >
            <h3 className="SurfaceTypeTitle text-black text-xs font-semibold">
              Road Conditions Based on Surface Type
            </h3>

            {/* Placeholder sebagai pengganti <ChartTooltip /> */}
            <div className="SurfaceTypeGraphs w-[473px] h-[200px] rounded-xl bg-[#f2f2f2] flex items-center justify-center text-[11px] text-[#666666]">
              (Chart will be added here)
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}

export default RoadConditionOverviewCard;
