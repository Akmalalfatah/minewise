import React, { useState } from "react";
import NotificationSection from "../components/layout/NotificationSection";
import ProfileSection from "../components/layout/ProfileSection";
import ReportGeneratorForm from "../components/reports/ReportGeneratorForm";
import { generateReport, downloadReport } from "../services/reportService";

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
        : [...prev, section],
    );
  };

  const handleGenerateReport = async () => {
    const payload = {
      report_type: reportType || null,
      time_period: timePeriod || null,
      sections: selectedSections,
    };

    try {
      const res = await generateReport(payload);
      if (res && res.status === "ok") {
        alert("Report generation started");
      } else {
        alert("Report generation request sent");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate report");
    }
  };

  const handleDownloadReport = async () => {
    const payload = {
      report_type: reportType || null,
      time_period: timePeriod || null,
      sections: selectedSections,
    };

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
      console.error(err);
      alert("Failed to download report");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* HEADER */}
        <header className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-600">
              Generate custom reports berdasarkan section yang kamu pilih,
              lengkap dengan ringkasan eksekutif dan analisis operasional.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationSection />
            <ProfileSection />
          </div>
        </header>

        {/* REPORT GENERATOR FORM */}
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
            onChangeReportType={handleChangeReportType}
            onChangeTimePeriod={handleChangeTimePeriod}
            onToggleSection={handleToggleSection}
            onGenerateReport={handleGenerateReport}
            onDownloadReport={handleDownloadReport}
          />
        </section>
      </div>
    </main>
  );
}

export default ReportPage;
