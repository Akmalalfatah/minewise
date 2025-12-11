import React, { useState, useEffect } from "react";
import ReportGeneratorForm from "../components/reports/ReportGeneratorForm";
import {
  generateReport,
  downloadReport,
  getRecentReports,
  downloadRecentReport,
} from "../services/reportService";
import { userStore } from "../store/userStore";
import { notificationStore } from "../store/notificationStore";
import { motion } from "framer-motion";

function RecentReportCard({ report, onDownload, onView, index }) {
  const dateLabel = report.generated_at
    ? new Date(report.generated_at).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  const sectionsLabel = (() => {
    try {
      const arr = JSON.parse(report.sections || "[]");
      if (!Array.isArray(arr) || arr.length === 0) return "Custom sections";
      if (arr.length <= 2) return arr.join(", ");
      return `${arr.slice(0, 2).join(", ")} +${arr.length - 2} more`;
    } catch {
      return "Custom sections";
    }
  })();

  const delay = typeof index === "number" ? index * 0.05 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="w-full p-4 bg-[#f3f4f6] rounded-xl shadow-sm flex items-center justify-between border border-[#e0e3e8]"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1C2534] flex items-center justify-center">
          <img
            src="/icons/icon_overview.png"
            alt="Report overview"
            className="w-5 h-5 object-contain"
          />
        </div>
        <div className="flex flex-col">
          {/* FIX: judul sekarang selalu pakai teks ini, gak ikut title backend */}
          <span className="text-sm font-semibold text-[#111827]">
            MineWise Operational Report
          </span>
          <span className="text-xs text-[#6b7280]">{dateLabel}</span>
          <span className="text-xs text-[#9ca3af] mt-0.5">
            {sectionsLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onView}
          className="px-3 py-2 bg-white border border-[#d1d5db] text-xs font-semibold text-[#1C2534] rounded-lg hover:bg-[#e5e7eb] transition"
        >
          View
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="px-4 py-2 bg-[#1C2534] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition"
        >
          Download
        </button>
      </div>
    </motion.div>
  );
}

function ReportPage() {
  const reportTypes = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  const timePeriods = [
    { id: "today", label: "Today" },
    { id: "last_7_days", label: "Last 7 Days" },
    { id: "last_30_days", label: "Last 30 Days" },
  ];

  const sectionsList = [
    "Executive Summary",
    "Operational Overview",
    "Weather Analysis",
    "Equipment Status",
    "Road Conditions",
    "AI Recommendations",
    "Scenario Analysis",
    "Risk Assessment",
  ];

  const [reportType, setReportType] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [selectedSections, setSelectedSections] = useState([]);
  const [notes, setNotes] = useState("");
  const [recentReports, setRecentReports] = useState([]);

  const addNotification = notificationStore((state) => state.addNotification);
  const user = userStore((state) => state.user);

  const handleChangeReportType = (id) => {
    setReportType(id);
  };

  const handleChangeTimePeriod = (id) => {
    setTimePeriod(id);
  };

  const handleToggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const buildPayload = () => ({
    report_type: reportType || null,
    time_period: timePeriod || null,
    sections: selectedSections,
    notes: notes || "",
  });

  const refreshRecentReports = async () => {
    try {
      const list = await getRecentReports();
      setRecentReports(list);
    } catch (err) {
      console.error("Failed to load recent reports", err);
    }
  };

  useEffect(() => {
    refreshRecentReports();
  }, []);

  const handleGenerateReport = async () => {
    const payload = buildPayload();

    try {
      const res = await generateReport(payload);

      const reportId =
        (res && (res.report_id || res.id || (res.report && res.report.id))) ||
        null;

      addNotification({
        senderName: user?.fullname || "User",
        message: "has generated a new report! Check it out.",
        reportId,
      });

      await refreshRecentReports();

      if (res && res.status === "success") {
        alert("Report generation started");
      } else {
        alert("Report generation request sent");
      }
    } catch (err) {
      alert("Failed to generate report");
    }
  };

  const handleDownloadReport = async () => {
    const payload = buildPayload();

    try {
      const { blob, filename } = await downloadReport(payload);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download report");
    }
  };

  const handleDownloadRecent = async (id) => {
    try {
      const { blob, filename } = await downloadRecentReport(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to download report");
    }
  };

  const handleViewRecent = async (id) => {
    try {
      const { blob } = await downloadRecentReport(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert("Failed to open report");
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-[#f5f5f7] px-8 py-8"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
        <section aria-label="Report generator form" className="mt-2">
          <ReportGeneratorForm
            reportTypeValue={
              reportTypes.find((r) => r.id === reportType)?.label || ""
            }
            timePeriodValue={
              timePeriods.find((t) => t.id === timePeriod)?.label || ""
            }
            reportTypes={reportTypes}
            timePeriods={timePeriods}
            sectionsList={sectionsList}
            selectedSections={selectedSections}
            notesValue={notes}
            onChangeNotes={setNotes}
            onChangeReportType={handleChangeReportType}
            onChangeTimePeriod={handleChangeTimePeriod}
            onToggleSection={handleToggleSection}
            onGenerateReport={handleGenerateReport}
            onDownloadReport={handleDownloadReport}
          />
        </section>

        <section aria-label="Recent reports">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#1C2534] text-lg font-bold">
              Recent Reports
            </h2>
          </div>

          {recentReports.length === 0 ? (
            <div className="w-full p-6 bg-white rounded-2xl border border-[#e5e7eb] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1C2534] flex items-center justify-center">
                <img
                  src="/icons/icon_overview.png"
                  alt="Report overview"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#111827]">
                  No reports yet
                </span>
                <span className="text-xs text-[#6b7280]">
                  Generate your first insight to see it appear here.
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentReports.map((r, index) => (
                <RecentReportCard
                  key={r.id}
                  report={r}
                  index={index}
                  onDownload={() => handleDownloadRecent(r.id)}
                  onView={() => handleViewRecent(r.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </motion.main>
  );
}

export default ReportPage;
