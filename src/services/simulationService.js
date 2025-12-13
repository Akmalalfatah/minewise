import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getSimulationOverview(params = null) {
  const res = await axios.get(`${API_BASE_URL}/api/simulation-analysis`, {
    params: params || undefined,
    withCredentials: true,
  });

  if (!res?.data || res.data.status !== "success") {
    throw new Error(res?.data?.error || "Failed to load simulation overview");
  }

  return res.data.data;
}

export async function runSimulation(input = {}) {
  const res = await axios.post(`${API_BASE_URL}/api/simulation-analysis`, input, {
    withCredentials: true,
  });

  if (!res?.data || res.data.status !== "success") {
    throw new Error(res?.data?.error || "Failed to run simulation");
  }

  return res.data.data;
}
