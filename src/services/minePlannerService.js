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
  const res = await fetch(`/api/mine-planner/${path}${query}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
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
