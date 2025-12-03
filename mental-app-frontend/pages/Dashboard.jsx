// src/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Home, Info, Phone, 
  ScanFace, MessageCircle, MessageSquareHeart, 
  Moon, Music, Video, BookOpen, Stethoscope, Smile
} from "lucide-react";

// --- 1. Header Component ---
const Header = ({ user, navigate }) => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm">
    {/* Top Left: Logo */}
    <div className="flex items-center gap-3 w-1/4 cursor-pointer group" onClick={() => navigate('/dashboard')}>
      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        MH
      </div>
      <span className="text-xl font-bold text-slate-700 tracking-wide">MindHaven</span>
    </div>

    {/* Center: Navigation */}
    <nav className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
      <a onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-teal-600 transition">Home</a>
      <a href="#" className="hover:text-teal-600 transition">About Us</a>
      <a href="#" className="hover:text-teal-600 transition">Contact</a>
    </nav>

    {/* Top Right: User Profile */}
    <div className="flex items-center justify-end gap-3 w-1/4">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-semibold text-slate-700">{user?.name || "Guest"}</p>
        <p className="text-xs text-slate-500">{user?.email || "No email"}</p>
      </div>
      <div className="p-2 bg-teal-100 rounded-full text-teal-700">
        <User size={24} />
      </div>
    </div>
  </header>
);

// --- 2. Sidebar / Left Dock ---
const Sidebar = ({ navigate }) => (
  <aside className="fixed left-4 top-1/3 z-40 flex flex-col gap-4 bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50">
    <SidebarItem icon={<ScanFace size={24} />} label="Face Rec" onClick={() => navigate('/face-recognition')} />
    <SidebarItem icon={<MessageSquareHeart size={24} />} label="Chatbot" onClick={() => navigate('/chatbot')} />
    <SidebarItem icon={<MessageCircle size={24} />} label="Feedback" onClick={() => navigate('/feedback')} />
  </aside>
);

const SidebarItem = ({ icon, label, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative p-3 rounded-xl hover:bg-teal-500 hover:text-white text-slate-600 cursor-pointer transition-all duration-300 flex items-center justify-center"
  >
    {icon}
    {/* Tooltip */}
    <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {label}
    </span>
  </div>
);

// --- 3. Footer Component ---
const Footer = () => (
  <footer className="bg-slate-800 text-slate-300 py-10 mt-20">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-white font-bold text-lg mb-4">MindHaven</h3>
        <p className="text-sm">Your sanctuary for mental wellness and inner peace.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Features</h4>
        <ul className="space-y-2 text-sm">
          <li>Sleep Tracker</li>
          <li>AI Chatbot</li>
          <li>Music Therapy</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Company</h4>
        <ul className="space-y-2 text-sm">
          <li>About Us</li>
          <li>Careers</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Connect</h4>
        <div className="flex gap-4">
          {/* Social Placeholders */}
          <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
          <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
          <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </div>
    <div className="text-center text-xs mt-10 border-t border-slate-700 pt-6">
      © 2024 MindHaven. All rights reserved.
    </div>
  </footer>
);

// --- Main Dashboard Component ---
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Features Data to map through
  const features = [
    { 
      title: "Sleep Tracker", 
      desc: "Analyze your sleep patterns for better rest.", 
      icon: <Moon size={32} />, 
      path: "/sleep-tracker", 
      color: "bg-indigo-50 text-indigo-600 hover:ring-indigo-200"
    },
    { 
      title: "Your Doctors", 
      desc: "Connect with certified psychiatrists nearby.", 
      icon: <Stethoscope size={32} />, 
      path: "/doctors", 
      color: "bg-emerald-50 text-emerald-600 hover:ring-emerald-200"
    },
    { 
      title: "My Chatbot", 
      desc: "Your AI companion for mental clarity.", 
      icon: <Smile size={32} />, 
      path: "/chatbot", 
      color: "bg-blue-50 text-blue-600 hover:ring-blue-200"
    },
    { 
      title: "Relaxing Music", 
      desc: "Spiritual sounds for deep meditation.", 
      icon: <Music size={32} />, 
      path: "/music-therapy", 
      color: "bg-rose-50 text-rose-600 hover:ring-rose-200"
    },
    { 
      title: "Yoga & Video", 
      desc: "Guided sessions for physical wellness.", 
      icon: <Video size={32} />, 
      path: "/video-therapy", 
      color: "bg-teal-50 text-teal-600 hover:ring-teal-200"
    },
    { 
      title: "Books Library", 
      desc: "Reading material to soothe the soul.", 
      icon: <BookOpen size={32} />, 
      path: "/books-library", 
      color: "bg-amber-50 text-amber-600 hover:ring-amber-200"
    },
  ];

  return (
    // Main Container with "Calm" Background Gradient
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 text-slate-700 font-sans selection:bg-teal-200">
      
      <Header user={user} navigate={navigate}/>
      <Sidebar navigate={navigate} />

      <main className="pt-24 pb-12 pl-20 pr-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Transparent Hero Section */}
        <div className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl mb-12 group">
          {/* Background Image */}
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" 
            alt="Calm Ocean" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          {/* Glass Overlay with Message */}
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center p-6 backdrop-blur-[2px]">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-lg max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
                Find Your Inner Calm
              </h1>
              <p className="text-white/90 text-lg font-medium">
                "Peace comes from within. Do not seek it without."
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 pl-2 border-l-4 border-teal-500">
            Wellness Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                className={`
                  relative p-6 rounded-2xl shadow-sm border border-slate-100 
                  cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 
                  flex flex-col items-start gap-4 bg-white ${feature.color}
                `}
              >
                {/* Icon Circle */}
                <div className={`p-4 rounded-xl ${feature.color.split(' ')[0]} brightness-95`}>
                  {feature.icon}
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                {/* Decorative Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                  ↗
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;