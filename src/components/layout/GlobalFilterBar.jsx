import React, { useState } from "react";
import { useGlobalFilter } from "../../context/GlobalFilterContext";

function GlobalFilterBar() {
  const [expanded, setExpanded] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showShift, setShowShift] = useState(false);

  const {
    location,
    setLocation,
    timePeriod,
    setTimePeriod,
    shift,
    setShift,
  } = useGlobalFilter();

  return (
    <section
      data-layer="global_filter_bar"
      aria-label="Global filters"
      className="GlobalFilterBar w-[592px] h-[71px] px-[22px] py-[17px] bg-white rounded-[15px] inline-flex justify-start items-center gap-[17px] relative overflow-visible"
    >
      {/* Toggle main filter bar */}
      <button
        type="button"
        data-layer="filter_button_container"
        onClick={() => {
          setExpanded(!expanded);
          setShowLocation(false);
          setShowTime(false);
          setShowShift(false);
        }}
        className="FilterButtonContainer flex justify-start items-center gap-3 cursor-pointer select-none"
      >
        <div className="w-[34px] h-[37px] relative overflow-hidden flex justify-center items-center">
          <img
            className="w-[18px] h-[18px]"
            src="/icons/icon_filter.png"
            alt="Filter icon"
          />
        </div>

        <span className="text-black text-sm font-normal">Filters</span>

        <div
          className={`w-1.5 h-3 border-[1.5px] border-black transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        ></div>
      </button>

      {/* Dropdowns */}
      <div
        className={`absolute left-[160px] top-[18px] flex justify-start items-center gap-3 origin-top transition-all duration-300 
          ${
            expanded
              ? "opacity-100 scale-y-100 translate-y-2"
              : "opacity-0 scale-y-0 -translate-y-3 pointer-events-none"
          }`}
      >
        {/* Location filter */}
        <div className="relative">
          <div className="w-28 h-9 px-[9px] bg-[#F7F7F7] rounded-[10px] flex justify-between items-center">
            <span className="text-black text-xs">{location}</span>
            <button
              type="button"
              onClick={() => {
                setShowLocation(!showLocation);
                setShowTime(false);
                setShowShift(false);
              }}
              className="w-4 h-4 cursor-pointer flex items-center justify-center"
            >
              <img
                className="w-4 h-4"
                src="/icons/icon_expand.png"
                alt="Toggle location filter options"
              />
            </button>
          </div>

          {showLocation && (
            <div className="absolute mt-2 w-40 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-2 z-50 transition-all duration-300">
              {["PIT A", "PIT B", "PIT C", "Port A", "Port B"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer text-left"
                  onClick={() => {
                    setLocation(opt);
                    setShowLocation(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time filter */}
        <div className="relative">
          <div className="w-28 h-9 px-[9px] bg-[#F7F7F7] rounded-[10px] flex justify-between items-center">
            <span className="text-black text-xs">{timePeriod}</span>
            <button
              type="button"
              onClick={() => {
                setShowTime(!showTime);
                setShowLocation(false);
                setShowShift(false);
              }}
              className="w-4 h-4 cursor-pointer flex items-center justify-center"
            >
              <img
                className="w-4 h-4"
                src="/icons/icon_expand.png"
                alt="Toggle time filter options"
              />
            </button>
          </div>

          {showTime && (
            <div className="absolute mt-2 w-40 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-2 z-50 transition-all duration-300">
              {["Today", "Last 24 Hours", "Weekly", "Monthly"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer text-left"
                  onClick={() => {
                    setTimePeriod(opt);
                    setShowTime(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Shift filter */}
        <div className="relative">
          <div className="w-28 h-9 px-[9px] bg-[#F7F7F7] rounded-[10px] flex justify-between items-center">
            <span className="text-black text-xs">{shift}</span>
            <button
              type="button"
              onClick={() => {
                setShowShift(!showShift);
                setShowLocation(false);
                setShowTime(false);
              }}
              className="w-4 h-4 cursor-pointer flex items-center justify-center"
            >
              <img
                className="w-4 h-4"
                src="/icons/icon_expand.png"
                alt="Toggle shift filter options"
              />
            </button>
          </div>

          {showShift && (
            <div className="absolute mt-2 w-40 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-2 z-50 transition-all duration-300">
              {["Shift 1", "Shift 2", "Shift 3"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer text-left"
                  onClick={() => {
                    setShift(opt);
                    setShowShift(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GlobalFilterBar;
