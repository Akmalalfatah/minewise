import React from "react";
import { ChartPieInteractive } from "../ui/ChartPieInteractive";

function CausesOfDowntimeCard({ data }) {
  const mapped = data
    ? Object.entries(data.top_causes).map(([key, value]) => ({
      name: key.replace("_", " "),
      value,
    }))
    : [];

  if (!data) return null;

  const top = Object.entries(data.top_causes || {})[0] || [];

  return (
    <section
      data-layer="causes_of_downtime_card"
      aria-label="Causes of downtime"
      className="CausesOfDowntimeCard w-full h-full p-6 bg-white rounded-3xl flex gap-6"
    >
      <section className="StatsSection w-full lg:w-1/3 flex flex-col gap-4">
        <header className="HeaderLeftGroup inline-flex items-center gap-2">
          <div className="IconWrapper size-8 p-[7px] bg-[#1c2534] rounded-2xl flex justify-center items-center">
            <img className="IconWarning size-[18px]" src="/icons/icon_warning.png" alt="" />
          </div>
          <h2 className="text-black text-sm font-semibold">Causes of Downtime</h2>
        </header>

        <section className="flex flex-col gap-4">
          <article className="flex flex-col gap-2">
            <span className="text-black/60 text-xs">Total Downtime</span>
            <p className="text-black text-2xl font-semibold">{data.total_downtime_hours} jam</p>
          </article>

          <article className="flex flex-col gap-2">
            <span className="text-black/60 text-xs">Lost Output</span>
            <p className="text-black text-2xl font-semibold">{data.lost_output_ton} ton</p>
          </article>
        </section>

        <div className="Divider h-px bg-[#bdbdbd]" />

        <section className="flex flex-col gap-[9px]">
          <h3 className="text-black text-xs font-semibold">Top Cause Detailed</h3>
          <p className="text-black text-2xl font-semibold">{top[0]}</p>
          <ul className="flex flex-col gap-2">
            <li className="flex gap-2">
              <img className="w-[17px] h-[17px]" src="/icons/icon_importance.png" alt="" />
              <p className="text-black text-xs">{data.ai_breakdown?.[0]}</p>
            </li>
            <li className="flex gap-2">
              <img className="w-[17px] h-[17px]" src="/icons/icon_importance.png" alt="" />
              <p className="text-black text-xs">{data.ai_breakdown?.[1]}</p>
            </li>
          </ul>
        </section>
      </section>

      <section className="PieChart flex-1">
        <ChartPieInteractive data={mapped} />
      </section>
    </section>
  );

}

export default CausesOfDowntimeCard;
