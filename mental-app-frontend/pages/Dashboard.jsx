// src/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Moon, Music, Video, BookOpen, Stethoscope, Smile,
  ScanFace, MessageCircle, MessageSquareHeart, ArrowRight, Bot
} from "lucide-react";

// --- Utility: Scroll Reveal Component ---
const ScrollReveal = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// --- 1. Header Component ---
const Header = ({ user, navigate }) => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm">
    <div className="flex items-center gap-3 w-1/4 cursor-pointer group" onClick={() => navigate('/dashboard')}>
      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
        MH
      </div>
      <span className="text-xl font-bold text-slate-700 tracking-wide">MindHaven</span>
    </div>

    <nav className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
      <a onClick={() => navigate("/dashboard")} className="cursor-pointer hover:text-teal-600 transition">Home</a>
      <a href="#" className="hover:text-teal-600 transition">About Us</a>
      <a href="#" className="hover:text-teal-600 transition">Contact</a>
    </nav>

    <div className="flex items-center justify-end gap-3 w-1/4">
      <div 
        onClick={() => navigate('/profile')} 
        className="flex items-center gap-3 cursor-pointer hover:bg-white/50 p-2 rounded-xl transition-all"
        title="View My Account & Tracker"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-700">{user?.name || "Guest"}</p>
          <p className="text-xs text-slate-500">{user?.email || "No email"}</p>
        </div>
        <div className="p-2 bg-teal-100 rounded-full text-teal-700">
          <User size={24} />
        </div>
      </div>
    </div>
  </header>
);

// --- 2. Floating Chatbot Button (New) ---
const FloatingChatbot = ({ navigate }) => (
  <div className="fixed bottom-8 right-8 z-50">
    <button 
      onClick={() => navigate('/chatbot')}
      className="group relative flex items-center justify-center w-16 h-16 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 animate-bounce-slow"
    >
      <Bot size={32} />
      
      {/* Pulse Effect Ring */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20 animate-ping"></span>
      
      {/* Tooltip Label */}
      <span className="absolute right-20 bg-slate-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        Chat with AI
      </span>
    </button>
  </div>
);

// --- 3. Footer Component ---
const Footer = () => (
  <footer className="bg-slate-800 text-slate-300 py-10">
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

  // Updated Features List (Chatbot Removed, Face Rec & Sleep Tracker Fixed)
  const features = [
    { 
      title: "Face Recognition", 
      desc: "Scan your facial expressions to detect mood patterns. Our AI analyzes subtle cues to help you understand your emotional well-being.", 
      icon: <ScanFace size={40} />, 
      path: "/face-recognition", 
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    { 
      title: "Sleep Tracker", 
      desc: "Monitor your sleep cycles to wake up refreshed. We analyze your rest patterns to suggest better bedtime habits.", 
      icon: <Moon size={40} />, 
      path: "/sleep-tracker", 
      color: "bg-violet-50 text-violet-600 border-violet-100"
    },
    { 
      title: "Your Doctors", 
      desc: "Connect directly with certified psychiatrists. Schedule appointments and get professional help when you need it most.", 
      icon: <Stethoscope size={40} />, 
      path: "/doctors", 
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    // Note: Chatbot removed from here
    { 
      title: "Relaxing Music", 
      desc: "Immerse yourself in spiritual sounds and binaural beats designed to lower anxiety and induce deep meditation.", 
      icon: <Music size={40} />, 
      path: "/music-therapy", 
      color: "bg-rose-50 text-rose-600 border-rose-100"
    },
    { 
      title: "Yoga & Video", 
      desc: "Physical wellness meets mental peace. Follow guided yoga sessions and therapeutic videos tailored for stress relief.", 
      icon: <Video size={40} />, 
      path: "/video-therapy", 
      color: "bg-teal-50 text-teal-600 border-teal-100"
    },
    { 
      title: "Books Library", 
      desc: "Feed your soul with our curated collection of mental health books, poetry, and self-help literature.", 
      icon: <BookOpen size={40} />, 
      path: "/books-library", 
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-emerald-50 text-slate-700 font-sans selection:bg-teal-200">
      
      <Header user={user} navigate={navigate}/>
      
      {/* Floating Chatbot Button */}
      <FloatingChatbot navigate={navigate} />

      {/* --- HERO SECTION --- */}
      <div className="relative w-full mt-16"> 
        <img 
          src="background-img.png" 
          alt="Find Your Inner Calm" 
          className="w-full h-auto min-h-[500px] object-cover block"
        />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-teal-50 to-transparent"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Explore Your Wellness Tools
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Discover a variety of features designed to help you regain balance and find peace.
          </p>
        </div>

        <div className="flex flex-col gap-24 mb-24">
          {features.map((feature, index) => (
            <ScrollReveal key={index}>
              <div 
                className={`
                  flex flex-col md:flex-row items-center gap-8 md:gap-16 
                  ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}
                `}
              >
                {/* Visual Side */}
                <div 
                  onClick={() => navigate(feature.path)}
                  className={`
                    w-full md:w-1/2 aspect-video rounded-3xl shadow-xl flex items-center justify-center cursor-pointer
                    transition-transform duration-500 hover:scale-[1.02] border-4 ${feature.color}
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-white rounded-full shadow-sm">
                      {feature.icon}
                    </div>
                    <span className="font-semibold text-lg opacity-80">Click to Open</span>
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                  <div className={`
                    inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2
                    ${feature.color.replace('border-', 'bg-').replace('50', '100')}
                  `}>
                    Feature 0{index + 1}
                  </div>
                  
                  <h3 className="text-3xl font-bold text-slate-800">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {feature.desc}
                  </p>

                  <button 
                    onClick={() => navigate(feature.path)}
                    className="group inline-flex items-center gap-2 font-semibold text-teal-600 hover:text-teal-700 transition-colors mt-2"
                  >
                    Try this feature 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* --- FEEDBACK SECTION --- */}
        <ScrollReveal>
          <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-teal-500/20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 transition-all group-hover:bg-indigo-500/20"></div>

            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <MessageSquareHeart size={48} className="text-teal-400" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                We Value Your Thoughts
              </h2>
              
              <p className="text-slate-300 max-w-xl text-lg">
                Your feedback helps us create a better sanctuary for everyone. 
                Let us know how we can improve your MindHaven experience.
              </p>

              <button 
                onClick={() => navigate('/feedback')}
                className="mt-4 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-teal-500/30 flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Give Feedback
              </button>
            </div>
          </div>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;