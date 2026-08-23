function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-slate-800 mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
