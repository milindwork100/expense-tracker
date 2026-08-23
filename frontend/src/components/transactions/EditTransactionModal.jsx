import { useState, useEffect } from "react";
import { CATEGORIES } from "../../utils/categories";

function EditTransactionModal({ transaction, onSave, onClose }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount);
      setCategory(transaction.category);
      setNote(transaction.note || "");
      setDate(new Date(transaction.date).toISOString().split("T")[0]);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(transaction._id, {
      type,
      amount: Number(amount),
      category,
      note,
      date,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-dialog-title"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h2
          id="edit-dialog-title"
          className="text-lg font-semibold text-slate-800 mb-4"
        >
          Edit transaction
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex rounded-lg overflow-hidden border border-slate-200">
              <button
                type="button"
                onClick={() => setType("expense")}
                aria-pressed={type === "expense"}
                className={`flex-1 py-2 text-sm font-medium transition ${
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
                className={`flex-1 py-2 text-sm font-medium transition ${
                  type === "income"
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                Income
              </button>
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-label="Amount"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-label="Category"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-label="Date"
            />
          </div>

          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Note"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransactionModal;
