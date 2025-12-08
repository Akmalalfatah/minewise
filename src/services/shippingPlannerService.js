import apiClient from "./apiClient";

export async function getPortWeatherConditions(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/port-weather", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data;
}

export async function getAIShippingRecommendation(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/ai-recommendation", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data;
}

export async function getVesselSchedule(params = {}) {
  const res = await apiClient.get("/shipping-planner/vessel-schedules", {
    params,
  });

  const raw = Array.isArray(res.data) ? res.data : [];

  const vessels = raw.map((v, index) => ({
    id: v.id || index,
    name: v.vessel_name || v.name || "-",
    destination: v.destination || "-",
    plannedLoad: v.plannedLoad || v.planned_load || "-",
    loaded: v.loaded ?? null,
    status: v.status || "-",
    eta: v.eta || "-",
    etd: v.etd || "-",
  }));

  return { vessels };
}

export async function getCoalVolumeReady(params = {}) {
  const res = await apiClient.get("/shipping-planner/coal-volume", {
    params,
  });

  const raw = Array.isArray(res.data) ? res.data : [];

  const stockpiles = raw.map((sp, index) => ({
    id: sp.id || index,
    name: sp.stockpile || sp.name || "-",
    volume:
      sp.volume !== undefined && sp.volume !== null
        ? `${sp.volume} ton`
        : "-",
    cv: sp.grade || sp.cv || "-",
    moisture: sp.moisture || "-",
    status: sp.status || "On Standby",
    eta: sp.eta || "-",
    etd: sp.etd || "-",
  }));

  return { stockpiles };
}

export async function getLoadingProgress(params = {}) {
  const res = await apiClient.get("/shipping-planner/loading-progress", {
    params,
  });

  const raw = Array.isArray(res.data) ? res.data : [];

  const shipments = raw.map((s, index) => {
    const progressValue = s.progress ?? 0;
    const loadedValue =
      s.tonnage_loaded ?? s.loaded ?? (s.tonnage_target ?? null);

    let status = s.status;
    if (!status) {
      if (progressValue >= 100) status = "Completed";
      else if (progressValue > 0) status = "Loading";
      else status = "Not started";
    }

    return {
      id: s.id || index,
      name: s.vessel_name || s.name || "-",
      progress: `${progressValue}%`,
      loaded:
        typeof loadedValue === "number"
          ? `${loadedValue} ton`
          : loadedValue || "-",
      status,
      eta: s.eta || "-",
      etd: s.etd || "-",
    };
  });

  return { shipments };
}

export async function getPortCongestionStatus(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/shipping-planner/port-congestion", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data;
}
