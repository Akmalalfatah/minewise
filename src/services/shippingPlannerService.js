const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function fetchShippingPlanner(path, filters = {}) {
  const query = buildQuery(filters);

  const res = await fetch(`${API_BASE_URL}/shipping-planner/${path}${query}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch ${path}: ${res.status} ${res.statusText} – ${text
        .slice(0, 120)
        .replace(/\s+/g, " ")}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Expected JSON from ${path}, got content-type="${contentType}" and body="${text
        .slice(0, 120)
        .replace(/\s+/g, " ")}"`
    );
  }

  return await res.json();
}

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return fallback;
};

const formatTon = (v) => {
  if (v === undefined || v === null || v === "") return "-";
  if (typeof v === "number" && Number.isFinite(v)) {
    return `${v.toLocaleString("en-US")} ton`;
  }
  return String(v);
};

function normalizeVessel(item = {}, idx = 0) {
  const name = pick(item, ["name", "vessel_name", "vesselName"], `Vessel ${idx + 1}`);
  const destination = pick(item, ["destination"], "-");
  const status = pick(item, ["status"], "-");
  const eta = pick(item, ["eta"], "-");
  const etd = pick(item, ["etd"], "-");

  const plannedLoad = formatTon(
    pick(item, ["plannedLoad", "planned_load", "planned_load_ton", "planned_load_tonnage"], "-")
  );

  const loaded = formatTon(
    pick(item, ["loaded", "tonnage_loaded", "loaded_ton", "loaded_tonnage"], "-")
  );

  return {
    id: pick(item, ["id", "vessel_id", "vesselId"], `${name}-${idx}`),
    name,
    destination,
    status,
    eta,
    etd,
    plannedLoad,
    loaded,
  };
}

function normalizeStockpile(item = {}, idx = 0) {
  const name = pick(item, ["name", "stockpile", "stockpile_name"], `Stockpile ${idx + 1}`);
  const volume = formatTon(pick(item, ["volume", "tonnage", "stock"], "-"));

  const cv = pick(item, ["cv", "grade"], "-");

  const moisture = pick(item, ["moisture"], "-");
  const status = pick(item, ["status"], "-");
  const eta = pick(item, ["eta"], "-");
  const etd = pick(item, ["etd"], "-");

  return {
    id: pick(item, ["id", "stockpile_id"], `${name}-${idx}`),
    name,
    volume,
    cv,
    moisture,
    status,
    eta,
    etd,
  };
}

function normalizeShipment(item = {}, idx = 0) {
  const name = pick(item, ["name", "vessel_name", "vesselName"], `Shipment ${idx + 1}`);
  const status = pick(item, ["status"], "-");
  const eta = pick(item, ["eta"], "-");
  const etd = pick(item, ["etd"], "-");

  const progress = pick(item, ["progress"], 0);
  const loaded = pick(item, ["loaded", "tonnage_loaded"], 0);

  return {
    id: pick(item, ["id", "shipment_id"], `${name}-${idx}`),
    name,
    progress,
    loaded,
    status,
    eta,
    etd,
  };
}

export function getPortWeatherConditions(filters = {}) {
  return fetchShippingPlanner("port-weather", filters);
}

export function getAIShippingRecommendation(filters = {}) {
  return fetchShippingPlanner("ai-recommendation", filters);
}

export async function getVesselSchedule(filters = {}) {
  const raw = await fetchShippingPlanner("vessel-schedules", filters);

  const list = Array.isArray(raw) ? raw : raw?.vessel_schedules || raw?.vessels || [];
  const vessels = (Array.isArray(list) ? list : []).map(normalizeVessel);

  return { vessels };
}

export async function getCoalVolumeReady(filters = {}) {
  const raw = await fetchShippingPlanner("coal-volume", filters);

  const list = Array.isArray(raw) ? raw : raw?.coal_volume_ready || raw?.stockpiles || [];
  const stockpiles = (Array.isArray(list) ? list : []).map(normalizeStockpile);

  return { stockpiles };
}

export async function getLoadingProgress(filters = {}) {
  const raw = await fetchShippingPlanner("loading-progress", filters);

  const list = Array.isArray(raw) ? raw : raw?.loading_progress || raw?.shipments || [];
  const shipments = (Array.isArray(list) ? list : []).map(normalizeShipment);

  return { shipments };
}

export function getPortCongestionStatus(filters = {}) {
  return fetchShippingPlanner("port-congestion", filters);
}
