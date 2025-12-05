import React from "react";
import NotificationSection from "../components/layout/NotificationSection";
import ProfileSection from "../components/layout/ProfileSection";
import ReportGeneratorForm from "../components/reports/ReportGeneratorForm";

function ReportPage() {
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
          <ReportGeneratorForm />
        </section>

      </div>
    </main>
  );
}

export default ReportPage;
