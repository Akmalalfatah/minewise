import React, { useEffect, useMemo, useState } from "react";
import { getMineRoadConditions } from "../../services/minePlannerService";
import { useFilterQuery } from "../../hooks/useGlobalFilter";
import AnimatedNumber from "../animation/AnimatedNumber";

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
};

function MineRoadSegmentTable() {
  const { location, timePeriod, shift } = useFilterQuery();
  const [data, setData] = useState(null);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await getMineRoadConditions({ location, timePeriod, shift });
        setData(res);
        setActiveSegmentIndex(0);
      } catch (e) {
        console.error("Road conditions error:", e);
        setData(null);
      }
    }
    load();
  }, [location, timePeriod, shift]);
  const segments = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data.segments)) return data.segments;

    if (data.segment_name || data.road_condition_label) {
      return [data];
    }

    return [];
  }, [data]);

  const active = segments[activeSegmentIndex] || null;

  const travel = parse(active?.travel_time);
  const water = parse(active?.water_depth);
  const speedLimit = parse(active?.speed_limit);
  const actualSpeed = parse(active?.actual_speed);

  const alert = active?.alert ?? {
    title: "No active alert",
    description: "There is no specific road condition alert for this segment.",
  };

  function parse(raw, fallback = "-") {
    if (!raw) return { num: null, unit: "", raw: fallback };
    const m = String(raw).match(/^([\d.,]+)\s*(.*)$/);
    if (!m) return { num: null, unit: "", raw };
    return { num: parseFloat(m[1]), unit: m[2], raw };
  }

  return (
    <section className="bg-white rounded-3xl p-6 flex flex-col gap-4">
      <h2 className="text-sm font-semibold">Mine Road & Site Conditions</h2>

      {segments.length > 1 && (
        <select
          value={activeSegmentIndex}
          onChange={(e) => setActiveSegmentIndex(+e.target.value)}
          className="border px-2 py-1 rounded text-sm w-48"
        >
          {segments.map((s, i) => (
            <option key={i} value={i}>
              {s.segment_name || `Segment ${i + 1}`}
            </option>
          ))}
        </select>
      )}

      {active ? (
        <>
          <span className="bg-yellow-200 px-3 py-1 rounded text-sm font-semibold w-fit">
            {active.road_condition_label}
          </span>

          <div className="flex gap-4">
            <Metric label="Travel Time" value={travel} />
            <Metric
              label="Friction Index"
              value={{
                num: active.friction_index,
                raw: active.friction_index ?? "-",
              }}
            />
            <Metric label="Water Depth" value={water} />
          </div>

          <div className="flex justify-between mt-3">
            <Metric label="Speed Limit" value={speedLimit} />
            <Metric label="Actual Speed" value={actualSpeed} />
          </div>

          <div className="bg-red-100 border border-red-300 rounded p-3 mt-3">
            <p className="font-semibold text-red-700">{alert.title}</p>
            <p className="text-sm">{alert.description}</p>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          No road segment data for current filters.
        </p>
      )}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="border rounded p-3 w-[130px]">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">
        {value.num !== null ? (
          <>
            <AnimatedNumber value={value.num} decimals={1} />
            {value.unit && <span className="text-sm"> {value.unit}</span>}
          </>
        ) : (
          value.raw
        )}
      </p>
    </div>
  );
}

export default MineRoadSegmentTable;
