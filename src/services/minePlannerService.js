import apiClient from "./apiClient";

export async function getEnvironmentConditions(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/mine-planner/environment-conditions", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.environment_conditions;
}

export async function getMineRoadConditions(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/mine-planner/road-conditions", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.road_conditions;
}

export async function getEquipmentStatusMine(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/mine-planner/equipment-status", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.equipment_status;
}

export async function getAIMineRecommendation(filters = {}) {
  const { location, timePeriod, shift } = filters;

  const res = await apiClient.get("/mine-planner/ai-mine-recommendation", {
    params: {
      location,
      time: timePeriod,
      shift,
    },
  });

  return res.data.ai_mine_recommendation;
}
