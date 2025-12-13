import axios from "axios";

const ML_API_BASE_URL = process.env.ML_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
    baseURL: ML_API_BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function getSimulationPrediction(payload) {
    const response = await client.post(
        "/api/simulation-analysis",
        payload
    );
    return response.data;
}

export async function getAllPredictions(payload) {
    const response = await client.post(
        "/predict/batch",
        payload
    );
    return response.data;
}

export async function getRoadSpeedPrediction(payload) {
    const response = await client.post(
        "/predict/road-speed",
        payload
    );
    return response.data;
}

export async function getCycleTimePrediction(payload) {
    const response = await client.post(
        "/predict/cycle-time",
        payload
    );
    return response.data;
}

export async function getRoadRiskPrediction(payload) {
    const response = await client.post(
        "/predict/road-risk",
        payload
    );
    return response.data;
}

export async function getEquipmentFailurePrediction(payload) {
    const response = await client.post(
        "/predict/equipment-failure",
        payload
    );
    return response.data;
}

export async function getPortOperabilityPrediction(payload) {
    const response = await client.post(
        "/predict/port-operability",
        payload
    );
    return response.data;
}
