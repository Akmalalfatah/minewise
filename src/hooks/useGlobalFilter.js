import { useGlobalFilter } from "../context/GlobalFilterContext";

export function useFilterQuery() {
  const { location, timePeriod, shift } = useGlobalFilter();

  return {
    location,
    timePeriod,
    shift,
  };
}
