import axios from "axios";

const ML_BASE_URL = "http://localhost:8000";

export async function fetchMLDataByIntent(intent, payload = {}) {
    switch (intent) {
        case "DAMAGE_ANALYSIS":
            return axios.post(`${ML_BASE_URL}/predict/road-risk`, payload);

        case "VESSEL_SCHEDULING":
            return axios.post(`${ML_BASE_URL}/predict/port-operability`, payload);

        case "PRODUCTION_OPTIMIZATION":
            return axios.get(`${ML_BASE_URL}/api/simulation-analysis`, {
                params: payload
            });


        case "WEATHER_IMPACT":
            return axios.get(`${ML_BASE_URL}/api/simulation-analysis`, {
                params: {
                    expected_rainfall_mm: 25,
                    equipment_health_pct: 80,
                    vessel_delay_hours: 5
                }
            });

        default:
            return axios.get(`${ML_BASE_URL}/api/simulation-analysis`, {
                params: {
                    expected_rainfall_mm: 25,
                    equipment_health_pct: 80,
                    vessel_delay_hours: 5
                }
            });
    }
}
