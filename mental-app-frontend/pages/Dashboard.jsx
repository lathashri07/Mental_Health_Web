// src/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Moon, Music, Video, BookOpen, Stethoscope, Smile,
  ScanFace, MessageCircle, MessageSquareHeart, ArrowRight, Bot,
  Mail, Phone, MapPin, Facebook, Twitter, Instagram, Globe, Heart
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

// --- Helper: Smooth Scroll ---
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// --- 1. Header Component ---
const Header = ({ user, navigate }) => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm">
    <div className="flex items-center gap-3 w-1/4 cursor-pointer group" onClick={() => navigate('/dashboard')}>
      <img 
          src="video/healware-logo.png" // Make sure this file is in your 'public' folder
          alt="Healware Logo"
          className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
      />
      <span className="text-xl font-bold text-slate-700 tracking-wide">Healware</span>
    </div>

    <nav className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
      <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="cursor-pointer hover:text-teal-600 transition">Home</a>
      <a onClick={() => scrollToSection('about')} className="cursor-pointer hover:text-teal-600 transition">About Us</a>
      <a onClick={() => scrollToSection('contact')} className="cursor-pointer hover:text-teal-600 transition">Contact</a>
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

// --- 2. Floating Chatbot Button ---
const FloatingChatbot = ({ navigate }) => (
  <div className="fixed bottom-8 right-8 z-50">
    <button 
      onClick={() => navigate('/chatbot')}
      className="group relative flex items-center justify-center w-16 h-16 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 animate-bounce-slow"
    >
      <Bot size={32} />
      <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20 animate-ping"></span>
      <span className="absolute right-20 bg-slate-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        Chat with AI
      </span>
    </button>
  </div>
);

// --- 3. Footer Component ---
const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-white">
           <img 
              src="video/healware-logo.png" // Make sure this file is in your 'public' folder
              alt="Healware Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
            />
          <span className="text-lg font-bold">Healware</span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Your digital sanctuary for mental wellness. We combine technology with compassion to help you find your inner peace.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-teal-400 cursor-pointer transition">Home</a></li>
          <li><a onClick={() => scrollToSection('about')} className="hover:text-teal-400 cursor-pointer transition">About Us</a></li>
          <li><a onClick={() => scrollToSection('contact')} className="hover:text-teal-400 cursor-pointer transition">Contact Support</a></li>
        </ul>
      </div>

      {/* Legal */}
      <div>
        <h4 className="text-white font-semibold mb-4">Legal</h4>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Terms of Service</a></li>
          <li><a href="#" className="hover:text-teal-400 transition">Cookie Policy</a></li>
        </ul>
      </div>

      {/* Socials */}
      <div>
        <h4 className="text-white font-semibold mb-4">Follow Us</h4>
        <div className="flex gap-4">
          <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
            <Facebook size={18} />
          </a>
          <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
            <Twitter size={18} />
          </a>
          <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </div>
    
    <div className="text-center text-xs text-slate-500 mt-12 pt-8 border-t border-slate-800">
      <p>&copy; 2024 Healware. Built with <Heart size={10} className="inline text-red-500 mx-1"/> for a better world.</p>
    </div>
  </footer>
);

// --- Main Dashboard Component ---
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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

        {/* FEATURES GRID (Zig Zag) */}
        <div className="flex flex-col gap-24 mb-32">
          {features.map((feature, index) => (
            <ScrollReveal key={index}>
              <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div 
                  onClick={() => navigate(feature.path)}
                  className={`w-full md:w-1/2 aspect-video rounded-3xl shadow-xl flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-[1.02] border-4 ${feature.color}`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-white rounded-full shadow-sm">
                      {feature.icon}
                    </div>
                    <span className="font-semibold text-lg opacity-80">Click to Open</span>
                  </div>
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${feature.color.replace('border-', 'bg-').replace('50', '100')}`}>
                    Feature 0{index + 1}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{feature.desc}</p>
                  <button onClick={() => navigate(feature.path)} className="group inline-flex items-center gap-2 font-semibold text-teal-600 hover:text-teal-700 transition-colors mt-2">
                    Try this feature <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* --- FEEDBACK SECTION --- */}
        <ScrollReveal>
          <div className="w-full bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden group mb-32">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-teal-500/20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 transition-all group-hover:bg-indigo-500/20"></div>
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm"><MessageSquareHeart size={48} className="text-teal-400" /></div>
              <h2 className="text-3xl md:text-4xl font-bold">We Value Your Thoughts</h2>
              <p className="text-slate-300 max-w-xl text-lg">Your feedback helps us create a better sanctuary. Let us know how we can improve.</p>
              <button onClick={() => navigate('/feedback')} className="mt-4 px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-teal-500/30 flex items-center gap-2">
                <MessageCircle size={20} /> Give Feedback
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* --- ABOUT US SECTION --- */}
        <div id="about" className="mb-32 scroll-mt-24">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-12 items-center bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-100">
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold text-slate-800 border-l-4 border-teal-500 pl-4">About Healware</h2>
                <p className="text-slate-600 leading-relaxed">
                  We believe that mental wellness is a journey, not a destination. In a world that never stops moving, Healware is your digital sanctuary—a place to pause, reflect, and grow.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Founded by a team of engineers and psychologists, we combine cutting-edge AI technology with compassionate care to provide tools that are accessible to everyone, everywhere.
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-teal-600">10k+</span>
                    <span className="text-xs text-slate-500">Users Helped</span>
                  </div>
                  <div className="text-center border-l border-slate-200 pl-4">
                    <span className="block text-2xl font-bold text-teal-600">50+</span>
                    <span className="text-xs text-slate-500">Expert Doctors</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="aspect-square rounded-2xl bg-teal-50 flex items-center justify-center relative overflow-hidden group">
                   <img 
                      src="video/healware-logo.png" 
                      alt="Healware Logo"
                      // Changed size-128 to w-2/3 and added drop-shadow
                      className="w-2/3 h-auto object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-700 z-10" 
                   />
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-teal-100/50 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* --- CONTACT SECTION --- */}
        <div id="contact" className="mb-20 scroll-mt-24">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800">Get in Touch</h2>
              <p className="text-slate-500 mt-2">We are here to listen. Reach out to us anytime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email Card */}
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-all text-center group">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Email Us</h3>
                <p className="text-slate-500 text-sm">support@Healware.com</p>
                <p className="text-slate-500 text-sm">help@Healware.com</p>
              </div>

              {/* Phone Card */}
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-all text-center group">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Phone size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Call Us</h3>
                <p className="text-slate-500 text-sm">+1 (555) 123-4567</p>
                <p className="text-slate-500 text-sm">Mon-Fri, 9am - 6pm</p>
              </div>

              {/* Location Card */}
              <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-all text-center group">
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <MapPin size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">Visit Us</h3>
                <p className="text-slate-500 text-sm">123 Serenity Lane</p>
                <p className="text-slate-500 text-sm">Wellness City, WC 56789</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;