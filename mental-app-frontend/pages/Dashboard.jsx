// src/Dashboard.jsx

import { useNavigate } from "react-router-dom"; // for navigation

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Welcome Card */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name} 👋</h2>
          <p>Email: {user?.email}</p>
        </div>

        {/* Sleep Tracker Card */}
        <div
          className="p-6 bg-blue-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-600 transition flex flex-col justify-center"
          onClick={() => navigate("/sleep-tracker")} // Navigate on click
        >
          <h2 className="text-2xl font-bold mb-2">Sleep Tracker 🌙</h2>
          <p>Set your sleep schedule and track your patterns.</p>
        </div>

        {/* NEW: Your Doctors Card */}
        <div
          className="p-6 bg-green-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-600 transition flex flex-col justify-center"
          onClick={() => navigate("/doctors")} // Navigate to the new doctors page
        >
          <h2 className="text-2xl font-bold mb-2">Your Doctors 👨‍⚕️</h2>
          <p>Find and connect with psychiatrists near you.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;