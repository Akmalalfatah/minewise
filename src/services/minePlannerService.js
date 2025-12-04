import apiClient from "./apiClient";

export async function getEnvironmentConditions(filters) {
    const res = await apiClient.get("/mine-planner/environment", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.environment_conditions;
}

export async function getMineRoadConditions(filters) {
    const res = await apiClient.get("/mine-planner/road-conditions", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.road_conditions;
}

export async function getEquipmentStatusMine(filters) {
    const res = await apiClient.get("/mine-planner/equipment-status", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.equipment_status;
}

export async function getAIMineRecommendation(filters) {
    const res = await apiClient.get("/mine-planner/ai-recommendation", {
        params: {
            location: filters.location,
            time: filters.timePeriod,
            shift: filters.shift
        }
    });
    return res.data.ai_mine_recommendation;
}
