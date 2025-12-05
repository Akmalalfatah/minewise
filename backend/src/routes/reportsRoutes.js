import express from "express";
import {
    getReportGeneratorForm,
    generateReport,
    downloadReport
} from "../controllers/reportsController.js";

const router = express.Router();

router.get("/generator-form", getReportGeneratorForm);
router.post("/generate", generateReport);
router.post("/download", downloadReport);

export default router;
