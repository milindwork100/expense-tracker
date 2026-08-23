import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactionService";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      setError("Failed to load transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);
    try {
      await createTransaction({
        type,
        amount: Number(amount),
        category,
        note,
        date,
        receipt,
      });
      setAmount("");
      setCategory("");
      setNote("");
      setDate("");
      setReceipt(null);
      document.getElementById("receipt-input").value = "";
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            Transactions
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Balance</p>
              <p
                className={`text-xl font-bold ${balance >= 0 ? "text-slate-800" : "text-red-600"}`}
              >
                ₹{balance.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Income</p>
              <p className="text-xl font-bold text-green-600">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Expenses</p>
              <p className="text-xl font-bold text-red-600">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Add transaction
            </h2>

            {error && (
              <p role="alert" className="text-red-500 text-sm mb-4">
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
                    className={`flex-1 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      type === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("income")}
                    aria-pressed={type === "income"}
                    className={`flex-1 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      type === "income"
                        ? "bg-green-500 text-white"
                        : "bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Income
                  </button>
                </div>

                <div>
                  <label htmlFor="amount" className="sr-only">
                    Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="category" className="sr-only">
                    Category
                  </label>
                  <input
                    id="category"
                    type="text"
                    placeholder="Category (e.g. Food, Rent)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className="sr-only">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="note" className="sr-only">
                  Note
                </label>
                <input
                  id="note"
                  type="text"
                  placeholder="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="receipt-input"
                  className="block text-xs text-slate-500 mb-1.5"
                >
                  Receipt (optional)
                </label>
                <input
                  id="receipt-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceipt(e.target.files[0])}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                {uploading ? "Adding..." : "Add Transaction"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {transactions.length === 0 && (
              <p className="p-8 text-slate-400 text-center text-sm">
                No transactions yet
              </p>
            )}
            {transactions.map((t) => (
              <div
                key={t._id}
                className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  {t.receiptUrl ? (
                    <a
                      href={t.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={t.receiptUrl}
                        alt={`Receipt for ${t.category} transaction`}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                      />
                    </a>
                  ) : (
                    <div
                      aria-hidden="true"
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                        t.type === "income"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {t.category}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.note ? `${t.note} · ` : ""}
                      {new Date(t.date).toLocaleDateString()}
                      {t.receiptUrl ? " · 📎 Receipt" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-semibold text-sm ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span className="sr-only">
                      {t.type === "income" ? "Income" : "Expense"}:{" "}
                    </span>
                    {t.type === "income" ? "+" : "−"}₹
                    {t.amount.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(t._id)}
                    aria-label={`Delete ${t.category} transaction of ₹${t.amount}`}
                    className="text-slate-300 hover:text-red-500 text-xs transition focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Transactions;
