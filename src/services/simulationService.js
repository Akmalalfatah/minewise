import apiClient from "./apiClient";

export const getSimulationOverview = async (params = {}) => {
  try {
    const response = await apiClient.get("/simulation/overview", {
      params
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 503) {
      return {
        unavailable: true,
        message: error.response.data?.message
      };
    }
    throw error;
  }
};

export default {
  getSimulationOverview
};
