import apiClient from "./apiClient";

export async function getReportGeneratorForm() {
    try {
        const res = await apiClient.get("/reports/generator-form");
        return res.data?.generator_form || null;
    } catch (err) {
        console.error("Failed to fetch report generator form:", err);
        return null;
    }
}

export async function generateReport(payload) {
    try {
        const res = await apiClient.post("/reports/generate", payload);
        return res.data || null;
    } catch (err) {
        console.error("Failed to generate report:", err);
        throw err;
    }
}

export async function downloadReport(payload) {
    try {
        const res = await apiClient.post("/reports/download", payload, {
            responseType: "blob"
        });
        const contentDisposition = res.headers && res.headers["content-disposition"];
        let filename = "report.pdf";
        if (contentDisposition) {
            const match = /filename\*=UTF-8''(.+)|filename="?([^;"]+)"?/.exec(contentDisposition);
            if (match) {
                filename = decodeURIComponent(match[1] || match[2]);
            }
        }
        return { blob: res.data, filename };
    } catch (err) {
        console.error("Failed to download report:", err);
        throw err;
    }
}

export default {
    getReportGeneratorForm,
    generateReport,
    downloadReport
};
