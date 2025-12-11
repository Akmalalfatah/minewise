import React from "react";
import RoadSegmentTable from "../ui/TableData";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import AnimatedNumber from "../animation/AnimatedNumber";
import KpiCardWrapper from "../animation/KpiCardWrapper";

function RoadConditionOverviewCard({ data }) {
  if (!data) return null;

  const mappedSegments = Array.isArray(data.segments)
    ? data.segments.map((s) => ({
        road: s.road,
        status: s.status,
        speed: s.speed,
        friction: s.friction,
        water: s.water,
      }))
    : [];

  const score = data.route_efficiency_score ?? 0;

  function getRiskConfig(value) {
    if (value >= 80) {
      return {
        label: "Low Risk",
        color: "#22C55E",
      };
    }
    if (value >= 50) {
      return {
        label: "Moderate Risk",
        color: "#F97316",
      };
    }
    return {
      label: "High Risk",
      color: "#EF4444",
    };
  }

  const { label: riskLabel, color: riskColor } = getRiskConfig(score);

  const surfaceColors = {
    Asphalt: "#464646ff",
    "Coal Road": "#151716",
    Gravel: "#6e5d44ff",
    Laterite: "#CD5C5C",
    Unknown: "#CBD5E1",
  };

  const surfaceSummary = Array.isArray(data.segments)
    ? Object.entries(
        data.segments.reduce((acc, seg) => {
          const key = seg.surface_type || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([label, value]) => ({ label, value }))
    : [];

  const aiFlags = Array.isArray(data.ai_flag)
    ? data.ai_flag
    : data.ai_flag
    ? [data.ai_flag]
    : [];

  return (
    <KpiCardWrapper className="w-full p-6 bg-white rounded-3xl flex flex-col gap-6">
      <section
        data-layer="road_condition_overview_card"
        className="w-full flex flex-col gap-6"
      >
        <header className="flex items-center gap-3">
          <div className="size-8 p-1.5 bg-[#1c2534] rounded-2xl flex justify-center items-center">
            <img
              src="/icons/icon_road.png"
              alt="Road icon"
              className="size-[18px]"
            />
          </div>
          <h2 className="text-black text-sm font-semibold">
            Road Condition Overview
          </h2>
        </header>

        <section>
          <h3 className="text-xs text-black font-semibold mb-2">
            Road Segment Summary
          </h3>
          <RoadSegmentTable data={mappedSegments} />
        </section>

        <h3 className="text-xs text-black font-semibold">
          Route Efficiency Score
        </h3>

        <div className="grid grid-cols-2">
          <div className="flex items-center">
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              <CircularProgressbar
                value={score}
                maxValue={100}
                styles={buildStyles({
                  pathColor: riskColor,
                  trailColor: "#E5E7EB",
                  strokeLinecap: "round",
                })}
              />

              <div className="absolute flex flex-col items-center justify-center">
                <div
                  className="text-[42px] font-bold"
                  style={{ color: riskColor }}
                >
                  <AnimatedNumber value={score} decimals={0} />
                </div>
                <p
                  className="text-sm font-medium"
                  style={{ color: riskColor }}
                >
                  {riskLabel}
                </p>
              </div>
            </div>
          </div>

          <section className="flex-1 p-4 bg-[#EFEFEF] rounded-[10px] flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-black">
              AI Memprediksi
            </h4>
            <p className="text-xs text-black/70">
              friction, water depth, travel time, speed deviation
            </p>

            <h4 className="text-xs font-semibold text-black mt-3">AI Flag</h4>

            {aiFlags.length === 0 ? (
              <p className="text-xs text-black/60">
                No specific alerts for this route.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {aiFlags.map((text, idx) => (
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
            )}
          </section>
        </div>

        <section>
          <h3 className="text-xs text-black font-semibold mb-2">
            Road Conditions Based on Surface Type
          </h3>

          {surfaceSummary.length === 0 ? (
            <div className="w-full h-[220px] rounded-xl border p-4 flex items-center justify-center text-xs text-black/60">
              No surface type data available for current location.
            </div>
          ) : (
            <div className="w-full h-[220px] rounded-xl border p-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={surfaceSummary}
                  layout="vertical"
                  margin={{ left: 35, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} hide />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    width={80}
                  />
                  <Bar dataKey="value" barSize={20} radius={[4, 4, 4, 4]}>
                    {surfaceSummary.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={surfaceColors[entry.label] || "#CBD5E1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </section>
    </KpiCardWrapper>
  );
}

export default RoadConditionOverviewCard;
