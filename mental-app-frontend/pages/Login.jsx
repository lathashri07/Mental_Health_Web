import { useState, useEffect } from "react"; // Import useEffect
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../components/utils/apiEndpoints";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false); // State for the checkbox
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // This effect runs when the component loads
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
    try {
      const res = await axios.post(apiEndpoints.LOGIN_API, form);
      localStorage.setItem("user", JSON.stringify(res.data));

      // Handle "Remember Me" logic
      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(form));
      } else {
        localStorage.removeItem("rememberedUser");
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/Cover_image.png')`,
      }}
    >
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-xl shadow-red-500/30">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Login Page
        </h2>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/40 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner placeholder-gray-600"
            required
          />
          <div className="flex items-center justify-between text-sm text-white/80">
            {/* ✅ MODIFIED: Remember Me Checkbox */}
            <label className="flex items-center space-x-2 text-purple-500">
              <input 
                type="checkbox" 
                className="accent-red-300" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            
            {/* ✅ MODIFIED: Forgot Password Link */}
            <Link to="/forgot-password" className="hover:text-red-500 text-purple-500">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-pink-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;