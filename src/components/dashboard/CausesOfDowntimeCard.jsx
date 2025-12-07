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
      className="CausesOfDowntimeCard w-full h-full p-6 bg-white rounded-3xl flex flex-col gap-6"
    >
      <div
        data-layer="card_container"
        className="CardContainer self-stretch flex flex-col gap-6"
      >
        {/* Header */}
        <header
          data-layer="header_left_group"
          className="HeaderLeftGroup inline-flex items-center gap-3"
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
          className="ContentContainer self-stretch flex flex-col lg:flex-row gap-6 items-stretch"
        >
          {/* Stats & top cause section */}
          <section
            data-layer="stats_section"
            aria-label="Downtime statistics and top cause"
            className="StatsSection w-full lg:w-1/3 flex flex-col gap-4"
          >
            {/* High-level stats */}
            <section
              data-layer="stats_group"
              aria-label="Total downtime and lost output"
              className="StatsGroup flex flex-col gap-4"
            >
              <article
                data-layer="total_downtime_week_row"
                className="TotalDowntimeWeekRow flex flex-col gap-2"
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
                className="LostOutputItemRow flex flex-col gap-2"
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
              className="Divider self-stretch h-px bg-[#bdbdbd]"
            />

            {/* Top cause detailed */}
            <section
              data-layer="cause_detailed_row"
              aria-label="Top downtime cause details"
              className="CauseDetailedRow flex flex-col gap-[9px]"
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
                className="CauseDetailedHeader flex flex-col gap-2"
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

          {/* Divider to chart (desktop only) */}
          <div className="hidden lg:block w-px bg-[#bdbdbd]" />

          {/* Pie chart section */}
          <section
            aria-label="Downtime causes distribution"
            className="PieChart flex-1 min-h-[220px] lg:min-h-[260px]"
          >
            <ChartPieInteractive />
          </section>
        </div>
      </div>
    </section>
  );
}

export default CausesOfDowntimeCard;
