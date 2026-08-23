import api from "./api";

export const downloadCSV = async (month, year) => {
  const params = month && year ? `?month=${month}&year=${year}` : "";
  const res = await api.get(`/reports/csv${params}`, { responseType: "blob" });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `transactions-${year || "all"}-${month || ""}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadPDF = async (month, year) => {
  const params = month && year ? `?month=${month}&year=${year}` : "";
  const res = await api.get(`/reports/pdf${params}`, { responseType: "blob" });

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `transactions-${year || "all"}-${month || ""}.pdf`,
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
