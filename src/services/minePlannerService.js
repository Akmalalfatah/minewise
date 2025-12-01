import apiClient from "./apiClient";

export async function getEnvironmentConditions() {
    const res = await apiClient.get("/mine-planner/environment");
    return res.data.environment_conditions;
}

export async function getRoadConditions() {
    const res = await apiClient.get("/mine-planner/road-conditions");
    return res.data.road_conditions;
}

export async function getEquipmentStatus() {
    const res = await apiClient.get("/mine-planner/equipment-status");
    return res.data.equipment_status;
}

export async function getAIRecommendation() {
    const res = await apiClient.get("/mine-planner/ai-recommendation");
    return res.data.ai_recommendation;
}
