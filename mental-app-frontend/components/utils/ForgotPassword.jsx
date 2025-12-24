// src/components/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "./apiEndpoints";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(apiEndpoints.FORGOT_PASSWORD_API, { email });
      setMessage(res.data.message);
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
           <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xl">
             MH
           </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-4">
          Forgot Password?
        </h2>
        <p className="text-center text-slate-500 mb-8 text-sm px-4">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm text-center font-medium">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !!message}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold shadow-md hover:shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 ${(isLoading || !!message) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-8 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;