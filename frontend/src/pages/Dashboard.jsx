import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import api from "../services/api";

const COLORS = [
  "#6366F1",
  "#F43F5E",
  "#F59E0B",
  "#059669",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [summary, setSummary] = useState({
    categoryBreakdown: [],
    monthlyTrend: [],
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, txRes] = await Promise.all([
          api.get("/transactions/summary"),
          api.get("/transactions"),
        ]);
        setSummary(summaryRes.data);
        setTransactions(txRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalExpense = summary.categoryBreakdown.reduce(
    (sum, c) => sum + c.total,
    0,
  );
  const totalIncome = summary.monthlyTrend
    .filter((t) => t._id.type === "income")
    .reduce((sum, t) => sum + t.total, 0);
  const balance = totalIncome - totalExpense;

  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trendMap = {};
  summary.monthlyTrend.forEach((t) => {
    const key = `${monthNames[t._id.month]} ${t._id.year}`;
    if (!trendMap[key]) trendMap[key] = { month: key, income: 0, expense: 0 };
    trendMap[key][t._id.type] = t.total;
  });
  const trendData = Object.values(trendMap);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Welcome back, {user?.name || "there"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Here's your spending overview
              </p>
            </div>
            <Link
              to="/transactions"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              + Add Transaction
            </Link>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : transactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
              <p className="text-slate-400 text-sm mb-3">No data yet</p>
              <Link
                to="/transactions"
                className="text-indigo-600 text-sm hover:underline"
              >
                Add your first transaction →
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Balance</p>
                  <p
                    className={`text-xl font-bold ${balance >= 0 ? "text-indigo-700" : "text-rose-600"}`}
                  >
                    ₹{balance.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Income</p>
                  <p className="text-xl font-bold text-emerald-600">
                    ₹{totalIncome.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Expenses</p>
                  <p className="text-xl font-bold text-rose-600">
                    ₹{totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-sm font-semibold text-slate-700 mb-4">
                    Spending by category
                  </h2>
                  {summary.categoryBreakdown.length === 0 ? (
                    <p className="text-slate-400 text-sm py-16 text-center">
                      No expenses yet
                    </p>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={summary.categoryBreakdown}
                            dataKey="total"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={80}
                          >
                            {summary.categoryBreakdown.map((entry, index) => (
                              <Cell
                                key={entry._id}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => `₹${value.toLocaleString()}`}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="mt-2 space-y-2">
                        {summary.categoryBreakdown.map((c, i) => (
                          <div
                            key={c._id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor: COLORS[i % COLORS.length],
                                }}
                              />
                              <span className="text-slate-600">{c._id}</span>
                            </div>
                            <span className="font-medium text-slate-800">
                              ₹{c.total.toLocaleString()} (
                              {((c.total / totalExpense) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-sm font-semibold text-slate-700 mb-4">
                    Monthly trend
                  </h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value) => `₹${value.toLocaleString()}`}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar
                        dataKey="income"
                        fill="#059669"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        fill="#F43F5E"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Recent transactions
                  </h2>
                  <Link
                    to="/transactions"
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    View all →
                  </Link>
                </div>
                {recentTransactions.map((t) => (
                  <div
                    key={t._id}
                    className="p-4 flex items-center justify-between border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        aria-hidden="true"
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          t.type === "income"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {t.type === "income" ? "+" : "−"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {t.category}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(t.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold text-sm ${
                        t.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}₹
                      {t.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
