import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios
import { apiEndpoints } from "../components/utils/apiEndpoints";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(""); // State for handling errors
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ MODIFIED: Handle form submission to send data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // Send data to the backend API
      await axios.post(apiEndpoints.USERS_LIST_API, form);
      // On success, navigate to the login page
      navigate("/login");
    } catch (err) {
      // Set error message from server response
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/Cover_image.png')` }}
    >
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl shadow-red-500/30">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Create Account
        </h2>
        
        {/* Display error message if it exists */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required // Add required attribute
          />

          {/* Email Input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required // Add required attribute
          />

          {/* Password Input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required // Add required attribute
          />

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;