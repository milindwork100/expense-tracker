import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-lg text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-600 hover:bg-indigo-50"
    }`;

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="w-8 h-8" aria-hidden="true" />
          <h1
            className="text-2xl font-bold text-indigo-700"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            ZenBudget
          </h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto md:min-h-screen w-64 md:w-56 bg-white border-r border-slate-100 flex flex-col z-30 transform transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-slate-100 hidden md:block">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt=""
              className="w-8 h-8"
              aria-hidden="true"
            />
            <h1
              className="text-2xl font-bold text-indigo-700"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              ZenBudget
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">{user?.name}</p>
        </div>

        <div className="p-4 border-b border-slate-100 md:hidden">
          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1" onClick={() => setIsOpen(false)}>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={linkClass}>
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={linkClass}>
            Budgets
          </NavLink>
          <NavLink to="/recurring" className={linkClass}>
            Recurring
          </NavLink>
          <NavLink to="/reports" className={linkClass}>
            Reports
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
