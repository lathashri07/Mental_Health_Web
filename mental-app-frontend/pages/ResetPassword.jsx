import { useState } from "react";
// ❌ REMOVED: react-router-dom hooks are not available in this context
// import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../components/utils/apiEndpoints";

function ResetPassword() {
  // ✅ MODIFIED: Get the token directly from the window's URL path
  const token = window.location.pathname.split('/').pop();
  
  // ❌ REMOVED: useNavigate hook
  // const navigate = useNavigate();

  // State for the form inputs, success messages, and errors
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Step 1: Client-side validation to ensure passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      // Step 2: Send the token and new password to the backend API endpoint
      const res = await axios.post(`${apiEndpoints.RESET_PASSWORD_API}/${token}`, { password });
      
      // On success, display the confirmation message
      setMessage(res.data.message);
      
      // Step 3: Redirect the user to the login page after a 3-second delay
      setTimeout(() => {
        // ✅ MODIFIED: Use window.location.href for navigation
        window.location.href = "/login";
      }, 3000);

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
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Set a New Password
        </h2>

        {/* Display success or error messages to the user */}
        {message && <p className="text-green-600 bg-green-100 p-3 rounded-lg text-center mb-4">{message}</p>}
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required
          />
          <button
            type="submit"
            disabled={!!message} // Disable the button after a successful submission
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

