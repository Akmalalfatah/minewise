import * as service from "../services/reportsService.js";
import { parseFilters } from "../utils/filterUtil.js";

export async function getReportGeneratorForm(req, res) {
    const payload = service.getReportGeneratorForm();
    return res.json({ generator_form: payload });
}

export async function generateReport(req, res) {
    const payload = req.body || {};
    const result = await service.generateReport(payload);
    return res.json(result);
}

export async function downloadReport(req, res) {
    const payload = req.body || {};
    const { blob, filename } = await service.downloadReport(payload);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(blob);
}

export async function getRecentReports(req, res) {
    const payload = service.getRecentReports();
    return res.json({ recent_reports: payload });
}

export async function getScheduledReports(req, res) {
    const payload = service.getScheduledReports();
    return res.json({ scheduled_reports: payload });
}

export async function getExportTemplates(req, res) {
    const payload = service.getExportTemplates();
    return res.json({ templates: payload });
}

export async function getReportReview(req, res) {
    const payload = service.getReportReview();
    return res.json({ review: payload });
}
