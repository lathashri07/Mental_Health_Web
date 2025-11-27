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

        <div className="p-6 bg-purple-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-purple-700 transition flex flex-col justify-center" 
        onClick={() => navigate("/virtual-doctor")}
>
        <h2 className="text-2xl font-bold mb-2">Consult Virtual AI Doctor 🤖</h2>
        <p>Have a conversation with our AI assistant.</p>
        </div>

        {/* NEW: My Chatbot Card */}
        <div
          className="p-6 bg-indigo-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-indigo-600 transition flex flex-col justify-center"
          onClick={() => navigate("/chatbot")} >  {/* Navigate to the chatbot page */}
          <h2 className="text-2xl font-bold mb-2">My Chatbot 💬</h2>
          <p>Engage with your personalized AI mental health assistant.</p>
        </div>

        {/* NEW: Music Therapy Card */}
        <div
          className="p-6 bg-rose-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-rose-600 transition flex flex-col justify-center"
          onClick={() => navigate("/music-therapy")} 
        >
          <h2 className="text-2xl font-bold mb-2">Relaxing Music 🎧</h2>
          <p>Instrumental & Spiritual sounds for deep relaxation.</p>
        </div>

        {/* NEW: Video Guides Card */}
        <div
          className="p-6 bg-teal-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-teal-700 transition flex flex-col justify-center"
          onClick={() => navigate("/video-therapy")} 
        >
          <h2 className="text-2xl font-bold mb-2">Yoga & Meditation 🧘‍♀️</h2>
          <p>Guided videos for physical and mental wellness.</p>
        </div>

        {/* NEW: Books & Reading Card */}
        <div
          className="p-6 bg-pink-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-pink-700 transition flex flex-col justify-center"
          onClick={() => navigate("/books-library")} 
        >
          <h2 className="text-2xl font-bold mb-2">Books & Reading</h2>
          <p>Books & Reading for mental wellness.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;