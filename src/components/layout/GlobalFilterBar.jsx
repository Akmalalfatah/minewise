import React, { useState } from "react";
import { useGlobalFilter } from "../../context/GlobalFilterContext";

function GlobalFilterBar() {
  const [expanded, setExpanded] = useState(false);
  const { location, setLocation, resetFilter } = useGlobalFilter();

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleReset = () => {
    resetFilter();
  };

  return (
    <section
      data-layer="global_filter_bar"
      aria-label="Global filters"
      className={`GlobalFilterBar h-[71px] px-2 py-3.5 bg-white rounded-[50px] inline-flex items-center gap-[18px] overflow-hidden transition-all duration-300
        ${expanded ? "w-[325px]" : "w-[100px]"}`}
      role="group"
    >
      <button
        type="button"
        data-layer="filter_button_container"
        onClick={handleToggle}
        className="FilterButtonContainer flex items-center gap-3 shrink-0 focus:outline-none"
        title="Toggle global filter"
        onContextMenu={(e) => {
          e.preventDefault();
          handleReset();
        }}
        aria-expanded={expanded}
        aria-controls="global-filter-form"
      >
        <div
          data-layer="icon_wrapper"
          className="IconWrapper size-[57px] bg-[#1c2534] rounded-full flex justify-center items-center shrink-0"
        >
          <img
            data-layer="icon_filter_filter"
            className="size-[31px]"
            src="/icons/icon_filter_filter.png"
            alt="Open global filters"
          />
        </div>
        <img
          src="/icons/icon_expand_right.png"
          alt=""
          aria-hidden="true"
          className={`w-2 h-3 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <form
        id="global-filter-form"
        aria-label="Global location filter"
        onSubmit={(e) => e.preventDefault()}
        className={`FilterGroupsContainer flex items-center gap-3 transition-all duration-300
          ${
            expanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-6 pointer-events-none"
          }`}
      >
        <fieldset
          data-layer="filter_item_location"
          className="w-[205px] h-[57px] bg-[#efefef] rounded-full flex items-center gap-2 px-2 border-0 m-0 p-0"
        >
          <legend className="sr-only">Filter by location</legend>

          <label
            htmlFor="global-location-select"
            className="flex items-center gap-2 w-full"
          >
            <span className="size-13 bg-[#1c2534] flex justify-center items-center rounded-full shrink-0">
              <img
                className="size-[27px]"
                src="/icons/icon_location.png"
                alt=""
                aria-hidden="true"
              />
            </span>

            <select
              id="global-location-select"
              value={location}
              onChange={handleLocationChange}
              className="bg-transparent outline-none w-full text-black text-base font-normal cursor-pointer"
            >
              <option value="PIT A">PIT A</option>
              <option value="PIT B">PIT B</option>
              <option value="PIT C">PIT C</option>
              <option value="Port A">Port A</option>
              <option value="Port B">Port B</option>
            </select>
          </label>
        </fieldset>
      </form>
    </section>
  );
}

export default GlobalFilterBar;
