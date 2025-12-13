export function detectIntent(question) {
    const q = question.toLowerCase();

    if (q.includes("kerusakan") || q.includes("rusak") || q.includes("jalan")) {
        return "DAMAGE_ANALYSIS";
    }

    if (q.includes("kapal") || q.includes("vessel") || q.includes("loading")) {
        return "VESSEL_SCHEDULING";
    }

    if (q.includes("produksi") || q.includes("production") || q.includes("output")) {
        return "PRODUCTION_OPTIMIZATION";
    }

    if (q.includes("cuaca") || q.includes("hujan") || q.includes("weather")) {
        return "WEATHER_IMPACT";
    }

    return "GENERAL_OPERATION";
}
