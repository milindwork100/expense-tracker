import { useState } from "react";
import Layout from "../components/layout/Layout";
import { downloadCSV, downloadPDF } from "../services/reportService";

const monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Reports() {
  const now = new Date();
  const [scope, setScope] = useState("month"); // "month" or "all"
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [downloading, setDownloading] = useState("");
  const [error, setError] = useState("");

  const handleDownload = async (format) => {
    setError("");
    setDownloading(format);
    try {
      const m = scope === "month" ? month : null;
      const y = scope === "month" ? year : null;

      if (format === "csv") {
        await downloadCSV(m, y);
      } else {
        await downloadPDF(m, y);
      }
    } catch (err) {
      setError("Failed to generate report. Try again.");
    } finally {
      setDownloading("");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Reports</h1>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Export transactions
            </h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Scope selector */}
            <div className="flex rounded-lg overflow-hidden border border-slate-200 mb-4 w-fit">
              <button
                onClick={() => setScope("month")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  scope === "month"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                Specific month
              </button>
              <button
                onClick={() => setScope("all")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  scope === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                All time
              </button>
            </div>

            {/* Month/Year pickers, only if scope === "month" */}
            {scope === "month" && (
              <div className="flex gap-3 mb-6">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {monthNames.slice(1).map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
                >
                  {[year - 1, year, year + 1].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {scope === "all" && <div className="mb-6" />}

            {/* Download buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleDownload("csv")}
                disabled={downloading !== ""}
                className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
              >
                {downloading === "csv" ? "Generating..." : "Download CSV"}
              </button>
              <button
                onClick={() => handleDownload("pdf")}
                disabled={downloading !== ""}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {downloading === "pdf" ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Reports;
