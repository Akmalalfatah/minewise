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
        setShift
    } = useGlobalFilter();

    return (
        <div
            data-layer="global_filter_bar"
            className="GlobalFilterBar w-[592px] h-[71px] px-[22px] py-[17px] bg-white rounded-[15px] inline-flex justify-start items-center gap-[17px] relative overflow-visible"
        >
            <div
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
                    <img className="w-[18px] h-[18px]" src="/icons/icon_filter.png" />
                </div>

                <div className="text-black text-sm font-normal">
                    Filters
                </div>

                <div
                    className={`w-1.5 h-3 border-[1.5px] border-black transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                ></div>
            </div>

            <div
                className={`absolute left-[160px] top-[18px] flex justify-start items-center gap-3 origin-top transition-all duration-300 
                ${expanded
                        ? "opacity-100 scale-y-100 translate-y-2"
                        : "opacity-0 scale-y-0 -translate-y-3 pointer-events-none"
                    }`}
            >
                <div className="relative">
                    <div className="w-28 h-9 px-[9px] bg-[#F7F7F7] rounded-[10px] flex justify-between items-center">
                        <div className="text-black text-xs">{location}</div>
                        <img
                            onClick={() => {
                                setShowLocation(!showLocation);
                                setShowTime(false);
                                setShowShift(false);
                            }}
                            className="w-4 h-4 cursor-pointer"
                            src="/icons/icon_expand.png"
                        />
                    </div>

                    {showLocation && (
                        <div className="absolute mt-2 w-40 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-2 z-50 transition-all duration-300">
                            {["PIT A", "PIT B", "PIT C", "Port A", "Port B"].map((opt) => (
                                <div
                                    key={opt}
                                    className="text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setLocation(opt);
                                        setShowLocation(false);
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div className="w-28 h-9 px-[9px] bg-[#F7F7F7] rounded-[10px] flex justify-between items-center">
                        <div className="text-black text-xs">{timePeriod}</div>
                        <img
                            onClick={() => {
                                setShowTime(!showTime);
                                setShowLocation(false);
                                setShowShift(false);
                            }}
                            className="w-4 h-4 cursor-pointer"
                            src="/icons/icon_expand.png"
                        />
                    </div>

                    {showTime && (
                        <div className="absolute mt-2 w-40 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-2 z-50 transition-all duration-300">
                            {["Today", "Last 24 Hours", "Weekly", "Monthly"].map((opt) => (
                                <div
                                    key={opt}
                                    className="text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setTimePeriod(opt);
                                        setShowTime(false);
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div className="w-28 h-9 px-[9px] bg-[#F7F7F7] rounded-[10px] flex justify-between items-center">
                        <div className="text-black text-xs">{shift}</div>
                        <img
                            onClick={() => {
                                setShowShift(!showShift);
                                setShowLocation(false);
                                setShowTime(false);
                            }}
                            className="w-4 h-4 cursor-pointer"
                            src="/icons/icon_expand.png"
                        />
                    </div>

                    {showShift && (
                        <div className="absolute mt-2 w-40 bg-white shadow-xl rounded-xl p-3 flex flex-col gap-2 z-50 transition-all duration-300">
                            {["Shift 1", "Shift 2", "Shift 3"].map((opt) => (
                                <div
                                    key={opt}
                                    className="text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                                    onClick={() => {
                                        setShift(opt);
                                        setShowShift(false);
                                    }}
                                >
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GlobalFilterBar;
