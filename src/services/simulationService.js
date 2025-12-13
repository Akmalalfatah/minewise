import apiClient from "./apiClient";

export const getSimulationOverview = async () => {
  const response = await apiClient.get("/simulation/overview");
  return response.data;
};

export default {
  getSimulationOverview,
};
