import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { CATEGORIES } from "../utils/categories";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { getBudgets, setBudget, deleteBudget } from "../services/budgetService";

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

function Budgets() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await getBudgets(month, year);
      setBudgets(res.data);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await setBudget({ category, limit: Number(limit), month, year });
      setCategory("");
      setLimit("");
      fetchBudgets();
      toast.success("Budget saved");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set budget");
      toast.error("Failed to save budget");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteBudget(deleteTarget._id);
      setDeleteTarget(null);
      fetchBudgets();
      toast.success("Budget deleted");
    } catch (err) {
      toast.error("Failed to delete budget");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">Budgets</h1>

          <div className="flex gap-3 mb-6">
            <div>
              <label htmlFor="budget-month" className="sr-only">
                Month
              </label>
              <select
                id="budget-month"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {monthNames.slice(1).map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="budget-year" className="sr-only">
                Year
              </label>
              <select
                id="budget-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Set a budget
            </h2>
            {error && (
              <p role="alert" className="text-rose-500 text-sm mb-4">
                {error}
              </p>
            )}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1">
                <label htmlFor="budget-category" className="sr-only">
                  Category
                </label>
                <select
                  id="budget-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:w-40">
                <label htmlFor="budget-limit" className="sr-only">
                  Monthly limit
                </label>
                <input
                  id="budget-limit"
                  type="number"
                  placeholder="Monthly limit"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                Save
              </button>
            </form>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : budgets.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
              <p className="text-slate-400 text-sm">
                No budgets set for {monthNames[month]} {year}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {budgets.map((b) => {
                const percent = Math.min((b.spent / b.limit) * 100, 100);
                const isOver = b.spent > b.limit;
                const isNearLimit = !isOver && percent >= 80;
                const gaugeColor = isOver
                  ? "#E11D48"
                  : isNearLimit
                    ? "#F59E0B"
                    : "#4F46E5";
                const gaugeData = [
                  { name: b.category, value: percent, fill: gaugeColor },
                ];

                return (
                  <div
                    key={b._id}
                    className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-800 text-sm">
                        {b.category}
                      </p>
                      <button
                        onClick={() => setDeleteTarget(b)}
                        aria-label={`Delete ${b.category} budget`}
                        className="text-slate-300 hover:text-rose-500 text-xs transition focus:outline-none focus:ring-2 focus:ring-rose-300 rounded"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <RadialBarChart
                        width={160}
                        height={160}
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="100%"
                        barSize={12}
                        data={gaugeData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 100]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={8}
                        />
                      </RadialBarChart>
                      <div
                        className="absolute flex flex-col items-center"
                        role="progressbar"
                        aria-valuenow={Math.round(percent)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${b.category} budget usage`}
                      >
                        <span className="text-xl font-bold text-slate-800">
                          {percent.toFixed(0)}%
                        </span>
                        <span className="text-xs text-slate-400">used</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 text-center mt-1">
                      ₹{b.spent.toLocaleString()} / ₹{b.limit.toLocaleString()}
                    </p>

                    {isOver && (
                      <p className="text-xs text-rose-600 mt-2 font-medium text-center">
                        ⚠ Over budget by ₹{(b.spent - b.limit).toLocaleString()}
                      </p>
                    )}
                    {isNearLimit && (
                      <p className="text-xs text-amber-600 mt-2 font-medium text-center">
                        Approaching limit
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete budget?"
        message={
          deleteTarget
            ? `This will remove the ${deleteTarget.category} budget for ${monthNames[month]} ${year}.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  );
}

export default Budgets;
