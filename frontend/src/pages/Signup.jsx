import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/authService";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signup({ name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.svg"
            alt=""
            className="w-14 h-14 mb-2"
            aria-hidden="true"
          />
          <h1
            className="text-3xl font-bold text-indigo-700"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            ZenBudget
          </h1>
        </div>
        <h2 className="sr-only">Sign Up</h2>

        {error && (
          <p role="alert" className="text-rose-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label
          htmlFor="signup-email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <label
          htmlFor="signup-password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4 text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
