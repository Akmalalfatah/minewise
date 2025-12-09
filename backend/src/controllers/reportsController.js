import * as service from "../services/reportsService.js";

export async function getReportGeneratorForm(req, res) {
  const payload = service.getReportGeneratorForm();
  return res.json({ generator_form: payload });
}

export async function generateReport(req, res) {
  const payload = req.body || {};
  const userId = req.user?.id || null;

  try {
    const result = await service.generateReport(payload, userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate report" });
  }
}

export async function downloadReport(req, res) {
  const payload = req.body || {};
  const userId = req.user?.id || null;

  try {
    const { buffer, filename } = await service.downloadReport(payload, userId);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ error: "Failed to generate report PDF" });
  }
}

export async function getRecentReports(req, res) {
  try {
    const recent = await service.getRecentReports();
    return res.json({ recent_reports: recent });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load recent reports" });
  }
}

export async function downloadRecentReport(req, res) {
  const { id } = req.params;

  try {
    const result = await service.getReportFileById(id);
    if (!result) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`
    );
    return res.send(result.buffer);
  } catch (err) {
    return res.status(500).json({ error: "Failed to download report PDF" });
  }
}

export async function viewRecentReport(req, res) {
  const { id } = req.params;

  try {
    const result = await service.getReportFileById(id);
    if (!result) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${result.filename}"`
    );
    return res.send(result.buffer);
  } catch (err) {
    return res.status(500).json({ error: "Failed to view report PDF" });
  }
}

export async function getScheduledReports(req, res) {
  try {
    const payload = await service.getScheduledReports();
    return res.json({ scheduled_reports: payload });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load scheduled reports" });
  }
}

export async function getExportTemplates(req, res) {
  try {
    const payload = await service.getExportTemplates();
    return res.json({ templates: payload });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load export templates" });
  }
}

export async function getReportReview(req, res) {
  try {
    const payload = await service.getReportReview();
    return res.json({ review: payload });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load report review" });
  }
}
