// src/LandingPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, Shield, Sparkles, 
  ArrowRight, Mail, Phone, MapPin, 
  Activity, Users, Zap
} from "lucide-react";

// --- Data: Quotes Collection ---
const quotes = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", author: "Albus Dumbledore" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Out of your vulnerabilities will come your strength.", author: "Sigmund Freud" },
  { text: "Breathe. It’s just a bad day, not a bad life.", author: "Unknown" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" }
];

// --- Helper Component: Scroll Animation Wrapper ---
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  
  // --- Spark Logic ---
  const [spark, setSpark] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateSpark = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSpark(quotes[randomIndex]);
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen font-sans text-slate-700 bg-slate-50 overflow-x-hidden">
      
      {/* ================= 1. HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo (Updated to use Image) */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
            {/* Image Logo */}
            <img 
              src="video/healware-logo.png" // Make sure this file is in your 'public' folder
              alt="Healware Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="text-xl font-bold text-slate-800 tracking-wide group-hover:text-teal-700 transition">Healware</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#home" className="hover:text-teal-600 transition hover:underline underline-offset-4">Home</a>
            <a href="#spark" className="hover:text-teal-600 transition hover:underline underline-offset-4">Daily Spark</a>
            <a href="#features" className="hover:text-teal-600 transition hover:underline underline-offset-4">Services</a>
            <a href="#contact" className="hover:text-teal-600 transition hover:underline underline-offset-4">Contact</a>
          </nav>

          {/* CTA */}
          <button 
            onClick={() => navigate("/login")}
            className="hidden md:block px-5 py-2 bg-teal-600 text-white rounded-full font-semibold hover:bg-teal-700 transition shadow-lg hover:shadow-teal-500/30 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* ================= 2. BODY ================= */}
      
      {/* --- Hero Section --- */}
      <section id="home" className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop" 
            alt="Calm Morning Landscape" 
            className="w-full h-full object-cover opacity-90 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-slate-50"></div>
        </div>

        {/* Content with Animation */}
        <div className="relative z-10 text-center max-w-3xl px-6">
          <RevealOnScroll delay={100}>
            <div className="inline-block px-4 py-1 mb-6 bg-teal-100/80 backdrop-blur-sm text-teal-800 rounded-full text-sm font-semibold tracking-wide border border-teal-200 shadow-sm">
              🌿 Your Sanctuary for Mental Wellness
            </div>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300}>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight drop-shadow-sm">
              Find Peace in a <br/> <span className="text-teal-700">Chaotic World</span>
            </h1>
          </RevealOnScroll>

          <RevealOnScroll delay={500}>
            <p className="text-lg md:text-xl text-slate-700 mb-8 font-medium max-w-2xl mx-auto bg-white/40 backdrop-blur-sm p-4 rounded-xl shadow-sm">
              Track your sleep, connect with doctors, and discover your inner strength with our AI-powered mental health companion.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={700}>
            <button 
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto"
            >
              Get Started Now <ArrowRight size={20} />
            </button>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- Today's Spark (Interactive Section) --- */}
      <section id="spark" className="py-20 bg-white relative">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-1 md:p-1 shadow-2xl overflow-hidden">
              <div className="bg-slate-900/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 h-full flex flex-col items-center justify-center text-center text-white relative">
                
                {/* Decorative Elements */}
                <Sparkles className="absolute top-6 left-6 text-yellow-300 opacity-60 animate-pulse" size={40} />
                <Sparkles className="absolute bottom-6 right-6 text-yellow-300 opacity-60 animate-pulse" size={30} />

                <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                    Your Daily Dose of Clarity
                </h3>

                {/* The Spark Logic Area */}
                <div className="min-h-[150px] flex items-center justify-center w-full max-w-2xl">
                  {!spark ? (
                    // State 1: Before Clicking
                    <div className="flex flex-col items-center animate-fade-in-up">
                      <p className="text-indigo-100 mb-6 text-lg">Need a moment of inspiration? Tap below to reveal your message.</p>
                      <button 
                        onClick={generateSpark}
                        disabled={isAnimating}
                        className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:shadow-white/20 transform hover:scale-105 active:scale-95 flex items-center gap-2"
                      >
                        {isAnimating ? "Revealing..." : "✨ Reveal Today's Spark"}
                      </button>
                    </div>
                  ) : (
                    // State 2: After Clicking (Show Quote)
                    <div className="animate-fade-in flex flex-col items-center">
                        <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-4 text-yellow-50">
                        "{spark.text}"
                      </blockquote>
                      <cite className="block text-indigo-200 font-semibold not-italic mb-8">
                        — {spark.author}
                      </cite>
                      
                      <button 
                        onClick={generateSpark}
                        className="px-6 py-2 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors text-sm flex items-center gap-2"
                      >
                        <Zap size={16} /> New Spark
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* --- About / Features Grid --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Healware?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                We combine technology with compassion to provide a holistic approach to mental well-being.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <RevealOnScroll delay={100}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col">
                <div className="h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
                    alt="App Interface" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                </div>
                <div className="p-8 flex-1">
                  <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Activity size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Smart Tracking</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We provide tools like sleep tracking, mood analysis, and AI chat support to help you understand your mental patterns daily.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Card 2 */}
            <RevealOnScroll delay={300}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col">
                <div className="h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069&auto=format&fit=crop" 
                    alt="Friends Support" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                </div>
                <div className="p-8 flex-1">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Users size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Community & Clarity</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Mental health support should be accessible to everyone. We exist to bridge the gap between confusion and professional clarity.
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            {/* Card 3 */}
            <RevealOnScroll delay={500}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col">
                <div className="h-56 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Mountain Sunrise" 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                </div>
                <div className="p-8 flex-1">
                  <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Heart size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Empowerment</h3>
                  <p className="text-slate-600 leading-relaxed">
                    To create a world where seeking help is a sign of strength. We aim to empower 1 million users to find their inner peace.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ================= 3. FOOTER ================= */}
      <footer id="contact" className="bg-slate-900 text-slate-300 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Brand (Updated to use Image) */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  {/* Image Logo */}
                  <img 
                    src="video/healware-logo.png" // Ensure this is in your 'public' folder
                    alt="Healware Logo"
                    className="h-8 w-auto object-contain" 
                  />
                  <span className="text-xl font-bold text-white">Healware</span>
                </div>
                <p className="text-sm leading-relaxed mb-6 text-slate-400">
                  Your daily companion for mental wellness. Empowering you to live a happier, healthier life through technology and care.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold mb-6">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">Home</a></li>
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">About Us</a></li>
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">Services</a></li>
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">Doctors</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-bold mb-6">Support</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">FAQ</a></li>
                  <li><a href="#" className="hover:text-teal-400 transition hover:pl-1">Help Center</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-bold mb-6">Contact Us</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <Mail className="text-teal-500 shrink-0 group-hover:text-white transition" size={18} />
                    <span className="group-hover:text-white transition">support@Healware.com</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <Phone className="text-teal-500 shrink-0 group-hover:text-white transition" size={18} />
                    <span className="group-hover:text-white transition">+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-start gap-3 group cursor-pointer">
                    <MapPin className="text-teal-500 shrink-0 group-hover:text-white transition" size={18} />
                    <span className="group-hover:text-white transition">123 Wellness Way, Serenity City</span>
                  </li>
                </ul>
              </div>
            </div>
          </RevealOnScroll>

          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            © 2025 Healware. All Rights Reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;