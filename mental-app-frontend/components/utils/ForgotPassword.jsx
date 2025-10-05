import { useState } from "react";
import axios from "axios";
import { apiEndpoints } from "./apiEndpoints";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(apiEndpoints.FORGOT_PASSWORD_API, { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/Cover_image.png')` }}
    >
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl shadow-red-500/30">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-4">
          Forgot Password
        </h2>
        <p className="text-center text-gray-700 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {message && <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;