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

async function fetchMinePlanner(path, filters = {}) {
  const query = buildQuery(filters);

  const res = await fetch(`${API_BASE_URL}/mine-planner/${path}${query}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch ${path}: ${res.status} ${res.statusText} – ${text.slice(
        0,
        120
      )}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Expected JSON from ${path}, but got content-type="${contentType}" and body="${text
        .slice(0, 120)
        .replace(/\s+/g, " ")}"`
    );
  }

  const payload = await res.json();
  return payload;
}

export function getEnvironmentConditions(filters = {}) {
  return fetchMinePlanner("environment-conditions", filters);
}

export function getAIMineRecommendation(filters = {}) {
  return fetchMinePlanner("ai-mine-recommendation", filters);
}

export function getMineRoadConditions(filters = {}) {
  return fetchMinePlanner("road-conditions", filters);
}

export function getEquipmentStatusMine(filters = {}) {
  return fetchMinePlanner("equipment-status", filters);
}
