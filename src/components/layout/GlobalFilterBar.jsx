import React, { useState } from "react";

// Mock context untuk demo
const GlobalFilterContext = React.createContext();
const useGlobalFilter = () => {
  const [location, setLocation] = useState("PIT A");
  const [timePeriod, setTimePeriod] = useState("Today");
  const [shift, setShift] = useState("Shift 1");

  return {
    location,
    setLocation,
    timePeriod,
    setTimePeriod,
    shift,
    setShift,
  };
};

function GlobalFilterBar() {
  const [expanded, setExpanded] = useState(false);

  const {
    location,
    setLocation,
    timePeriod,
    setTimePeriod,
    shift,
    setShift,
  } = useGlobalFilter();

  return (
    <div
      data-layer="global_filter_bar"
      className={`GlobalFilterBar h-[71px] px-2 py-3.5 bg-white rounded-[50px] inline-flex items-center gap-[18px] overflow-hidden transition-all duration-300
        ${expanded ? "w-[585px]" : "w-[100px]"}`}
    >
      <button
        type="button"
        data-layer="filter_button_container"
        onClick={() => setExpanded(!expanded)}
        className="FilterButtonContainer flex items-center gap-3 shrink-0 focus:outline-none"
      >
        <div data-layer="icon_wrapper" className="IconWrapper size-[57px] bg-[#1c2534] rounded-full flex justify-center items-center shrink-0">
          <img data-layer="icon_filter_filter" className="size-[31px]" src="/icons/icon_filter_filter.png" />
        </div>
        <img
          src="/icons/icon_expand_right.png"
          alt="expand"
          className={`w-2 h-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <div
        data-layer="filter_groups_container"
        className={`FilterGroupsContainer flex items-center gap-3 transition-all duration-300
          ${expanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6 pointer-events-none"}`}
      >
        <div data-layer="filter_item_location" className="w-[145px] h-[57px] bg-[#efefef] rounded-full flex items-center gap-2 px-2">
          <div className="size-13 bg-[#1c2534] flex justify-center items-center rounded-full shrink-0">
            <img className="size-[27px]" src="/icons/icon_location.png" />
          </div>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent outline-none w-full text-black text-base font-normal cursor-pointer"
          >
            <option value="PIT A">PIT A</option>
            <option value="PIT B">PIT B</option>
            <option value="PIT C">PIT C</option>
            <option value="Port A">Port A</option>
            <option value="Port B">Port B</option>
          </select>
        </div>

        <div data-layer="filter_item_time" className="w-[150px] h-[57px] bg-[#efefef] rounded-full flex items-center gap-2 px-2">
          <div className="size-13 bg-[#1c2534] rounded-full flex justify-center items-center shrink-0">
            <img className="size-[31px]" src="/icons/icon_clock.png" />
          </div>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-transparent outline-none w-full text-black text-base font-normal cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="Last 24 Hours">Last 24 Hours</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div data-layer="filter_item_shift" className="w-[150px] h-[57px] bg-[#efefef] rounded-full flex items-center gap-2 px-2">
          <div className="size-13 bg-[#1c2534] rounded-full flex justify-center items-center shrink-0">
            <img className="size-[27px]" src="/icons/icon_shift.png" />
          </div>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="bg-transparent outline-none w-full text-black text-base font-normal cursor-pointer"
          >
            <option value="Shift 1">Shift 1</option>
            <option value="Shift 2">Shift 2</option>
            <option value="Shift 3">Shift 3</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default GlobalFilterBar;