import apiClient from "./apiClient";

export async function generateReport(payload) {
  const res = await apiClient.post("/reports/generate", payload);
  return res.data;
}

export async function downloadReport(payload) {
  const res = await apiClient.post("/reports/download", payload, {
    responseType: "blob",
  });

  let filename = "MineWise_Report.pdf";
  const disposition = res.headers["content-disposition"];
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/i);
    if (match && match[1]) filename = match[1];
  }

  return { blob: res.data, filename };
}

export async function getRecentReports() {
  const res = await apiClient.get("/reports/recent");
  return res.data?.recent_reports || [];
}

export async function downloadRecentReport(id) {
  const res = await apiClient.get(`/reports/download/${id}`, {
    responseType: "blob",
  });

  let filename = "MineWise_Report.pdf";
  const disposition = res.headers["content-disposition"];
  if (disposition) {
    const match = disposition.match(/filename="?([^"]+)"?/i);
    if (match && match[1]) filename = match[1];
  }

  return { blob: res.data, filename };
}
