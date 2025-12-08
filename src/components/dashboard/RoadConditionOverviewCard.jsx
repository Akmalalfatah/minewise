import React from "react";
import RoadSegmentTable from "../ui/TableData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell } from "recharts";

function RoadConditionOverviewCard({ data }) {
  if (!data) return null;

  const mappedSegments = data.segments
    ? data.segments.map((s) => ({
        road: s.road,
        status: s.status,
        speed: s.speed,
        friction: s.friction,
        water: s.water,
      }))
    : [];

  const score = data.route_efficiency_score || 0;

  const surfaceColors = {
    Asphalt: "#464646ff",
    "Coal Road": "#151716",
    Gravel: "#6e5d44ff",
    Laterite: "#CD5C5C",
    Unknown: "#FFFFFF",
  };

  const gaugeData = [
    { name: "score", value: score },
    { name: "remaining", value: 100 - score },
  ];

  const surfaceSummary = data.segments
    ? Object.entries(
        data.segments.reduce((acc, seg) => {
          const key = seg.surface_type || "Unknown";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([label, value]) => ({ label, value }))
    : [];

  return (
    <section
      data-layer="road_condition_overview_card"
      className="w-full p-6 bg-white rounded-3xl flex flex-col gap-6"
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
        <div className="flex flex-col items-center justify-center">
          {/* Bungkus dengan div ukuran fix, ResponsiveContainer pakai 100% */}
          <div className="w-[200px] h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  <Cell fill="#F97316" />
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center -mt-6">
            <div className="text-[42px] font-bold text-[#F97316]">
              {score}
            </div>
            <p className="text-sm font-medium text-[#F97316]">
              Moderate Risk
            </p>
          </div>
        </div>

        <section className="p-4 bg-[#EFEFEF] rounded-[10px] flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-black">AI Memprediksi</h4>
          <p className="text-xs text-black/70">
            friction, water depth, travel time, speed deviation
          </p>

          <h4 className="text-xs font-semibold text-black mt-3">AI Flag</h4>

          <ul className="flex flex-col gap-3">
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
      </div>

      <section>
        <h3 className="text-xs text-black font-semibold mb-2">
          Road Conditions Based on Surface Type
        </h3>

        <div className="w-full h-[220px] rounded-xl border p-4">
          <ResponsiveContainer width="100%" height="100%">
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
                    fill={surfaceColors[entry.label] || "#FFFFFF"}
                    stroke={entry.label === "Laterite" ? "#1C2534" : "none"}
                    strokeWidth={entry.label === "Laterite" ? 1.5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </section>
  );
}

export default RoadConditionOverviewCard;
