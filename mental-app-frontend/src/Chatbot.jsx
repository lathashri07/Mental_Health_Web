// src/Chatbot.jsx

import React from 'react';

function Chatbot() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">My AI Assistant</h1>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-grow p-4 overflow-y-auto">
        {/* This div will hold all the chat messages */}
        <div className="flex flex-col space-y-4">
        
          {/* Example Bot Message */}
          <div className="flex items-start">
            <div className="bg-purple-500 text-white rounded-lg p-3 max-w-xs">
              <p>Hello! How can I help you today?</p>
            </div>
          </div>

          {/* Example User Message */}
          <div className="flex items-start justify-end">
            <div className="bg-blue-500 text-white rounded-lg p-3 max-w-xs">
              <p>I'd like to talk about my day.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white p-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your message here..."
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600">
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Chatbot;