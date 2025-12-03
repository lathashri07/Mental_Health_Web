// src/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello, I'm Dr. Nova. I've analyzed your recent sleep patterns. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Call the Backend API
      const token = localStorage.getItem("token"); // Assuming you store JWT here
      const response = await fetch("http://localhost:3000/virtual-doctor/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Add AI Response
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "bot", text: data.reply },
        ]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "I'm having trouble connecting right now. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 fixed top-0 w-full z-10">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="p-2 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft className="text-slate-600" />
        </button>
        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dr. Nova (AI)</h1>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Online & Analyzed your Data
          </p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 pt-24 pb-24 px-4 md:px-20 overflow-y-auto">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "user" ? "bg-indigo-100 text-indigo-600" : "bg-teal-100 text-teal-600"
                }`}
              >
                {msg.sender === "user" ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl max-w-[80%] leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Dr. Nova is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-slate-100">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-slate-100 text-slate-800 rounded-full py-3 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;