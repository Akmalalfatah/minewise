import axios from "axios";

const ML_BASE_URL = "http://localhost:8000";

export async function fetchMLDataByIntent(intent, question) {
    switch (intent) {
        case "DAMAGE_ANALYSIS":
            return axios.get(`${ML_BASE_URL}/api/analysis/damage-hotspot`);

        case "VESSEL_SCHEDULING":
            return axios.get(`${ML_BASE_URL}/api/analysis/vessel-delay`);

        case "PRODUCTION_OPTIMIZATION":
            return axios.get(`${ML_BASE_URL}/api/simulation-analysis`, {
                params: {
                    expected_rainfall_mm: 25,
                    equipment_health_pct: 80,
                    vessel_delay_hours: 5
                }
            });

        case "WEATHER_IMPACT":
            return axios.get(`${ML_BASE_URL}/api/analysis/weather-impact`);

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
