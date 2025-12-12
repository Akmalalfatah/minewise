import React, { useState, useEffect, useMemo } from "react";
import { useGlobalFilter } from "../../context/GlobalFilterContext";

function GlobalFilterBar({ locationType = "all" }) {
  const [expanded, setExpanded] = useState(false);
  const { location, setLocation, resetFilter } = useGlobalFilter();

  const locationOptions = useMemo(() => {
    if (locationType === "pit") return ["PIT A", "PIT B"];
    if (locationType === "port") return ["PORT"];

    return ["PIT A", "PIT B", "PORT", "ROAD_01", "STOCKPILE"];
  }, [locationType]);

  useEffect(() => {
    if (!locationOptions.includes(location)) {
      setLocation(locationOptions[0]);
    }
  }, [location, locationOptions, setLocation]);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleIconClick = (e) => {
    if (e.shiftKey) {
      resetFilter();
    } else {
      handleToggle();
    }
  };

  return (
    <header
      data-layer="global_filter_header"
      aria-label="Global Filters"
      className="inline-flex items-center"
    >
      <div
        data-layer="global_filter_bar"
        className={`GlobalFilterBar h-[71px] px-2 py-3.5 bg-white rounded-[50px]
        inline-flex items-center gap-[18px] overflow-hidden transition-all duration-300
        ${expanded ? "w-[310px]" : "w-[100px]"}`}
      >
        <button
          type="button"
          aria-expanded={expanded}
          aria-label={expanded ? "Hide Filters" : "Show Filters"}
          onClick={handleIconClick}
          className="FilterButtonContainer flex items-center gap-3 shrink-0 focus:outline-none"
        >
          <div className="IconWrapper size-[57px] bg-[#1c2534] rounded-full flex justify-center items-center shrink-0">
            <img
              src="/icons/icon_filter_filter.png"
              alt="Filter Icon"
              className="size-[31px]"
            />
          </div>

          <img
            src="/icons/icon_expand_right.png"
            className={`w-2 h-3 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
            alt=""
            aria-hidden="true"
          />
        </button>

        <section
          aria-label="Location Filter"
          className={`FilterGroupsContainer flex items-center gap-3 transition-all duration-300
          ${
            expanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-6 pointer-events-none"
          }`}
        >
          <div
            data-layer="filter_item_location"
            className="w-[200px] h-[57px] bg-[#efefef] rounded-full flex items-center gap-2 px-2"
          >
            <div className="size-13 bg-[#1c2534] flex justify-center items-center rounded-full shrink-0">
              <img
                src="/icons/icon_location.png"
                className="size-[27px]"
                alt="Location Icon"
              />
            </div>

            <label htmlFor="global-filter-location" className="sr-only">
              Select Location
            </label>

            <select
              id="global-filter-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent outline-none w-full text-black text-base font-normal cursor-pointer"
            >
              {locationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
    </header>
  );
}

export default GlobalFilterBar;
