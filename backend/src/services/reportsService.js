import { loadJSON } from "../utils/jsonLoader.js";

export function getReportGeneratorForm() {
    const json = loadJSON("reports.json");
    return json.generator_form || null;
}

export async function generateReport(payload = {}) {
    return {
        status: "success",
        report_id: `rpt_${Date.now()}`,
        generated_at: new Date().toISOString(),
        options: payload
    };
}

export async function downloadReport(payload = {}) {
    const dummy = Buffer.from("%PDF-1.4\n%Dummy MineWise Report\n");
    const filename = `MineWise_Report_${Date.now()}.pdf`;
    return { blob: dummy, filename };
}

export function getRecentReports() {
    const json = loadJSON("reports.json");
    return json.recent_reports || json.recent || [];
}

export function getScheduledReports() {
    const json = loadJSON("reports.json");
    return json.scheduled_reports || [];
}

export function getExportTemplates() {
    const json = loadJSON("reports.json");
    return (json.templates || []).length ? json.templates : (json.generator_form?.templates || []);
}

export function getReportReview() {
    const json = loadJSON("reports.json");
    return json.review || {
        executiveSummaryText: "No review available",
        aiRecommendationsText: "",
        operationalOverviewText: "",
        costAnalysisText: ""
    };
}
