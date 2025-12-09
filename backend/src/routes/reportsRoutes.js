import express from "express";
import {
  getReportGeneratorForm,
  generateReport,
  downloadReport,
  getRecentReports,
  downloadRecentReport,
  viewRecentReport,
  getScheduledReports,
  getExportTemplates,
  getReportReview,
} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/generator-form", getReportGeneratorForm);
router.post("/generate", generateReport);
router.post("/download", downloadReport);

router.get("/recent", getRecentReports);
router.get("/download/:id", downloadRecentReport);
router.get("/view/:id", viewRecentReport);

router.get("/scheduled", getScheduledReports);
router.get("/templates", getExportTemplates);
router.get("/review", getReportReview);

export default router;
