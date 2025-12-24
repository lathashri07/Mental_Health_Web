// src/Profile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Calendar, TrendingUp, 
  Smile, Frown, Meh, Moon, MessageSquare, ArrowLeft 
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  
  // --- FIX: ROBUST USER DATA RETRIEVAL ---
  // 1. Get raw data
  const rawUser = JSON.parse(localStorage.getItem("user"));
  
  // 2. Create a safe user object with defaults if data is missing
  const user = {
    name: rawUser?.name || "Guest User",
    email: rawUser?.email || "guest@example.com",
    joinDate: rawUser?.joinDate || "Oct 2024"
  };

  // 3. MOCK DATA
  const userStats = {
    moods: {
      totalDays: 30,
      happy: 18,
      neutral: 8,
      sad: 4,
      depressed: 0
    },
    sleep: {
      average: "7h 15m", 
      quality: "Good"
    },
    interactions: 145 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 font-sans text-slate-700 p-6 md:p-12">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors mb-8 font-semibold"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: User Card --- */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-teal-600/10"></div>
            
            <div className="relative">
              {/* FIX: Ensure charAt always has a string to work with */}
              <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg ring-4 ring-white">
                {(user.name || "G").charAt(0).toUpperCase()}
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              
              <div className="flex flex-col gap-3 text-left text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-teal-500"/>
                  <span>Joined: {user.joinDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-teal-500"/>
                  <span>Verified Account</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition shadow-lg">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Motivation Card */}
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-8 rounded-3xl shadow-xl text-white">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <TrendingUp size={20}/> Your Progress
            </h3>
            <p className="opacity-90 italic">
              "You've had 18 Happy days this month! Your sleep pattern has improved by 10% since last week. Keep going!"
            </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: User Tracker / Analytics --- */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">My Wellness Tracker</h2>
          <p className="text-slate-500 mb-6">Based on your Face Recognition, Chatbot History, and Sleep Data.</p>

          {/* 1. Mood Analysis Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
              icon={<Smile size={24} />} 
              label="Happy Days" 
              value={userStats.moods.happy} 
              subtext="Detected via Face ID"
              color="bg-emerald-100 text-emerald-700"
            />
            <StatCard 
              icon={<Meh size={24} />} 
              label="Neutral Days" 
              value={userStats.moods.neutral} 
              subtext="Stable Mood"
              color="bg-amber-100 text-amber-700"
            />
            <StatCard 
              icon={<Frown size={24} />} 
              label="Difficult Days" 
              value={userStats.moods.sad} 
              subtext="Needs attention"
              color="bg-rose-100 text-rose-700"
            />
          </div>

          {/* 2. Detailed Visualizations */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white/50">
            <h3 className="font-bold text-slate-800 mb-6">Monthly Mood Distribution</h3>
            
            {/* Custom Progress Bar Chart */}
            <div className="space-y-4">
              <ProgressBar label="Happiness" percent={(userStats.moods.happy / 30) * 100} color="bg-emerald-500" />
              <ProgressBar label="Neutrality" percent={(userStats.moods.neutral / 30) * 100} color="bg-amber-400" />
              <ProgressBar label="Sadness/Depression" percent={(userStats.moods.sad / 30) * 100} color="bg-rose-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sleep Stats */}
            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-3 mb-4 text-indigo-700">
                <Moon size={24} />
                <h3 className="font-bold">Sleep Insights</h3>
              </div>
              <div className="text-4xl font-bold text-slate-800 mb-1">{userStats.sleep.average}</div>
              <p className="text-sm text-slate-500">Average nightly sleep</p>
              <div className="mt-4 text-xs font-semibold bg-white inline-block px-3 py-1 rounded-full text-indigo-600 shadow-sm">
                Quality: {userStats.sleep.quality}
              </div>
            </div>

            {/* Chatbot Stats */}
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4 text-blue-700">
                <MessageSquare size={24} />
                <h3 className="font-bold">Therapy Chat</h3>
              </div>
              <div className="text-4xl font-bold text-slate-800 mb-1">{userStats.interactions}</div>
              <p className="text-sm text-slate-500">Conversations held</p>
              <div className="mt-4 text-xs font-semibold bg-white inline-block px-3 py-1 rounded-full text-blue-600 shadow-sm">
                Status: Active
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper Components for Profile
const StatCard = ({ icon, label, value, subtext, color }) => (
  <div className={`p-6 rounded-2xl ${color} flex flex-col justify-between h-32`}>
    <div className="flex justify-between items-start">
      <div className="bg-white/40 p-2 rounded-lg">{icon}</div>
      <span className="text-3xl font-bold">{value}</span>
    </div>
    <div>
      <p className="font-semibold">{label}</p>
      <p className="text-xs opacity-75">{subtext}</p>
    </div>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="text-slate-500">{Math.round(percent)}%</span>
    </div>
    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

export default Profile;