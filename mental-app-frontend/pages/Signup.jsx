// src/components/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../components/utils/apiEndpoints";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await axios.post(apiEndpoints.USERS_LIST_API, form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 p-4 font-sans selection:bg-teal-200">
      
      <div className="w-full max-w-md p-8 rounded-3xl bg-white shadow-xl border border-slate-100">
        
        {/* Branding Logo */}
        <div className="flex justify-center mb-6">
            <img 
              src="video/healware-logo.png" // Make sure this file is in your 'public' folder
              alt="Healware Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
            />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Join Healware today</p>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold shadow-md hover:shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-8 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;