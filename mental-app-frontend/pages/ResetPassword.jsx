// src/components/ResetPassword.jsx
import { useState } from "react";
import axios from "axios";
import { apiEndpoints } from "../components/utils/apiEndpoints";

function ResetPassword() {
  const token = window.location.pathname.split('/').pop();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${apiEndpoints.RESET_PASSWORD_API}/${token}`, { password });
      
      setMessage(res.data.message);
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
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
          Set a New Password
        </h2>
        <p className="text-center text-slate-500 mb-8 text-sm">Enter your new credentials below</p>

        {/* Feedback Messages */}
        {message && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm text-center font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!!message || isLoading} 
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold shadow-md hover:shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 ${(!!message || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
             {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;