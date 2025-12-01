import apiClient from "./apiClient";

export async function getReportGeneratorOptions() {
    try {
        const res = await apiClient.get("/reports/generator-options");
        return res.data?.generator_options || null;
    } catch (err) {
        console.error("Failed to fetch report generator options:", err);
        return null;
    }
}

export async function getRecentReports() {
    try {
        const res = await apiClient.get("/reports/recent");
        return res.data?.recent_reports || null;
    } catch (err) {
        console.error("Failed to fetch recent reports:", err);
        return null;
    }
}

export async function getScheduledReports() {
    try {
        const res = await apiClient.get("/reports/scheduled");
        return res.data?.scheduled_reports || null;
    } catch (err) {
        console.error("Failed to fetch scheduled reports:", err);
        return null;
    }
}

export async function getExportTemplates() {
    try {
        const res = await apiClient.get("/reports/export-templates");
        return res.data?.export_templates || null;
    } catch (err) {
        console.error("Failed to fetch export templates:", err);
        return null;
    }
}

export async function getReportReview() {
    try {
        const res = await apiClient.get("/reports/review");
        return res.data?.report_review || null;
    } catch (err) {
        console.error("Failed to fetch report review:", err);
        return null;
    }
}




