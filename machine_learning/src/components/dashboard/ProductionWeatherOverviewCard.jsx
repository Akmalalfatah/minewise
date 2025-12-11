import React from "react";
import { ChartAreaGradient } from "../ui/ChartAreaGradient";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";

function ProductionWeatherOverviewCard({ data }) {
  if (!data) return null;

  const productionArr = Array.isArray(data.production) ? data.production : [];
  const targetArr = Array.isArray(data.target) ? data.target : [];

  const mapped = productionArr.map((p, i) => ({
    label: `Shift ${i + 1}`,
    production: p,
    target: targetArr[i] ?? 0,
  }));

  const totalProduction = productionArr.reduce(
    (acc, val) => acc + (Number(val) || 0),
    0
  );

  const firstTarget = Number(targetArr[0]) || 0;

  return (
    <KpiCardWrapper className="ProductionWeatherOverviewCard w-[807px] p-6 bg-white rounded-3xl flex gap-6">
      <section
        data-layer="production_weather_overview_card"
        aria-label="Production and weather overview"
        className="w-full flex gap-6"
      >
        {/* LEFT PANEL */}
        <section className="w-[277px] flex flex-col gap-4">
          <header className="flex items-center gap-3">
            <div className="w-8 h-8 p-[7px] bg-[#1c2534] rounded-2xl flex items-center justify-center">
              <img
                className="w-[18px] h-[18px]"
                src="/icons/icon_overview.png"
                alt="Overview icon"
              />
            </div>
            <h2 className="text-black text-sm font-semibold">
              Production & Weather Overview
            </h2>
          </header>

          <div className="flex flex-col gap-3">
            <h3 className="text-black text-xs font-semibold">
              Data untuk Produksi
            </h3>
            <div className="h-px bg-black/25" />
          </div>

          {/* Total Produksi (animated) */}
          <article className="flex flex-col">
            <span className="text-[#666] text-xs">Total Produksi</span>
            <p className="text-black text-2xl font-semibold">
              <AnimatedNumber value={totalProduction} decimals={0} />{" "}
              <span className="text-black text-2xl font-semibold">ton</span>
            </p>
          </article>

          {/* Target (animated) */}
          <article className="flex flex-col">
            <span className="text-[#666] text-xs">Target</span>
            <p className="text-black text-2xl font-semibold">
              <AnimatedNumber value={firstTarget} decimals={0} />{" "}
              <span className="text-black text-2xl font-semibold">ton</span>
            </p>
          </article>

          <section className="flex flex-col gap-2">
            <h4 className="text-[#666] text-xs">Anomali (AI flag)</h4>

            <ul className="flex flex-col gap-2">
              {data.ai_flag?.map((text, idx) => (
                <li className="flex gap-2" key={idx}>
                  <img
                    className="w-[17px] h-[17px]"
                    src="/icons/icon_importance.png"
                    alt=""
                  />
                  <p className="text-black text-xs">{text}</p>
                </li>
              ))}
            </ul>
          </section>
        </section>

        {/* RIGHT CHART AREA */}
        <section className="ChartAreaGradient flex-1">
          <ChartAreaGradient data={mapped} />
        </section>
      </section>
    </KpiCardWrapper>
  );
}

export default ProductionWeatherOverviewCard;
