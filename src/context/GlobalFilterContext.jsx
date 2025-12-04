import { createContext, useContext, useState } from "react";

const GlobalFilterContext = createContext();

export function GlobalFilterProvider({ children }) {
    const [location, setLocation] = useState("PIT A");
    const [timePeriod, setTimePeriod] = useState("Weekly");
    const [shift, setShift] = useState("Shift 1");

    const resetFilter = () => {
        setLocation("PIT A");
        setTimePeriod("Weekly");
        setShift("Shift 1");
    };

    const value = {
        location,
        setLocation,
        timePeriod,
        setTimePeriod,
        shift,
        setShift,
        resetFilter
    };

    return (
        <GlobalFilterContext.Provider value={value}>
            {children}
        </GlobalFilterContext.Provider>
    );
}

export function useGlobalFilter() {
    return useContext(GlobalFilterContext);
}
