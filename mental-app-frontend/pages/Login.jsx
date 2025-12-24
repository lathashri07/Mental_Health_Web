// src/components/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../components/utils/apiEndpoints";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state for better UX
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      setForm(JSON.parse(rememberedUser));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await axios.post(apiEndpoints.LOGIN_API, form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(form));
      } else {
        localStorage.removeItem("rememberedUser");
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 1. Background updated to match Dashboard gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 p-4 font-sans selection:bg-teal-200">
      
      {/* 2. Card container updated to match Dashboard aesthetic (clean white, soft shadow) */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white shadow-xl border border-slate-100">
        
        {/* Added Branding Logo to match Header */}
        <div className="flex justify-center mb-6">
            <img 
              src="video/healware-logo.png" // Make sure this file is in your 'public' folder
              alt="Healware Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
            />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
          Sign in to Healware
        </h2>

        {/* Error Message - updated colors */}
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
               value={form.email}
               onChange={handleChange}
               // 3. Inputs updated to use slate borders and teal focus rings
               className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
               required
             />
          </div>
          
          <div>
             <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">Password</label>
             <input
               type="password"
               name="password"
               placeholder="••••••••"
               value={form.password}
               onChange={handleChange}
               className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-700"
               required
             />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                // 4. Checkbox accent color changed to teal
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 accent-teal-600" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-slate-600 font-medium">Remember me</span>
            </label>
            
            {/* 5. Link colors changed to teal */}
            <Link to="/forgot-password" className="font-medium text-teal-600 hover:text-teal-700 hover:underline transition">
              Forgot Password?
            </Link>
          </div>

          {/* 6. Button updated to teal gradient */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold shadow-md hover:shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-8 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-teal-600 font-bold hover:text-teal-700 hover:underline transition">
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;