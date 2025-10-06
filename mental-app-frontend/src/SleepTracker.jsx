// src/SleepTracker.jsx

import React, { useState, useEffect } from 'react';
import SleepGraph from './SleepGraph';
import DailyFeedback from './DailyFeedback';
import WeeklyFeedback from './WeeklyFeedback';
import { useInactivityDetector } from './useInactivityDetector'; // Make sure this import is present
import { GoogleGenerativeAI } from "@google/generative-ai";

// 🤖 1. Function to generate the AI greeting
const generateGreeting = async (userName) => {
  // Ensure you have the API key in your .env.local file
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key not found.");
    return "Good morning! Have a wonderful day."; // Fallback message
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a short, positive, one-sentence good morning message for ${userName}, a user of a sleep tracking app. Be creative, uplifting, and mention the new day.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating AI greeting:", error);
    return `Good morning, ${userName}! Wishing you a great day ahead.`; // Fallback on error
  }
};

// 🗣️ 2. Function to make the browser speak
const speakMessage = (text) => {
  // Check if the browser supports the Speech Synthesis API
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: Configure voice, pitch, rate
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("Sorry, your browser does not support text-to-speech.");
  }
};

function SleepTracker() {
  const [sleepData, setSleepData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // State for the input form
  const [sleepTime, setSleepTime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');

  // Read the saved preference from localStorage when the component first loads.
  // The value is stored as a string 'true' or 'false', so we compare it.
  const [autoDetect, setAutoDetect] = useState(() => {
    const savedPreference = localStorage.getItem('autoDetectSleep');
    return savedPreference === 'true';
  });

  // This effect runs whenever the 'autoDetect' state changes.
  // It saves the new value ('true' or 'false') to localStorage.
  useEffect(() => {
    localStorage.setItem('autoDetectSleep', autoDetect);
  }, [autoDetect]);

  // This effect runs once to load initial data from the browser's storage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('sleepData')) || [];
    setSleepData(data);

    // Automatically select the most recent day when the app loads
    if (data.length > 0) {
      setSelectedDate(data[data.length - 1].date);
    }
  }, []);
  
  // Logic for automatic sleep detection
  const handleInactivity = React.useCallback(() => {
    if (!autoDetect) return;
    const now = new Date();
    const currentHour = now.getHours();
    const isSleepWindow = currentHour >= 22 || currentHour < 4;

    if (isSleepWindow) {
      const formattedTime = now.toTimeString().slice(0, 5);
      setSleepTime(formattedTime);
      alert(`We noticed you might be asleep! Setting sleep time to ${formattedTime}.`);
      setAutoDetect(false);
    }
  }, [autoDetect]);

  useInactivityDetector(handleInactivity, 30 * 60 * 1000);

  // This function handles all the logic for saving a sleep entry
  const handleSaveSchedule = () => {
    // 1. Calculate duration
    const sleep = new Date(`2000-01-01T${sleepTime}:00`);
    const wake = new Date(`2000-01-01T${wakeTime}:00`);
    let diff = wake.getTime() - sleep.getTime();
    if (diff < 0) { // Woke up the next day
        diff += 24 * 60 * 60 * 1000;
    }
    const duration = diff / (1000 * 60 * 60);

    // 2. Create the new entry object
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
        date: today,
        sleepTime,
        wakeTime,
        duration: parseFloat(duration.toFixed(2)),
    };

    // 3. Update the data in localStorage
    const existingData = JSON.parse(localStorage.getItem('sleepData')) || [];
    const todayIndex = existingData.findIndex(entry => entry.date === today);

    if (todayIndex > -1) {
        existingData[todayIndex] = newEntry; // Update today's entry
    } else {
        existingData.push(newEntry); // Add a new entry
    }
    
    localStorage.setItem('sleepData', JSON.stringify(existingData));
    alert('Sleep data saved successfully!');

    // 4. Update the state to re-render the app with the new data
    setSleepData(existingData);
    setSelectedDate(newEntry.date);
  };
  
  // Find the data object for the currently selected day
  const selectedDayData = sleepData.find(d => d.date === selectedDate);
  
  // Determine if the weekly report should be shown
  const showWeeklyReport = sleepData.length > 0 && sleepData.length % 7 === 0;

  // ✅ NEW: This effect handles the morning greeting
  useEffect(() => {
    const handleMorningGreeting = async () => {
      const now = new Date();
      const currentHour = now.getHours();
      const today = now.toISOString().split('T')[0]; // Get date in "YYYY-MM-DD" format

      const lastGreetingDate = localStorage.getItem('lastGreetingDate');

      // Trigger only between 5 AM and 11 AM, and only once per day
      if (currentHour >= 5 && currentHour < 12 && lastGreetingDate !== today) {
        
        // Get user name from localStorage (or set a default)
        const user = JSON.parse(localStorage.getItem("user"));
        const userName = user?.name || "there";

        const greetingMessage = await generateGreeting(userName);
        speakMessage(greetingMessage);
        
        // Mark that the greeting has been given for today
        localStorage.setItem('lastGreetingDate', today);
      }
    };

    handleMorningGreeting();
  }, []); // The empty array [] means this effect runs only once when the component mounts

  return (
    <div className="flex flex-col min-h-screen items-center justify-start bg-gray-100 p-4 gap-8 pt-8">
      {/* ======================= INPUT CARD ======================= */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Set Your Sleep Schedule 🌙
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="sleepTime" className="block text-sm font-medium text-gray-700">Your ideal bedtime:</label>
            <input type="time" id="sleepTime" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="wakeTime" className="block text-sm font-medium text-gray-700">Your ideal wake-up time:</label>
            <input type="time" id="wakeTime" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Auto-detect sleep time</span>
          <label htmlFor="auto-detect-toggle" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="auto-detect-toggle" className="sr-only peer" checked={autoDetect} onChange={() => setAutoDetect(!autoDetect)}/>
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <button onClick={handleSaveSchedule} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Save Today's Sleep
        </button>
      </div>

      {/* ======================= ANALYSIS SECTION ======================= */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
          <SleepGraph
            sleepData={sleepData}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <DailyFeedback dayData={selectedDayData} />
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          {showWeeklyReport ? (
            <WeeklyFeedback weekData={sleepData.slice(-7)} />
          ) : (
            <div className="text-center p-4 flex flex-col justify-center h-full">
                <h3 className="text-xl font-bold text-gray-800">Weekly Report</h3>
                <p className="text-gray-500 mt-2">
                    Your 7-day sleep score will appear here after you've logged {7 - (sleepData.length % 7)} more nights.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SleepTracker;