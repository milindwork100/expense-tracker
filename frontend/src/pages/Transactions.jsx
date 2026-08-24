import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EditTransactionModal from "../components/transactions/EditTransactionModal";
import Skeleton from "../components/common/Skeleton";
import { CATEGORIES } from "../utils/categories";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
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
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await getTransactions({
        type: filterType,
        category: filterCategory,
        startDate: filterStartDate,
        endDate: filterEndDate,
        search: filterSearch,
        page,
        limit: 10,
      });
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [
    filterType,
    filterCategory,
    filterStartDate,
    filterEndDate,
    filterSearch,
    page,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    filterType,
    filterCategory,
    filterStartDate,
    filterEndDate,
    filterSearch,
  ]);

  const clearFilters = () => {
    setFilterType("");
    setFilterCategory("");
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterSearch("");
  };

  const hasActiveFilters =
    filterType ||
    filterCategory ||
    filterStartDate ||
    filterEndDate ||
    filterSearch;

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
      toast.success("Transaction added");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
      toast.error("Failed to add transaction");
    } finally {
      setUploading(false);
    }
  };

  const handleEditSave = async (id, data) => {
    try {
      await updateTransaction(id, data);
      setEditingTransaction(null);
      fetchTransactions();
      toast.success("Transaction updated");
    } catch (err) {
      toast.error("Failed to update transaction");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTransaction(deleteTarget._id);
      setDeleteTarget(null);
      fetchTransactions();
      toast.success("Transaction deleted");
    } catch (err) {
      toast.error("Failed to delete transaction");
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-8">
            Transactions
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Balance (this page)</p>
              <p
                className={`text-xl font-bold ${balance >= 0 ? "text-indigo-700" : "text-rose-600"}`}
              >
                ₹{balance.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">Income (this page)</p>
              <p className="text-xl font-bold text-emerald-600">
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
              <p className="text-xs text-slate-500 mb-1">
                Expenses (this page)
              </p>
              <p className="text-xl font-bold text-rose-600">
                ₹{totalExpense.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-expanded={showFilters}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-slate-400 hover:text-rose-500 transition focus:outline-none focus:ring-2 focus:ring-rose-300 rounded"
                >
                  Clear all
                </button>
              )}
            </div>

            {showFilters && (
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="filter-search" className="sr-only">
                    Search
                  </label>
                  <input
                    id="filter-search"
                    type="text"
                    placeholder="Search by note or category..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label htmlFor="filter-type" className="sr-only">
                      Type
                    </label>
                    <select
                      id="filter-type"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="filter-category" className="sr-only">
                      Category
                    </label>
                    <select
                      id="filter-category"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="filter-start" className="sr-only">
                      From date
                    </label>
                    <input
                      id="filter-start"
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="filter-end" className="sr-only">
                      To date
                    </label>
                    <input
                      id="filter-end"
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              Add transaction
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
                  <label htmlFor="amount" className="sr-only">
                    Amount
                  </label>
                  <input
                    id="amount"
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
                  <label htmlFor="category" className="sr-only">
                    Category
                  </label>
                  <select
                    id="category"
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
                  <label htmlFor="date" className="sr-only">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                {uploading ? "Adding..." : "Add Transaction"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div>
                        <Skeleton className="h-3 w-24 mb-1.5" />
                        <Skeleton className="h-2.5 w-32" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <p className="p-8 text-slate-400 text-center text-sm">
                {hasActiveFilters
                  ? "No transactions match your filters"
                  : "No transactions yet"}
              </p>
            ) : (
              transactions.map((t) => (
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
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-rose-100 text-rose-600"
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
                  <div className="flex items-center gap-3">
                    <p
                      className={`font-semibold text-sm ${
                        t.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      <span className="sr-only">
                        {t.type === "income" ? "Income" : "Expense"}:{" "}
                      </span>
                      {t.type === "income" ? "+" : "−"}₹
                      {t.amount.toLocaleString()}
                    </p>
                    <button
                      onClick={() => setEditingTransaction(t)}
                      aria-label={`Edit ${t.category} transaction of ₹${t.amount}`}
                      className="text-slate-400 hover:text-indigo-600 text-xs transition focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(t)}
                      aria-label={`Delete ${t.category} transaction of ₹${t.amount}`}
                      className="text-slate-300 hover:text-rose-500 text-xs transition focus:outline-none focus:ring-2 focus:ring-rose-300 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditTransactionModal
        transaction={editingTransaction}
        onSave={handleEditSave}
        onClose={() => setEditingTransaction(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete transaction?"
        message={
          deleteTarget
            ? `This will permanently delete the ₹${deleteTarget.amount} ${deleteTarget.category} transaction.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Layout>
  );
}

export default Transactions;
