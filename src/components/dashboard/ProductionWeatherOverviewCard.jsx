import React from "react";
import { ChartAreaGradient } from "../ui/ChartAreaGradient";

function ProductionWeatherOverviewCard({ data }) {
  if (!data) return null;

  return (
    <section
      data-layer="production_weather_overview_card"
      aria-label="Production and weather overview"
      className="w-[807px] p-6 bg-white rounded-3xl flex flex-col gap-6"
    >
      <header className="flex items-center gap-3">
        <div className="w-8 h-8 p-[7px] bg-[#1c2534] rounded-2xl flex items-center justify-center">
          <img className="w-[18px] h-[18px]" src="/icons/icon_overview.png" alt="Overview icon" />
        </div>
        <h2 className="text-black text-sm font-semibold">Production & Weather Overview</h2>
      </header>

      <div className="flex gap-6">
        <section className="w-[277px] flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <h3 className="text-black text-xs font-semibold">Data untuk Produksi</h3>
            <div className="h-px bg-black/25" />
          </div>

          <article className="flex flex-col gap-2">
            <span className="text-[#666] text-xs">Total Produksi</span>
            <p className="text-black text-2xl font-semibold">{data.production?.reduce((a, b) => a + b, 0)}<span className="text-black text-2xl font-semibold"> ton</span></p>
          </article>

          <article className="flex flex-col gap-2">
            <span className="text-[#666] text-xs">Target</span>
            <p className="text-black text-2xl font-semibold">{data.target?.[0]}<span className="text-black text-2xl font-semibold"> ton</span></p>
          </article>

          <section className="flex flex-col gap-3">
            <h4 className="text-[#666] text-xs">Anomali (AI flag)</h4>

            <ul className="flex flex-col gap-3">
              <li className="flex gap-2">
                <img className="w-[17px] h-[17px]" src="/icons/icon_importance.png" alt="" />
                <p className="text-black text-xs">{data.ai_flag?.[0]}</p>
              </li>
              <li className="flex gap-2">
                <img className="w-[17px] h-[17px]" src="/icons/icon_importance.png" alt="" />
                <p className="text-black text-xs">{data.ai_flag?.[1]}</p>
              </li>
            </ul>
          </section>
        </section>

        <section className="ChartAreaGradient flex-1">
          <ChartAreaGradient />
        </section>          
        
      </div>
    </section>
  );
}

export default ProductionWeatherOverviewCard;
