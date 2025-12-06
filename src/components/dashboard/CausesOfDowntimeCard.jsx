import React, { useEffect, useState } from "react";
import { getCausesOfDowntime } from "../../services/dashboardService";
import { ChartPieInteractive } from "../ui/ChartPieInteractive";
import { useFilterQuery } from "../../hooks/useGlobalFilter";

function CausesOfDowntimeCard() {
  const [data, setData] = useState(null);
  const filters = useFilterQuery();

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const result = await getCausesOfDowntime(filters);

        const normalized = {
          total_downtime_hours: result?.total_downtime_hours ?? 0,
          lost_output_ton: result?.lost_output_ton ?? 0,
          cause_details: Array.isArray(result?.cause_details)
            ? result.cause_details
            : [],
        };

        if (isMounted) {
          setData(normalized);
        }
      } catch (err) {
        console.error("Failed to load causes of downtime:", err);
        if (isMounted) {
          setData({
            total_downtime_hours: 0,
            lost_output_ton: 0,
            cause_details: [],
          });
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [filters.location, filters.time, filters.shift]);

  if (!data) return null;

  const topCause = data.cause_details[0] || null;

  return (
    <section
      data-layer="causes_of_downtime_card"
      aria-label="Causes of downtime"
      className="CausesOfDowntimeCard w-[807px] p-6 bg-white rounded-3xl inline-flex flex-col justify-center items-start gap-2.5"
    >
      <div
        data-layer="card_container"
        className="CardContainer self-stretch flex flex-col justify-center items-start gap-6"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup w-[270.41px] h-[32.09px] inline-flex justify-start items-center gap-3"
        >
          <div
            data-layer="icon_wrapper"
            className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center"
          >
            <img
              data-layer="icon_warning"
              className="IconWarning size-[18px]"
              src="/icons/icon_downtime.png"
              alt="Downtime warning icon"
            />
          </div>
          <h2
            data-layer="causes_downtime_title"
            className="CausesDowntimeTitle text-black text-sm font-semibold"
          >
            Causes of Downtime
          </h2>
        </header>

        {/* Content */}
        <div
          data-layer="content_container"
          className="ContentContainer self-stretch h-[261px] relative"
        >
          {/* Stats & top cause section */}
          <section
            data-layer="stats_section"
            aria-label="Downtime statistics and top cause"
            className="StatsSection w-[249px] absolute left-0 top-0 inline-flex flex-col justify-start items-start gap-3"
          >
            {/* High-level stats */}
            <section
              data-layer="stats_group"
              aria-label="Total downtime and lost output"
              className="StatsGroup w-[151px] flex flex-col justify-start items-start gap-[11px]"
            >
              <article
                data-layer="total_downtime_week_row"
                className="TotalDowntimeWeekRow self-stretch flex flex-col justify-start items-start gap-2"
              >
                <span
                  data-layer="total_downtime_week_title"
                  className="TotalDowntimeWeekTitle text-black/60 text-xs"
                >
                  Total Downtime
                </span>
                <p
                  data-layer="total_downtime_week_input"
                  className="TotalDowntimeWeekInput text-black text-2xl font-semibold"
                >
                  {data.total_downtime_hours} jam
                </p>
              </article>

              <article
                data-layer="lost_output_item_row"
                className="LostOutputItemRow self-stretch flex flex-col justify-start items-start gap-2"
              >
                <span
                  data-layer="lost_output_item_title"
                  className="LostOutputItemTitle text-black/60 text-xs"
                >
                  Lost Output
                </span>
                <p
                  data-layer="lost_output_item_input"
                  className="LostOutputItemInput text-black text-2xl font-semibold"
                >
                  {data.lost_output_ton} ton
                </p>
              </article>
            </section>

            <div
              data-layer="divider"
              className="Divider self-stretch h-0 outline outline-[0.50px] outline-[#bdbdbd]"
            />

            {/* Top cause detailed */}
            <section
              data-layer="cause_detailed_row"
              aria-label="Top downtime cause details"
              className="CauseDetailedRow w-[223px] flex flex-col justify-start items-start gap-[9px]"
            >
              <h3
                data-layer="cause_detailed_title"
                className="CauseDetailedTitle text-black text-xs font-semibold"
              >
                Top Cause Detailed
              </h3>

              <p
                data-layer="cause_detailed_input"
                className="CauseDetailedInput text-black text-2xl font-normal"
              >
                {topCause?.category || "-"}
              </p>

              <div
                data-layer="cause_detailed_header"
                className="CauseDetailedHeader flex flex-col justify-start items-start gap-2"
              >
                <p
                  data-layer="cause_detailed_group_1"
                  className="CauseDetailedGroup1 text-black/60 text-xs"
                >
                  {topCause?.ai_reason || "No AI analysis available."}
                </p>
              </div>
            </section>
          </section>

          {/* Vertical divider to chart */}
          <div
            data-layer="divider"
            className="Divider w-[315px] h-0 left-[273px] top-[-54px] absolute origin-top-left rotate-90 outline outline-[0.50px] outline-[#bdbdbd]"
          />

          {/* Pie chart section */}
          <section
            aria-label="Downtime causes distribution"
            className="PieChart w-[462px] h-[318px] absolute left-[330px] top-[-30px]"
          >
            <ChartPieInteractive />
          </section>
        </div>
      </div>
    </section>
  );
}

export default CausesOfDowntimeCard;
