import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { CATEGORIES } from "../utils/categories";
import {
  getRecurring,
  createRecurring,
  toggleRecurring,
  deleteRecurring,
} from "../services/recurringService";

function Recurring() {
  const [rules, setRules] = useState([]);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await getRecurring();
      setRules(res.data);
    } catch (err) {
      setError("Failed to load recurring transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createRecurring({
        type,
        amount: Number(amount),
        category,
        note,
        frequency,
        startDate,
      });
      setAmount("");
      setCategory("");
      setNote("");
      setStartDate("");
      fetchRules();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create recurring transaction",
      );
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleRecurring(id);
      fetchRules();
    } catch (err) {
      setError("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecurring(id);
      fetchRules();
    } catch (err) {
      setError("Failed to delete");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40">
        <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            Recurring Transactions
          </h1>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Set up a recurring transaction
            </h2>
            {error && (
              <p role="alert" className="text-rose-500 text-sm mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex rounded-lg overflow-hidden border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setType("expense")}
                    aria-pressed={type === "expense"}
                    className={`flex-1 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      type === "expense"
                        ? "bg-rose-500 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    aria-pressed={type === "income"}
                    className={`flex-1 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      type === "income"
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Income
                  </button>
                </div>

                <div>
                  <label htmlFor="rec-amount" className="sr-only">
                    Amount
                  </label>
                  <input
                    id="rec-amount"
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rec-category" className="sr-only">
                    Category
                  </label>
                  <select
                    id="rec-category"
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
                <div>
                  <label htmlFor="rec-frequency" className="sr-only">
                    Frequency
                  </label>
                  <select
                    id="rec-frequency"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rec-startdate" className="sr-only">
                    Start date
                  </label>
                  <input
                    id="rec-startdate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rec-note" className="sr-only">
                    Note
                  </label>
                  <input
                    id="rec-note"
                    type="text"
                    placeholder="Note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                Create Recurring Rule
              </button>
            </form>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : rules.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-10 text-center">
              <p className="text-slate-400 text-sm">
                No recurring transactions set up yet
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {rules.map((r) => (
                <div
                  key={r._id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                        r.type === "income"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {r.type === "income" ? "+" : "−"}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">
                        {r.category}{" "}
                        <span className="text-xs text-slate-400 font-normal capitalize">
                          · {r.frequency}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400">
                        Next: {new Date(r.nextRunDate).toLocaleDateString()}
                        {r.note ? ` · ${r.note}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`font-semibold text-sm ${
                        r.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      <span className="sr-only">
                        {r.type === "income" ? "Income" : "Expense"}:{" "}
                      </span>
                      ₹{r.amount.toLocaleString()}
                    </p>

                    <button
                      onClick={() => handleToggle(r._id)}
                      aria-pressed={r.active}
                      aria-label={`${r.active ? "Pause" : "Activate"} ${r.category} recurring transaction`}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                        r.active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {r.active ? "Active" : "Paused"}
                    </button>

                    <button
                      onClick={() => handleDelete(r._id)}
                      aria-label={`Delete ${r.category} recurring transaction`}
                      className="text-slate-300 hover:text-rose-500 text-xs transition focus:outline-none focus:ring-2 focus:ring-rose-300 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Recurring;
